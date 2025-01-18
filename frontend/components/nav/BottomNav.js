import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import InboxScreen from "../../screens/inbox/inbox";
import MainStackNav from "../nav/MainStackNav";
import SearchStackNav from "../nav/SearchStackNav";
import SettingsStackNav from "../nav/SettingsStackNav";

const BottomTabNavigator = createBottomTabNavigator();
const BottomNav = () => {
    return (
        <BottomTabNavigator.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === "Nearby") {
                        iconName = focused
                            ? "location-sharp"
                            : "location-outline";
                    } else if (route.name === "Search") {
                        iconName = focused ? "search-sharp" : "search-outline";
                    } else if (route.name === "Inbox") {
                        iconName = focused
                            ? "mail-open-sharp"
                            : "mail-open-outline";
                    } else if (route.name === "Profile") {
                        iconName = focused ? "person-sharp" : "person-outline";
                    }

                    return (
                        <Ionicons name={iconName} size={size} color={color} />
                    );
                },
                headerShown: false,
                tabBarActiveTintColor: "#191970",
                tabBarInactiveTintColor: "gray",
                tabBarStyle: [
                    {
                        display: "flex",
                    },
                    null,
                ],
            })}
        >
            <BottomTabNavigator.Screen name="Nearby" component={MainStackNav} />
            <BottomTabNavigator.Screen
                name="Search"
                component={SearchStackNav}
            />
            <BottomTabNavigator.Screen name="Inbox" component={InboxScreen} />
            <BottomTabNavigator.Screen
                name="Profile"
                component={SettingsStackNav}
            />
        </BottomTabNavigator.Navigator>
    );
};

export default BottomNav;
