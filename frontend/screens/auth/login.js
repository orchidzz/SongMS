import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";
import { LinearGradient } from "expo-linear-gradient";

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        // Handle login logic here
    };

    return (
        <LinearGradient
            colors={["#647DEE", "#7F53AC"]}
            style={styles.container}
        >
            <View style={styles.container}>
                <Text style={styles.logo}>SongMS</Text>
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
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.text}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        navigation.navigate("Registration");
                    }}
                >
                    <Text style={styles.text}>Register</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.link}
                    onPress={() => {
                        navigation.navigate("ForgotPW");
                    }}
                >
                    <Text style={styles.linkText}>Forgot your password?</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
};

export default LoginScreen;
