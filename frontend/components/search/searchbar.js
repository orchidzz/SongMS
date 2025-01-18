import React, { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getUsersByUsernameKeyword } from "../../actions/firestore";

const SearchBar = ({ onChangeFunc }) => {
    const [searchText, setSearchText] = useState("");

    const handleSearch = async (text) => {
        setSearchText(text);
        if (text.length < 3) {
            return [];
        }
        // can be optimized to send less query?
        const users = await getUsersByUsernameKeyword(searchText);
        onChangeFunc(users);
    };

    return (
        <View style={styles.searchContainer}>
            <Ionicons
                name="search"
                size={24}
                color="midnightblue"
                style={styles.searchIcon}
            />
            <TextInput
                style={styles.input}
                placeholder="Search"
                placeholderTextColor="midnightblue"
                onChangeText={handleSearch}
                value={searchText}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 10,
        paddingHorizontal: 15,
        marginHorizontal: 10,
    },
    searchIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 50,
        color: "midnightblue",
    },
});

export default SearchBar;
