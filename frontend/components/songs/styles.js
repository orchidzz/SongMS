import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 16,
        paddingHorizontal: 8,
        marginTop: 60,
        width: "100%",
    },
    bannerContainer: {
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
        color: "black",
    },
    songImg: {
        height: 50,
        width: 50,
        borderRadius: 25,
        marginRight: 10,
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
