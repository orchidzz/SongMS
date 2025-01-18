import React, { useState } from "react";
import { View, Text, StyleSheet, Switch } from "react-native";
import { useStore } from "./store/store";
import { APIConnectToSpotify } from "../../actions/api";

//iffy about this one, maybe not need permimssions at all
const PermissionsToggleGroup = () => {
    const [spotifyPermission, setSpotifyPermission] = useState(
        useStore((state) => state.spotifyToken)
    );

    const handleSpotifyPermissionChange = async () => {
        if (spotifyPermission != "") {
            APIConnectToSpotify.then((response) => {
                useStore((state) =>
                    state.setSpotifyToken(response.data.access_token)
                );
            });
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Text style={styles.label}>Spotify</Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={spotifyPermission ? "#f5dd4b" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={handleSpotifyPermissionChange}
                    value={spotifyPermission}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#ffffff",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    label: {
        fontSize: 18,
    },
});

export default PermissionsToggleGroup;
