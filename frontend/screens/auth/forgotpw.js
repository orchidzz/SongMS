import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";
import { LinearGradient } from "expo-linear-gradient";
import auth from "firebase/auth";

const ForgotPWScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");

    const handleSend = async () => {
        try {
            await auth().sendPasswordResetEmail(email);
        } catch (error) {
            console.error("Password Reset Error:", error);
        }
    };

    return (
        <LinearGradient colors={["#647DEE", "#7F53AC"]} style={styles.gradient}>
            <ScrollView contentContainerStyle={styles.container}>
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
                <TouchableOpacity style={styles.button} onPress={handleSend}>
                    <Text style={styles.text}>Send</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.link}
                    onPress={() => {
                        navigation.navigate("Login");
                    }}
                >
                    <Text style={styles.linkText}>Remember your account?</Text>
                </TouchableOpacity>
            </ScrollView>
        </LinearGradient>
    );
};

export default ForgotPWScreen;
