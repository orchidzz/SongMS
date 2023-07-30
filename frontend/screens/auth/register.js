import React, { useState } from "react";
import {
    ScrollView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { styles } from "./styles";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import CustomErrorPopup from "../../components/errors/customErrorPopup";

const RegistrationScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorVisible, setErrorVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleRegister = async () => {
        try {
            if (
                password.length === 0 ||
                email.length === 0 ||
                username.length === 0 ||
                confirmPassword.length === 0
            ) {
                setErrorVisible(true);
                setErrorMessage("All fields are required. Try again.");
                return;
            }
            if (confirmPassword !== password) {
                setErrorVisible(true);
                setErrorMessage("Password and confirm password do not match.");
                return;
            }
            // if user name already exists
            const auth = getAuth();
            await createUserWithEmailAndPassword(auth, email, password);
            navigation.navigate("Login");
        } catch (error) {
            console.error("Registration Error:", error);
        }
    };

    return (
        <LinearGradient colors={["#647DEE", "#7F53AC"]} style={styles.gradient}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.logo}>Register your account</Text>
                <CustomErrorPopup
                    message={errorMessage}
                    visible={errorVisible}
                    onClose={() => {
                        setErrorVisible(false);
                    }}
                />
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
            </ScrollView>
        </LinearGradient>
    );
};

export default RegistrationScreen;
