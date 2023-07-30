import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import UsersGrid from "../../components/users/usersGrid";
import { useStore } from "../../store/store";
const HomeScreen = () => {
    const nearbyUsers = useStore((state) => state.nearbyUsers);
    // websocket that updates geohash if needed every 5 min and update nearby users
    return (
        <LinearGradient
            colors={["#647DEE", "#7F53AC"]}
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
            <UsersGrid users={nearbyUsers} />
        </LinearGradient>
    );
};

export default HomeScreen;
