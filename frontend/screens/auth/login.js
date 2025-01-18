import React, { useState } from "react";
import {
    ScrollView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";
import { LinearGradient } from "expo-linear-gradient";
import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
} from "firebase/auth";
import { useStore } from "../../store/store";
import ErrorPopUp from "../../components/errors/customErrorPopup";
import LoadingOverlay from "../../components/loading/loadingOverlay";
import {
    createUser,
    usernameIsUnique,
    getUser,
} from "./../../actions/firestore";

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorVisible, setErrorVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const {
        setIsAuthorized,
        isAuthorized,
        setToken,
        setUID,
        setUserName,
        setUserEmail,
        setLastSendDatetime,
        setSpotifyRefreshToken,
        setUserBio,
        setUserImg,
    } = useStore();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        try {
            if (email.length === 0 || password.length === 0) {
                setErrorVisible(true);
                setErrorMessage("All fields are required. Please try again.");
                return;
            }
            if (!email.includes("@")) {
                setErrorVisible(true);
                setErrorMessage("Please use a valid email");
                return;
            }
            const auth = getAuth();
            await signInWithEmailAndPassword(auth, email, password);
            onAuthStateChanged(auth, async (user) => {
                // if user's email is verified
                if (user && user.emailVerified) {
                    // if newly registered, create account in firestore
                    const isNew = await usernameIsUnique(user.displayName);
                    if (isNew) {
                        await createUser(user.uid, user.displayName, email, "");
                    } else {
                        const acc = await getUser(user.uid);
                        setLastSendDatetime(acc.lastSendDatetime);
                        setSpotifyRefreshToken(acc.spotifyRefreshToken);
                        setUserBio(acc.bio);
                        setUserImg(acc.userImg);
                    }
                    setUID(user.uid);
                    setUserName(user.displayName);
                    setUserEmail(email);
                    const token = await user.getIdToken();
                    setToken(token);
                    setIsAuthorized(true);
                } else {
                    setErrorVisible(true);
                    setErrorMessage(
                        "Please verify your email before logging in with this email."
                    );
                    return;
                }
            });
        } catch (error) {
            if (error.code == "auth/wrong-password") {
                // show error page
                setErrorVisible(true);
                setErrorMessage("Wrong credentials. Try again.");
                return;
            }
            console.error("Login Error:", error);
        }
    };

    return (
        <LinearGradient colors={["#647DEE", "#7F53AC"]} style={styles.gradient}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.logo}>SongMS</Text>
                <View style={styles.inputView}>
                    <Ionicons name="mail" size={24} color="midnightblue" />
                    <TextInput
                        style={styles.inputText}
                        placeholder="Email"
                        placeholderTextColor="midnightblue"
                        onChangeText={(text) => setEmail(text)}
                        value={email}
                    />
                </View>
                <ErrorPopUp
                    visible={errorVisible}
                    message={errorMessage}
                    onClose={() => {
                        setErrorVisible(false);
                    }}
                />
                <LoadingOverlay visible={isLoading} />
                <View style={styles.inputView}>
                    <Ionicons
                        name="lock-closed"
                        size={24}
                        color="midnightblue"
                    />
                    <TextInput
                        style={styles.inputText}
                        secureTextEntry
                        placeholder="Password"
                        placeholderTextColor="midnightblue"
                        onChangeText={(text) => setPassword(text)}
                        value={password}
                    />
                </View>
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.text}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        navigation.navigate("Registration");
                    }}
                >
                    <Text style={styles.text}>Register</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.link}
                    onPress={() => {
                        navigation.navigate("ForgotPW");
                    }}
                >
                    <Text style={styles.linkText}>Forgot your password?</Text>
                </TouchableOpacity>
            </ScrollView>
        </LinearGradient>
    );
};

export default LoginScreen;
