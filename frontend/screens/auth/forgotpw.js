import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";
import { LinearGradient } from "expo-linear-gradient";

const ForgotPWScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");

    const handleSend = () => {
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
            </View>
        </LinearGradient>
    );
};

export default ForgotPWScreen;
