import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    logo: {
        fontWeight: "bold",
        fontSize: 28,
        color: "white",
        marginBottom: 40,
    },
    inputView: {
        flexDirection: "row",
        alignItems: "center",
        width: "80%",
        backgroundColor: "white",
        borderRadius: 25,
        height: 50,
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    inputText: {
        flex: 1,
        height: 50,
        color: "midnightblue",
    },
    button: {
        width: "80%",
        backgroundColor: "white",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        paddingHorizontal: 20,
    },
    text: {
        color: "midnightblue",
        fontWeight: "bold",
    },
    link: {
        marginTop: 20,
    },
    linkText: {
        color: "white",
        textDecorationLine: "underline",
    },
});
