import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import SongsGrid from "../../components/songs/songsGrid";
import { useStore } from "../../store/store";
const InboxScreen = () => {
    const receivedSongs = useStore((state) => state.userInbox);
    // create websocket connection that receives sent song from server
    return (
        <LinearGradient
            colors={["#647DEE", "#7F53AC"]}
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
            <SongsGrid songs={receivedSongs} />
        </LinearGradient>
    );
};

export default InboxScreen;
