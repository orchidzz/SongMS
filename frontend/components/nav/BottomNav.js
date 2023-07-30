import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../../screens/nearby/home";
import ProfileScreen from "../../screens/user/profile";
import InboxScreen from "../../screens/inbox/inbox";
import SearchScreen from "../../screens/search/search";

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
            <BottomTabNavigator.Screen name="Nearby" component={HomeScreen} />
            <BottomTabNavigator.Screen name="Search" component={SearchScreen} />
            <BottomTabNavigator.Screen name="Inbox" component={InboxScreen} />
            <BottomTabNavigator.Screen
                name="Profile"
                component={ProfileScreen}
            />
        </BottomTabNavigator.Navigator>
    );
};

export default BottomNav;
