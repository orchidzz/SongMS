import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import UserInfo from "../../components/settings/userInfo";
const ProfileScreen = () => {
    return (
        <LinearGradient
            colors={["#647DEE", "#7F53AC"]}
            style={{ flex: 1, alignItems: "center" }}
        >
            <UserInfo />
        </LinearGradient>
    );
};

export default ProfileScreen;
