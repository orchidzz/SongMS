import React from "react";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import UsersGrid from "../../components/users/usersGrid";
import SearchBar from "../../components/search/searchbar";
const SearchScreen = () => {
    return (
        <LinearGradient
            colors={["#647DEE", "#7F53AC"]}
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
            <View
                style={{
                    flex: 1,
                    alignItems: "center",
                    marginTop: 60,
                }}
            >
                <SearchBar />
                <UsersGrid />
            </View>
        </LinearGradient>
    );
};

export default SearchScreen;
