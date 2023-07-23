import React from "react";
import {
    View,
    FlatList,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
} from "react-native";
import { styles } from "./styles";

const UserItem = ({ user }) => {
    return (
        <TouchableOpacity style={styles.gridItem}>
            <Image source={user.image} style={styles.image} />
            <View style={styles.info}>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.bio}>{user.bio}</Text>
            </View>
        </TouchableOpacity>
    );
};
export default UserItem;
