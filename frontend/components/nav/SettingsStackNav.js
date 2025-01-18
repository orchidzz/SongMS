import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileScreen from "../../screens/user/profile";
import EditingScreen from "../../screens/user/editing";

const StackNavigator = createStackNavigator();
const SettingsStackNav = () => {
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
                name="ProfileScreen"
                component={ProfileScreen}
                options={{ headerShown: false }}
            />
            <StackNavigator.Screen
                name="EditScreen"
                component={EditingScreen}
                options={{
                    headerShown: true,
                    headerTitle: "",
                    headerBackTitle: "",
                }}
            />
        </StackNavigator.Navigator>
    );
};

export default SettingsStackNav;
