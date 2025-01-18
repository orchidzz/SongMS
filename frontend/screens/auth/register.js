import React, { useState } from "react";
import {
    ScrollView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { styles } from "./styles";
// import { useStore } from "./../../store/store";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
    getAuth,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    updateProfile,
} from "firebase/auth";
import CustomErrorPopup from "../../components/errors/customErrorPopup";
import { usernameIsUnique } from "./../../actions/firestore";
import LoadingOverlay from "../../components/loading/loadingOverlay";

const RegistrationScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorVisible, setErrorVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    // const { setIsAuthorized, isAuthorized, setToken, setUID } = useStore();
    const [isLoading, setIsLoading] = useState(false);
    const [warningVisible, setWarningVisible] = useState(false);
    const [warningMessage, setWarningMessage] = useState("");

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

            if (username.length < 3) {
                setErrorVisible(true);
                setErrorMessage("Please use a longer username");
                return;
            }
            if (password.length < 8) {
                setErrorVisible(true);
                setErrorMessage("Please use a longer password");
                return;
            }
            if (!email.includes("@")) {
                setErrorVisible(true);
                setErrorMessage("Please use a valid email");
                return;
            }
            const isUsernameUnique = await usernameIsUnique(username);
            if (!isUsernameUnique) {
                setErrorVisible(true);
                setErrorMessage(
                    "User name is already taken. Choose another one"
                );
                return;
            }
            const auth = getAuth();
            await createUserWithEmailAndPassword(auth, email, password);
            const curUser = auth.currentUser;
            await sendEmailVerification(curUser);
            await updateProfile(curUser, { displayName: username });
            // await signInWithEmailAndPassword(auth, email, password);
            // onAuthStateChanged(auth, async (user) => {
            //     if (user) {
            //         const token = await user.getIdToken();
            //         const uid = user.uid;
            //         setUID(uid);
            //         setToken(token);
            //         await createUser(uid, username, email, "");
            //         setIsAuthorized(true);
            //     }
            // });
            setWarningMessage(
                "A verification link has been sent to your email. Please verify your email before logging in."
            );
            setWarningVisible(true);
            // navigation.goBack();
        } catch (error) {
            // console.error("Registration Error:", error);
            if (error.code === "auth/invalid-email") {
                setErrorMessage("Please use a valid email");
                setErrorVisible(true);
                return;
            } else if (error.code === "auth/email-already-in-use") {
                setErrorMessage(
                    "This email already has an account. Please use another email"
                );
                setErrorVisible(true);
                return;
            }
            setErrorMessage("Error in registration" + error);
            setErrorVisible(true);
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
                <CustomErrorPopup
                    message={warningMessage}
                    visible={warningVisible}
                    onClose={() => {
                        setWarningVisible(false);
                        navigation.goBack();
                    }}
                />
                <LoadingOverlay visible={isLoading} />
                <View style={styles.inputView}>
                    <Ionicons name="person" size={24} color="midnightblue" />
                    <TextInput
                        style={styles.inputText}
                        placeholder="Username"
                        placeholderTextColor="midnightblue"
                        onChangeText={(text) => setUsername(text)}
                        value={username}
                    />
                </View>
                <View style={styles.inputView}>
                    <Ionicons name="mail" size={24} color="midnightblue" />
                    <TextInput
                        style={styles.inputText}
                        placeholder="Email"
                        placeholderTextColor="midnightblue"
                        onChangeText={(text) => setEmail(text)}
                        value={email}
                    />
                </View>
                <View style={styles.inputView}>
                    <Ionicons
                        name="lock-closed"
                        size={24}
                        color="midnightblue"
                    />
                    <TextInput
                        style={styles.inputText}
                        secureTextEntry
                        placeholder="Password"
                        placeholderTextColor="midnightblue"
                        onChangeText={(text) => setPassword(text)}
                        value={password}
                    />
                </View>
                <View style={styles.inputView}>
                    <Ionicons
                        name="lock-closed"
                        size={24}
                        color="midnightblue"
                    />
                    <TextInput
                        style={styles.inputText}
                        secureTextEntry
                        placeholder="Confirm Password"
                        placeholderTextColor="midnightblue"
                        onChangeText={(text) => setConfirmPassword(text)}
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
