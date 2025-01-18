import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity,
    FlatList,
} from "react-native";
import { addSong, getClientSecrets, getUser } from "../../actions/firestore";
import { useStore } from "../../store/store";
import {
    SpotifySearchSongByKeyword,
    SpotifyGetAccessTokenUsingRefreshToken,
} from "../../actions/spotifyApi";
import {
    YouTubeGetUriGivenSong,
    YouTubeSearchSongByKeyword,
} from "../../actions/youtubeApi";
import ErrorPopUp from "../errors/customErrorPopup";

// logic: use spotify api to search for songs if user is connected to spotify
// else use youtube data api
const SongForm = ({ receiver, navigation }) => {
    // const [img, setImg] = useState(receiver.userImg);
    const [searchInput, setSearchInput] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [data, setData] = useState([]);
    const [songName, setSongName] = useState("");
    const [artistName, setArtistName] = useState("");
    const [spotifyUri, setSpotifyUri] = useState("");
    const [youtubeUri, setYoutubeUri] = useState("");
    const [errorVisible, setErrorVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const {
        uid,
        setUserBio,
        setUserName,
        userName,
        setSpotifyRefreshToken,
        setSpotifyAccessToken,
        spotifyAccessToken,
        spotifyRefreshToken,
        youtubeApikey,
        setYoutubeApikey,
        defaultUserImg,
        setLastSendDatetime,
        lastSendDatetime,
        setUserImg,
    } = useStore();

    useEffect(() => {
        // to not make db call everytime
        const loadUserInfo = async () => {
            if (userName === "") {
                const user = await getUser(uid);
                if (user) {
                    setBio(user.bio);
                    setUserBio(user.bio);
                    setUserName(user.username);
                    setSpotifyRefreshToken(user.spotifyRefreshToken);
                    setLastSendDatetime(user.lastSendDatetime);
                    setUserImg(user.userImg);
                }
            }
        };
        loadUserInfo();
        const getAccessToken = async () => {
            if (spotifyAccessToken == "" && spotifyRefreshToken != "") {
                const data = await getClientSecrets("spotifyClient");
                if (data) {
                    const { clientId, clientSecret } = data;
                    const token = await SpotifyGetAccessTokenUsingRefreshToken(
                        spotifyRefreshToken,
                        clientId,
                        clientSecret
                    );
                    setSpotifyAccessToken(token);
                }
            }
        };
        getAccessToken();

        const getYoutubeApikey = async () => {
            if (youtubeApikey == "") {
                const data = await getClientSecrets("youtubeApi");
                if (data) {
                    const { apiKey } = data;
                    setYoutubeApikey(apiKey);
                }
            }
        };
        getYoutubeApikey();
    }, [uid, spotifyRefreshToken]);

    const handleInputChange = async (text) => {
        setSearchInput(text);
        try {
            if (text.length > 0) {
                // use spotify api if connect to spotify account, else use youtube api
                if (spotifyAccessToken != "") {
                    const response = await SpotifySearchSongByKeyword(
                        text,
                        spotifyAccessToken
                    );
                    setData(response);
                } else {
                    const response = await YouTubeSearchSongByKeyword(
                        text,
                        youtubeApikey
                    );
                    setData(response);
                }
            }
        } catch (error) {
            console.error("Error searching for songs:", error);
        }

        setShowDropdown(text.length > 0);
    };

    const handleSendPress = async () => {
        if (songName === "" || artistName === "") {
            return;
        }
        const datetime = new Date().getTime();
        // allow send every 1 hour
        if (lastSendDatetime && datetime - lastSendDatetime >= 3600) {
            setErrorMessage(
                "You have reached the limit of sending songs (one song per hour). Come back a little bit later to send a new song"
            );
            setErrorVisible(true);
            return;
        }
        if (spotifyAccessToken != "") {
            // get youtube uri if possible
            setYoutubeUri(
                await YouTubeGetUriGivenSong(
                    songName,
                    artistName,
                    youtubeApikey
                )
            );
        }
        await addSong(
            uid,
            userName,
            receiver.uid,
            songName,
            artistName,
            spotifyUri,
            youtubeUri
        );
        setLastSendDatetime(datetime);
        navigation.goBack();
    };

    const handleDropdownItemPress = (song) => {
        setSearchInput(song.songName + "-" + song.artistName);
        setArtistName(song.artistName);
        setSongName(song.songName);
        if (spotifyAccessToken != "") {
            setSpotifyUri(song.uri);
        } else {
            setYoutubeUri(song.uri);
        }

        setShowDropdown(false);
    };

    const renderDropdownItem = (song) => {
        return (
            <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleDropdownItemPress(song)}
            >
                <Text style={{ fontWeight: "bold", fontSize: 14 }}>
                    {song.songName}
                </Text>
                <Text style={{ fontSize: 14 }}>{song.artistName}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image
                    alt=""
                    source={
                        receiver.userImg
                            ? { uri: receiver.userImg }
                            : defaultUserImg
                    }
                    style={styles.imgAvatar}
                />
                <Text style={styles.username}>{receiver.username}</Text>
            </View>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search"
                    value={searchInput}
                    onChangeText={handleInputChange}
                />
                {showDropdown && (
                    <FlatList
                        style={styles.dropdownList}
                        data={data}
                        numColumns={1}
                        renderItem={({ item }) => renderDropdownItem(item)}
                        keyExtractor={(item, index) =>
                            index.toString() + item.songName + item.artistName
                        }
                    />
                )}
            </View>
            {!showDropdown && (
                <TouchableOpacity
                    style={styles.sendButton}
                    onPress={handleSendPress}
                >
                    <Text style={styles.sendButtonText}>Send!</Text>
                </TouchableOpacity>
            )}
            <ErrorPopUp
                visible={errorVisible}
                message={errorMessage}
                onClose={() => {
                    setErrorVisible(false);
                    navigation.goBack();
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        padding: 16,
        padding: 0,
        margin: 0,
    },
    header: {
        display: "flex",
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
    },

    username: {
        fontSize: 18,
        fontWeight: "bold",
    },
    searchContainer: {
        position: "relative",
        marginTop: 16,
    },
    searchInput: {
        borderWidth: 2,
        color: "#351f67",
        borderRadius: 8,
        padding: 8,
        fontSize: 16,
        marginHorizontal: 20,
        borderColor: "#351f67",
        backgroundColor: "white",
        marginTop: 15,
    },
    dropdownList: {
        position: "absolute",
        top: 56,
        left: 20,
        right: 20,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        maxHeight: 220,
        backgroundColor: "#fff",
    },
    dropdownItem: {
        padding: 8,
        "&:press": {
            background: "#000",
        },
        borderBottomWidth: 1,
    },
    sendButton: {
        backgroundColor: "#f3ccff",
        paddingHorizontal: 8,
        paddingVertical: 8,
        borderRadius: 16,
        alignItems: "center",
        marginTop: 16,
        marginHorizontal: 100,
        borderWidth: 2,
        borderColor: "#351f67",
    },
    sendButtonText: {
        color: "#351f67",
        fontSize: 16,
        fontWeight: "bold",
    },
    imgAvatar: {
        width: 80,
        height: 80,
        borderRadius: 10,
        backgroundColor: "white",
    },
});

export default SongForm;
