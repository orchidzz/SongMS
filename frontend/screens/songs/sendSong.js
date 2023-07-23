import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { SongForm } from "../../components/forms/songForm";
const SendSongScreen = () => {
    return (
        <LinearGradient
            colors={["#7F5A83", "#0D324D"]}
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
            <SongForm />
        </LinearGradient>
    );
};

export default SendSongScreen;
