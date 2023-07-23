import React, { useState } from "react";
import { View, Text, StyleSheet, Switch } from "react-native";

//iffy about this one, maybe not need permimssions at all
const PermissionsToggleGroup = () => {
    const [spotifyPermission, setSpotifyPermission] = useState(false);
    const [youtubePermission, setYoutubePermission] = useState(false);

    const handleSpotifyPermissionChange = (value) => {
        setSpotifyPermission(value);
    };

    const handleYoutubePermissionChange = (value) => {
        setYoutubePermission(value);
        // Save the permission value to your data storage or handle it as required
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
            <View style={styles.row}>
                <Text style={styles.label}>YouTube</Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={youtubePermission ? "#f5dd4b" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={handleYoutubePermissionChange}
                    value={youtubePermission}
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
