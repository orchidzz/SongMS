import React, { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SearchBar = (onChangeFunc) => {
    const [searchText, setSearchText] = useState("");

    const handleSearch = (text) => {
        setSearchText(text);
        // send api request
        const res = "";
        onChangeFunc(res);
    };

    return (
        <View style={styles.searchContainer}>
            <Ionicons
                name="md-search"
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
