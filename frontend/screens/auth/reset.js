import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";
import { LinearGradient } from "expo-linear-gradient";

const ResetPWScreen = ({ navigation }) => {
    const [confirmPW, setConfirmPW] = useState("");
    const [password, setPassword] = useState("");

    const handleReset = () => {
        // Handle login logic here
        navigation.navigate("Login");
    };

    return (
        <LinearGradient
            colors={["#647DEE", "#7F53AC"]}
            style={styles.container}
        >
            <View style={styles.container}>
                <Text style={styles.logo}>SongMS</Text>
                <View style={styles.inputView}>
                    <Ionicons
                        name="md-lock-closed"
                        size={24}
                        color="midnightblue"
                    />
                    <TextInput
                        style={styles.inputText}
                        secureTextEntry
                        placeholder="Password"
                        placeholderTextColor="midnightblue"
                        onChangeText={setPassword}
                        value={password}
                    />
                </View>
                <View style={styles.inputView}>
                    <Ionicons
                        name="md-lock-closed"
                        size={24}
                        color="midnightblue"
                    />
                    <TextInput
                        style={styles.inputText}
                        secureTextEntry
                        placeholder="Password"
                        placeholderTextColor="midnightblue"
                        onChangeText={setConfirmPW}
                        value={confirmPW}
                    />
                </View>
                <TouchableOpacity style={styles.button} onPress={handleReset}>
                    <Text style={styles.text}>Reset</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
};

export default ResetPWScreen;
