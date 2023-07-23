import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SongBanner = ({ songName, artistName, onPressPlay }) => {
    return (
        <View style={styles.container}>
            <View style={styles.songInfo}>
                <Text style={styles.songName}>{songName}</Text>
                <Text style={styles.artistName}>{artistName}</Text>
            </View>
            <TouchableOpacity style={styles.playButton} onPress={onPressPlay}>
                <Ionicons name="ios-play" size={24} color="white" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f2f2f2",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    songInfo: {
        flex: 1,
    },
    songName: {
        fontSize: 18,
        fontWeight: "bold",
    },
    artistName: {
        fontSize: 16,
        color: "gray",
    },
    playButton: {
        backgroundColor: "#007bff",
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default SongBanner;
