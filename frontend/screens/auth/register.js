import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { styles } from "./styles";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const RegistrationScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleRegister = () => {
        // Handle registration logic here
    };

    return (
        <LinearGradient
            colors={["#647DEE", "#7F53AC"]}
            style={styles.container}
        >
            <View style={styles.container}>
                <Text style={styles.logo}>Register your account</Text>
                <View style={styles.inputView}>
                    <Ionicons name="md-person" size={24} color="midnightblue" />
                    <TextInput
                        style={styles.inputText}
                        placeholder="Username"
                        placeholderTextColor="midnightblue"
                        onChangeText={setUsername}
                        value={username}
                    />
                </View>
                <View style={styles.inputView}>
                    <Ionicons name="md-mail" size={24} color="midnightblue" />
                    <TextInput
                        style={styles.inputText}
                        placeholder="Email"
                        placeholderTextColor="midnightblue"
                        onChangeText={setEmail}
                        value={email}
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
                        placeholder="Confirm Password"
                        placeholderTextColor="midnightblue"
                        onChangeText={setConfirmPassword}
                        value={confirmPassword}
                    />
                </View>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleRegister}
                >
                    <Text style={styles.text}>Register</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.link}
                    onPress={() => {
                        navigation.navigate("Login");
                    }}
                >
                    <Text style={styles.linkText}>
                        Already have an account?
                    </Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
};

export default RegistrationScreen;
