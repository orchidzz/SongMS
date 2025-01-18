import React from "react";
import { View, Text, TouchableOpacity, Image, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";
import { useStore } from "../../store/store";

import { SpotifyPlaySong } from "../../actions/spotifyApi";

const SongBanner = ({ song }) => {
    const { spotifyAccessToken } = useStore();

    const onPressPlayYoutube = (youtubeUri) => {
        Linking.openURL(youtubeUri).catch((err) =>
            console.error("Error redirecting to YouTube:", err)
        );
    };
    const onPressPlaySpotify = async (spotifyUri) => {
        try {
            await SpotifyPlaySong(spotifyUri, spotifyAccessToken);
        } catch (error) {
            // no premium account so redirect to song in app
            // if (error.response?.status === 403) {
            const trackId = spotifyUri.split(":")[2];
            const spotifyUrl = `https://open.spotify.com/track/${trackId}`;

            // redirect to song in spotify
            Linking.openURL(spotifyUrl).catch((err) =>
                console.error("Error opening Spotify URL:", err)
            );
            // }
        }
    };

    return (
        <View style={styles.bannerContainer}>
            {/* <Image source={song.songImg} style={styles.songImg} /> */}
            <View style={styles.info}>
                <View style={styles.songInfo}>
                    <Text style={styles.songName}>
                        {song.songName.length < 25
                            ? song.songName
                            : song.songName.slice(0, 20) + "..."}
                    </Text>
                    <Text style={styles.artistName}>
                        {song.artistName.length < 50
                            ? song.artistName
                            : song.artistName.slice(0, 45) + "..."}
                    </Text>
                    <Text style={styles.sender}>
                        From:{" "}
                        {song.sender.length < 20
                            ? song.sender
                            : song.sender.slice(0, 15) + "..."}
                    </Text>
                </View>
                <View style={styles.btnGroup}>
                    {song.youtubeUri != "" ? (
                        <TouchableOpacity
                            style={styles.playButton}
                            onPress={() => onPressPlayYoutube(song.youtubeUri)}
                        >
                            <Ionicons name="play" size={24} color="#FF0000" />
                        </TouchableOpacity>
                    ) : (
                        <></>
                    )}

                    {song.spotifyUri != "" && spotifyAccessToken != "" ? (
                        <TouchableOpacity
                            style={styles.playButton}
                            onPress={() => onPressPlaySpotify(song.spotifyUri)}
                        >
                            <Ionicons name="play" size={24} color="#1DB954" />
                        </TouchableOpacity>
                    ) : (
                        <></>
                    )}
                </View>
            </View>
        </View>
    );
};

export default SongBanner;
