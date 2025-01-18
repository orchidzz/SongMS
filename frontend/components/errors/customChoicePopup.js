// ErrorPopUp.js
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";

const ChoicePopup = ({ message, visible, onClose, onChoose }) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalBackground}>
                <View style={styles.modalContent}>
                    <Text style={styles.message}>{message}</Text>
                    <View style={styles.btnBackground}>
                        <TouchableOpacity
                            onPress={onClose}
                            style={styles.closeButton}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={onChoose}
                            style={styles.okButton}
                        >
                            <Text style={styles.okButtonText}>Ok</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 8,
        alignItems: "center",
    },
    message: {
        fontSize: 18,
        marginBottom: 20,
    },
    closeButton: {
        backgroundColor: "#008080",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 4,
        marginHorizontal: 5,
    },
    closeButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    okButton: {
        backgroundColor: "red",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 4,
        marginHorizontal: 5,
    },
    okButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    btnBackground: {
        display: "flex",
        flexDirection: "row",
    },
});

export default ChoicePopup;
