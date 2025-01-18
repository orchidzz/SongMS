import React, { useState } from "react";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import UsersGrid from "../../components/users/usersGrid";
import SearchBar from "../../components/search/searchbar";
import { useStore } from "../../store/store";

const SearchScreen = ({ navigation }) => {
    const [searchedUsers, setSearchedUsers] = useState([]);
    const { userName } = useStore();
    return (
        <LinearGradient
            colors={["#647DEE", "#7F53AC"]}
            style={{ alignItems: "center", justifyContent: "center" }}
        >
            <View
                style={{
                    alignItems: "center",
                    marginTop: 60,
                    marginHorizontal: 5,
                    alignItems: "flex-start",
                }}
            >
                <SearchBar
                    onChangeFunc={(val) => {
                        setSearchedUsers(val);
                    }}
                />
                <UsersGrid
                    users={searchedUsers.filter(
                        (user) => user.username !== userName
                    )}
                    navigation={navigation}
                />
            </View>
        </LinearGradient>
    );
};

export default SearchScreen;
