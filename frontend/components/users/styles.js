import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 16,
        paddingHorizontal: 8,
    },
    gridItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: "bold",
    },
    bio: {
        fontSize: 14,
        color: "gray",
    },
});
