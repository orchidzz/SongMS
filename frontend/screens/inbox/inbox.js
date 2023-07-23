import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import SongsGrid from "../../components/songs/songsGrid";
const InboxScreen = () => {
    return (
        <LinearGradient
            colors={["#647DEE", "#7F53AC"]}
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
            <SongsGrid />
        </LinearGradient>
    );
};

export default InboxScreen;
