import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../../screens/nearby/home";
import SendSongScreen from "../../screens/songs/sendSong";

const StackNavigator = createStackNavigator();
const MainStackNav = () => {
    return (
        <StackNavigator.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#29323c",
                },
                headerTintColor: "white", // Set the text color
                headerTitleStyle: {
                    fontWeight: "bold",
                },
            }}
        >
            <StackNavigator.Screen
                name="Home"
                component={HomeScreen}
                options={{ headerShown: false }}
            />
            <StackNavigator.Screen
                name="SendScreen"
                component={SendSongScreen}
                options={{
                    headerShown: true,
                    headerTitle: "",
                    headerBackTitle: "",
                }}
            />
        </StackNavigator.Navigator>
    );
};

export default MainStackNav;
