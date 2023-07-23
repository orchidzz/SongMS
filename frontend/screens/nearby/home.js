import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import UsersGrid from "../../components/users/usersGrid";
const HomeScreen = () => {
    return (
        <LinearGradient
            colors={["#647DEE", "#7F53AC"]}
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
            <UsersGrid />
        </LinearGradient>
    );
};

export default HomeScreen;
