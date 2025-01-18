import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SearchScreen from "../../screens/search/search";
import SendSongScreen from "../../screens/songs/sendSong";

const StackNavigator = createStackNavigator();
const SearchStackNav = () => {
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
                name="SearchScreen"
                component={SearchScreen}
                options={{ headerShown: false }}
            />
            <StackNavigator.Screen
                name="SendScreen"
                component={SendSongScreen}
                options={{ headerTitle: "", headerBackTitle: "" }}
            />
        </StackNavigator.Navigator>
    );
};

export default SearchStackNav;
