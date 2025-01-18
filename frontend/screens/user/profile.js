import React from "react";
import { ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import UserInfo from "../../components/settings/userInfo";

const ProfileScreen = ({ navigation }) => {
    return (
        <LinearGradient
            colors={["#647DEE", "#7F53AC"]}
            style={{ display: "flex" }}
        >
            <ScrollView contentContainerStyle={{ marginTop: 60 }}>
                <UserInfo navigation={navigation} />
            </ScrollView>
        </LinearGradient>
    );
};

export default ProfileScreen;
