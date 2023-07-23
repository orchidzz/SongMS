import React from "react";
import { createAppContainer } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../../screens/nearby/home";
import ProfileScreen from "../../screens/user/profile";
import InboxScreen from "../../screens/inbox/inbox";
import SearchScreen from "../../screens/search/search";

const BottomTabNavigator = createBottomTabNavigator(
    {
        NearbyUsers: {
            screen: HomeScreen,
            navigationOptions: {
                tabBarLabel: "Nearby",
                tabBarIcon: ({ focused }) => (
                    <Ionicons
                        name={focused ? "md-people" : "md-people-outline"}
                        size={24}
                        color="midnightblue"
                    />
                ),
            },
        },
        Search: {
            screen: SearchScreen,
            navigationOptions: {
                tabBarLabel: "Search",
                tabBarIcon: ({ focused }) => (
                    <Ionicons
                        name={focused ? "md-search" : "md-search-outline"}
                        size={24}
                        color="midnightblue"
                    />
                ),
            },
        },
        Inbox: {
            screen: InboxScreen,
            navigationOptions: {
                tabBarLabel: "Inbox",
                tabBarIcon: ({ focused }) => (
                    <Ionicons
                        name={focused ? "md-mail" : "md-mail-outline"}
                        size={24}
                        color="midnightblue"
                    />
                ),
            },
        },
        Profile: {
            screen: ProfileScreen,
            navigationOptions: {
                tabBarLabel: "Profile",
                tabBarIcon: ({ focused }) => (
                    <Ionicons
                        name={focused ? "md-person" : "md-person-outline"}
                        size={24}
                        color="midnightblue"
                    />
                ),
            },
        },
    },
    {
        tabBarOptions: {
            activeTintColor: "midnightblue",
            inactiveTintColor: "gray",
            style: {
                backgroundColor: "white",
                marginBottom: 30,
                paddingTop: 10,
            },
        },
    }
);

export default createAppContainer(BottomTabNavigator);
