import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        paddingVertical: 16,
        paddingHorizontal: 0,
        width: "100%",
        marginTop: 20, //might have to change
        height: "100%",
    },
    bannerContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f2f2f2",
        paddingHorizontal: 8,
        paddingVertical: 12,
        borderRadius: 8,
        marginBottom: 8,
        backgroundColor: "white",
        borderRadius: 10,
        marginBottom: 15,
        opacity: 0.9,
        borderWidth: 2,
        marginHorizontal: 16,
    },
    info: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "space-between",
        flex: 1,
    },
    btnGroup: {
        display: "flex",
        flexDirection: "row",
        alignContent: "center",
        alignItems: "center",
        justifyContent: "flex-end",
    },
    songInfo: { display: "flex", flexDirection: "column" },
    songName: {
        fontSize: 16,
        fontWeight: "bold",
    },
    artistName: {
        fontSize: 14,
        color: "black",
    },
    sender: { fontSize: 12 },
    songImg: {
        height: 50,
        width: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    playButton: {
        backgroundColor: "white",
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        margin: 3,
    },
});
