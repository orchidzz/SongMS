import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";

const SongBanner = ({ song }) => {
    return (
        <View style={styles.bannerContainer}>
            <Image source={song.songImg} style={styles.songImg} />
            <View style={styles.songInfo}>
                <Text style={styles.songName}>{song.songName}</Text>
                <Text style={styles.artistName}>{song.artistName}</Text>
            </View>
            <TouchableOpacity
                style={styles.playButton}
                onPress={song.onPressPlay}
            >
                <Ionicons name="ios-play" size={24} color="white" />
            </TouchableOpacity>
        </View>
    );
};

export default SongBanner;
