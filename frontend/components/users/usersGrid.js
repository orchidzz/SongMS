import React from "react";
import { View, FlatList, TouchableOpacity, Text } from "react-native";
import { styles } from "./styles";
import UserItem from "./userItem";

const UsersGrid = ({ users }) => {
    //console.log(users);
    return (
        <View style={styles.container}>
            <FlatList
                data={users}
                renderItem={({ item }) => <UserItem user={item} />}
                keyExtractor={(item) => item.username}
                numColumns={1}
                style={styles.list}
                extraData={users}
            />
        </View>
    );
};

export default UsersGrid;
