import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 16,
        paddingHorizontal: 16,
        width: "100%",
        marginTop: 0, //might have to change
    },
    list: { flex: 1 },
    gridItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 10,
        backgroundColor: "white",
        borderRadius: 10,
        marginBottom: 15,
        opacity: 0.9,
        justifyContent: "space-between",
        borderWidth: 2,
        width: "100%",
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 30,
        marginRight: 12,
    },
    info: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
    },
    name: {
        fontSize: 20,
        fontWeight: "bold",
    },
    bio: {
        fontSize: 16,
        color: "black",
    },
});
