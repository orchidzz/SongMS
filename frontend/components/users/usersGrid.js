import React from "react";
import { View, FlatList } from "react-native";
import { styles } from "./styles";
import UserItem from "./userItem";

const UsersGrid = (users) => {
    return (
        <View style={styles.container}>
            <FlatList
                data={users}
                renderItem={({ item }) => <UserItem user={item} />}
                keyExtractor={(item) => item.id}
                numColumns={1}
            />
        </View>
    );
};

export default UsersGrid;
