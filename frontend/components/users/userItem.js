import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { styles } from "./styles";
import { useStore } from "../../store/store";

const UserItem = ({ user, navigation }) => {
    const handleClick = () => {
        navigation.navigate("SendScreen", {
            user,
        });
    };
    const { defaultUserImg } = useStore();
    return (
        <TouchableOpacity style={styles.gridItem} onPress={handleClick}>
            <Image
                src={user.userImg ? user.userImg : defaultUserImg}
                style={styles.image}
                resizeMode="cover"
            />
            <View style={styles.info}>
                <Text style={styles.name}>{user.username}</Text>
                <Text style={styles.bio}>{user.bio}</Text>
            </View>
        </TouchableOpacity>
    );
};
export default UserItem;
