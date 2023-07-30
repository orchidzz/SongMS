import React from "react";
import { ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import UserInfo from "../../components/settings/userInfo";
const ProfileScreen = () => {
    return (
        <LinearGradient
            colors={["#647DEE", "#7F53AC"]}
            style={{ flex: 1, alignItems: "center" }}
        >
            <ScrollView contentContainerStyle={{ marginTop: 60 }}>
                <UserInfo />
            </ScrollView>
        </LinearGradient>
    );
};

export default ProfileScreen;
