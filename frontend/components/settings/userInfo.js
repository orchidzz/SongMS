import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    TextInput,
} from "react-native";
import { useStore } from "../../store/store";

const UserInfo = () => {
    const [editMode, setEditMode] = useState(false);
    const username = useStore((state) => state.username);
    const [bio, setBio] = useState(useStore((state) => state.userBio));
    const [img, setImg] = useState(useStore((state) => state.userImg));

    const handleEditPress = () => {
        setEditMode(true);
    };

    const handleSavePress = () => {
        setEditMode(false);
    };

    return (
        <View style={styles.container}>
            <Image
                source={img}
                style={styles.avatar}
                onPress={() => {
                    setEditMode(true);
                }}
            />
            <Text style={styles.username} value={username}></Text>
            <Text style={styles.bio}>{editMode ? "Bio" : bio}</Text>
            {editMode ? (
                <TextInput
                    style={styles.bioInput}
                    value={bio}
                    onChangeText={setBio}
                    placeholder={bio}
                    multiline
                />
            ) : null}
            {editMode ? (
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSavePress}
                >
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={handleEditPress}
                >
                    <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        paddingVertical: 16,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 12,
        backgroundColor: "white",
    },
    username: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
        marginBottom: 16,
    },
    bio: {
        color: "white",
        fontSize: 16,
        marginBottom: 16,
    },
    input: {
        width: "80%",
        height: 40,
        width: 300,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 4,
        paddingHorizontal: 8,
        marginBottom: 12,
    },
    bioInput: {
        width: "80%",
        height: 100,
        width: 300,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 4,
        paddingHorizontal: 8,
        marginBottom: 12,
    },
    editButton: {
        backgroundColor: "midnightblue",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 4,
    },
    editButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    saveButton: {
        backgroundColor: "midnightblue",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 4,
    },
    saveButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default UserInfo;
