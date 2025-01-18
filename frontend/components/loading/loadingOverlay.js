import React from "react";
import { View, ActivityIndicator, StyleSheet, Text, Modal } from "react-native";

const LoadingOverlay = ({ visible }) => {
    return (
        <Modal
            transparent={true}
            animationType="none"
            visible={visible}
            onRequestClose={() => {}}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <ActivityIndicator size="large" color="#ffffff" />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    container: {
        backgroundColor: "#333",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    message: {
        marginTop: 20,
        fontSize: 16,
        color: "#fff",
    },
});

export default LoadingOverlay;
