import React, { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import SongsGrid from "../../components/songs/songsGrid";
import { useStore } from "../../store/store";
import {
    searchSongsByReceiver,
    getUser,
    getClientSecrets,
} from "./../../actions/firestore";
import { SpotifyGetAccessTokenUsingRefreshToken } from "../../actions/spotifyApi";

const InboxScreen = () => {
    const { uid } = useStore();
    // need to set up listener for notifications
    const [receivedSongs, setReceivedSongs] = useState([]);
    const [refreshing, setRefreshing] = useState(true);
    const loadSongs = async () => {
        const songs = await searchSongsByReceiver(uid);
        setReceivedSongs(songs);
        setRefreshing(false);
    };
    const {
        setSpotifyRefreshToken,
        setSpotifyAccessToken,
        spotifyAccessToken,
        spotifyRefreshToken,
        setUserBio,
        setUserName,
        setUserImg,
        setLastSendDatetime,
    } = useStore();
    useEffect(() => {
        // to not make db call everytime
        const loadUserInfo = async () => {
            if (userName === "") {
                const user = await getUser(uid);
                if (user) {
                    setUserBio(user.bio);
                    setUserName(user.username);
                    setSpotifyRefreshToken(user.spotifyRefreshToken);
                    setUserImg(user.userImg);
                    setLastSendDatetime(user.lastSendDatetime);
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
        loadSongs();
    }, [spotifyRefreshToken]);

    return (
        <LinearGradient
            colors={["#647DEE", "#7F53AC"]}
            style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "flex-start",
                paddingTop: 40,
            }}
        >
            <SongsGrid
                songs={receivedSongs}
                refreshFunc={loadSongs}
                refreshing={refreshing}
            />
        </LinearGradient>
    );
};

export default InboxScreen;
