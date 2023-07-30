import React, { useState } from "react";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import UsersGrid from "../../components/users/usersGrid";
import SearchBar from "../../components/search/searchbar";
const SearchScreen = () => {
    const [searchedUsers, setSearchedUsers] = useState([]);
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
                <SearchBar onChangeFunc={setSearchedUsers} />
                <UsersGrid users={searchedUsers} />
            </View>
        </LinearGradient>
    );
};

export default SearchScreen;
