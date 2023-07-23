import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity,
    FlatList,
} from "react-native";

const SongForm = (receiver) => {
    const [searchInput, setSearchInput] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    const handleInputChange = (text) => {
        setSearchInput(text);
        setShowDropdown(text.length > 0);
    };

    const handleSendPress = () => {
        // Implement the logic to send the search input
        console.log(`Sending search input: ${searchInput}`);
    };

    const data = [
        { id: "1", label: "Result 1" },
        { id: "2", label: "Result 2" },
        { id: "3", label: "Result 3" },
    ];

    const renderDropdownItem = ({ item }) => {
        return (
            <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleDropdownItemPress(item.label)}
            >
                <Text>{item.label}</Text>
            </TouchableOpacity>
        );
    };

    const handleDropdownItemPress = (label) => {
        setSearchInput(label);
        setShowDropdown(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={receiver.img} style={styles.avatar} />
                <Text style={styles.username}>{receiver.name}</Text>{" "}
                {/* Replace with the user's name */}
            </View>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search"
                    value={searchInput}
                    onChangeText={handleInputChange}
                />
                {showDropdown && (
                    <FlatList
                        style={styles.dropdownList}
                        data={data}
                        renderItem={renderDropdownItem}
                        keyExtractor={(item) => item.id}
                    />
                )}
            </View>
            <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSendPress}
            >
                <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
    header: {
        alignItems: "center",
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginBottom: 8,
    },
    username: {
        fontSize: 18,
        fontWeight: "bold",
    },
    searchContainer: {
        position: "relative",
        marginTop: 16,
    },
    searchInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 8,
        fontSize: 16,
    },
    dropdownList: {
        position: "absolute",
        top: 40,
        left: 0,
        right: 0,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        maxHeight: 150,
        backgroundColor: "#fff",
    },
    dropdownItem: {
        padding: 8,
    },
    sendButton: {
        backgroundColor: "#007bff",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 16,
    },
    sendButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default SongForm;
