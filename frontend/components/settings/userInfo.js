import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    Switch,
    Alert,
} from "react-native";
import { useStore } from "../../store/store";
import {
    getUser,
    updateUser,
    deleteUserFirestore,
    uploadUserImage,
    removeGeohash,
} from "./../../actions/firestore";
import {
    getAuth,
    signOut,
    updatePassword,
    updateEmail,
    deleteUser,
    sendEmailVerification,
} from "firebase/auth";
import ChoicePopup from "../errors/customChoicePopup";
import ErrorPopUp from "../errors/customErrorPopup";
import { useRoute } from "@react-navigation/native";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import * as ImagePicker from "expo-image-picker";

WebBrowser.maybeCompleteAuthSession();
const UserInfo = ({ navigation }) => {
    const spotifyAuthConfig = {
        clientId: "3506450ac660493e9445f47d3e4a44aa",
        redirectUrl: AuthSession.makeRedirectUri(),
        scopes: [
            "user-read-email",
            "playlist-read-private",
            "user-modify-playback-state",
            "user-read-playback-state",
            "streaming",
        ],
    };
    const route = useRoute();
    const auth = getAuth();
    const {
        uid,
        setUserBio,
        setUserName,
        setIsAuthorized,
        setUserImg,
        userName,
        userBio,
        userImg,
        setSpotifyRefreshToken,
        setSpotifyAccessToken,
        spotifyRefreshToken,
        defaultUserImg,
        setUID,
        setUserSocket,
        userSocket,
        setLastSendDatetime,
        setUserEmail,
    } = useStore();
    const [warningVisible, setWarningVisible] = useState(false);
    const [warningMessage, setWarningMessage] = useState("");
    const [errorVisible, setErrorVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [username, setUsername] = useState(userName);
    const [bio, setBio] = useState(userBio);
    const [img, setImg] = useState(userImg);

    // spotify auth requrest
    const codeVerifier = useRef("");
    const discovery = {
        authorizationEndpoint: "https://accounts.spotify.com/authorize",
        tokenEndpoint: "https://accounts.spotify.com/api/token",
    };
    const [_request, response, promptAsync] = AuthSession.useAuthRequest(
        {
            clientId: spotifyAuthConfig.clientId,
            scopes: spotifyAuthConfig.scopes,
            usePKCE: true,
            redirectUri: spotifyAuthConfig.redirectUrl,
            codeChallengeMethod: "S256",
        },
        discovery
    );

    // use effect
    useEffect(() => {
        // to not make db call everytime
        const loadUserInfo = async () => {
            if (username === "" && uid != "") {
                const user = await getUser(uid);
                if (user) {
                    setBio(user.bio);
                    setUsername(user.username);
                    setUserBio(user.bio);
                    setImg(user.userImg ? user.userImg : "");
                    setUserName(user.username);
                    setSpotifyRefreshToken(user.spotifyRefreshToken);
                    setUserImg(user.userImg ? user.userImg : "");
                    setLastSendDatetime(user.lastSendDateTime);
                }
            }
        };
        loadUserInfo();
        switch (route.params?.actionType) {
            case "updateBio":
                handleUpdateBio(route.params?.val);
                break;
            case "updatePW":
                handleUpdatePassword(route.params?.val);
                break;
            case "updateEmail":
                handleUpdateEmail(route.params?.val);
                break;
            default:
        }
        if (response && spotifyRefreshToken === "") {
            if (response.error) {
                setErrorMessage(
                    "Error connecting to Spotify. Please try again"
                );
                setErrorVisible(true);
                console.log(response.error);
                return;
            }
            if (response.type === "success") {
                getSpotifyTokens();
            }
        }
    }, [route.params?.val, response, uid]);

    const getSpotifyTokens = async () => {
        try {
            codeVerifier.current = _request ? _request.codeVerifier : "";
            const res = await fetch("https://accounts.spotify.com/api/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    client_id: spotifyAuthConfig.clientId,
                    grant_type: "authorization_code",
                    code: response?.params.code,
                    redirect_uri: spotifyAuthConfig.redirectUrl,
                    code_verifier: codeVerifier.current,
                }).toString(),
            });
            const tokens = await res.json();
            if (res.ok) {
                setSpotifyAccessToken(tokens.access_token);
                setSpotifyRefreshToken(tokens.refresh_token);
                await updateUser(uid, {
                    spotifyRefreshToken: tokens.refresh_token,
                });
            } else {
                throw new Error("Failed to get tokens for Spotify");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSpotifyAuthToggle = async () => {
        try {
            if (spotifyRefreshToken === "") {
                await promptAsync();
            } else {
                // delete refresh token from db since user disables spotify access
                setSpotifyRefreshToken("");
                setSpotifyAccessToken("");
                if (uid) {
                    await updateUser(uid, { spotifyRefreshToken: "" });
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdateBio = (val) => {
        try {
            updateUser(uid, { bio: val }).then(() => {
                setBio(val);
                setUserBio(val);
            });
        } catch (e) {
            setErrorMessage("Error updating bio");
            setErrorVisible(true);
        }
    };
    const handleUpdateEmail = (val) => {
        updateEmail(auth.currentUser, val)
            .then(async () => {
                const user = auth.currentUser;
                const message = "Email updated successfully!";
                await sendEmailVerification(user);
                setUserEmail(val);
                setErrorMessage(message);
                setErrorVisible(true);
            })
            .catch((error) => {
                const message = "Error updating email. Please try again.";
                setErrorMessage(message);
                setErrorVisible(true);
            });
    };
    const handleUpdatePassword = (val) => {
        updatePassword(auth.currentUser, val)
            .then(() => {
                const message = "Password updated successfully!";
                setErrorMessage(message);
                setErrorVisible(true);
            })
            .catch((error) => {
                const message = "Error updating password. Try again.";
                setErrorMessage(message);
                setErrorVisible(true);
            });
    };
    const handleDeleteAccount = () => {
        setWarningVisible(false);
        deleteUserFirestore(auth.currentUser.uid)
            .then(async () => {
                const user = auth.currentUser;
                await deleteUserFirestore(uid);
                await removeGeohash(userName);
                // delete from firebase auth
                deleteUser(user).then(() => {
                    // return to login page
                    setUserName("");
                    setUsername("");
                    setSpotifyRefreshToken("");
                    setUserBio("");
                    setBio("");
                    setSpotifyAccessToken("");
                    setUserImg("");
                    setImg("");
                    setUID("");
                    if (userSocket) {
                        userSocket.disconnect();
                    }
                    setUserSocket(null);
                    setUserEmail("");
                    setLastSendDatetime(null);
                    setIsAuthorized(false);
                });
            })
            .catch((error) => {
                // show error dialog
                setErrorMessage("Error deleting account. Try again." + error);
                setErrorVisible(true);
            });
    };

    const pickImage = async () => {
        const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert(
                "Permission Denied",
                "We need access to your media library to pick a profile image"
            );
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaType,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            const url = await uploadUserImage(uri, uid);
            setImg(url);
            setUserImg(url);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{ marginBottom: 60 }}>
                <View style={styles.profile}>
                    <View style={styles.profileAvatarWrapper}>
                        <TouchableOpacity onPress={pickImage}>
                            <Image
                                alt=""
                                source={
                                    img !== "" ? { uri: img } : defaultUserImg
                                }
                                // src={img}
                                style={styles.profileAvatar}
                                resizeMode="cover"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Info</Text>
                    <TouchableOpacity
                        onPress={() => {
                            // navigation.navigate("EditScreen", {
                            //     actionType: "edit",
                            //     action: handleSaveUsername,
                            //     oldVal: username,
                            // });
                            // not editable for now?
                        }}
                        style={styles.row}
                    >
                        <Text style={styles.rowLabel}>Name</Text>
                        <View style={styles.rowSpacer} />
                        {username.length <= 12 ? (
                            <Text style={styles.rowLabel}>{username}</Text>
                        ) : (
                            <Text style={styles.rowLabel}>
                                {username.slice(0, 9) + "..."}
                            </Text>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate("EditScreen", {
                                actionType: "updateBio",
                                oldVal: bio,
                            });
                        }}
                        style={styles.row}
                    >
                        <Text style={styles.rowLabel}>Bio</Text>
                        <View style={styles.rowSpacer} />
                        {bio.length <= 12 ? (
                            <Text style={styles.rowLabel}>{bio}</Text>
                        ) : (
                            <Text style={styles.rowLabel}>
                                {bio.slice(0, 9) + "..."}
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Connected</Text>
                    <View style={styles.row}>
                        <Text style={styles.rowLabel}>Spotify</Text>
                        <View style={styles.rowSpacer} />
                        <Switch
                            onValueChange={handleSpotifyAuthToggle}
                            value={spotifyRefreshToken !== ""}
                            // trackColor={{false: '#767577', true: '#81b0ff'}}
                            // thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                        />
                    </View>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate("EditScreen", {
                                actionType: "updatePW",
                            });
                        }}
                        style={styles.row}
                    >
                        <Text style={styles.rowLabel}>Change Password</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate("EditScreen", {
                                actionType: "updateEmail",
                            });
                        }}
                        style={styles.row}
                    >
                        <Text style={styles.rowLabel}>Change Email</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={async () => {
                            setUserName("");
                            setUsername("");
                            setSpotifyRefreshToken("");
                            setUserBio("");
                            setBio("");
                            setSpotifyAccessToken("");
                            setUserImg("");
                            setImg("");
                            setUID("");
                            if (userSocket) {
                                userSocket.disconnect();
                            }
                            setUserSocket(null);
                            await signOut(auth);
                            setIsAuthorized(false);
                        }}
                        style={styles.row}
                    >
                        <Text style={styles.rowLabel}>Logout</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            // show pop up
                            setWarningMessage(
                                "You are permanently deleting all your data. Proceed?"
                            );
                            setWarningVisible(true);
                        }}
                        style={styles.row}
                    >
                        <Text
                            style={{
                                fontSize: 17,
                                fontWeight: "40",
                                color: "red",
                            }}
                        >
                            Delete Account
                        </Text>
                    </TouchableOpacity>
                </View>
                <ChoicePopup
                    visible={warningVisible}
                    message={warningMessage}
                    onClose={() => {
                        setWarningVisible(false);
                    }}
                    onChoose={handleDeleteAccount} // might change later to handle multiple funcs that need warning
                />
                <ErrorPopUp
                    visible={errorVisible}
                    message={errorMessage}
                    onClose={() => {
                        setErrorVisible(false);
                    }}
                />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 0,

        margin: 0,
    },

    /** Profile */
    profile: {
        padding: 24,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    profileAvatarWrapper: {
        position: "relative",
    },
    profileAvatar: {
        width: 120,
        height: 120,
        borderRadius: 9999,
        backgroundColor: "white",
        opacity: 0.9,
    },
    profileAction: {
        position: "absolute",
        right: -4,
        bottom: -10,
        alignItems: "center",
        justifyContent: "center",
        width: 28,
        height: 28,
        borderRadius: 9999,
    },

    /** Section */
    section: {
        paddingHorizontal: 24,
    },
    sectionTitle: {
        paddingVertical: 12,
        fontSize: 12,
        fontWeight: "700",
        color: "#ffffff",
        textTransform: "uppercase",
        letterSpacing: 1.1,
    },
    /** Row */
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 50,
        backgroundColor: "#3f3a40",
        opacity: 0.8,
        borderRadius: 8,
        marginBottom: 5,
        paddingLeft: 12,
        paddingRight: 12,
    },
    rowLabel: {
        fontSize: 17,
        fontWeight: "40",
        color: "#ffffff",
    },
    rowSpacer: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
    },
});

export default UserInfo;
