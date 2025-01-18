import React from "react";
import { View, FlatList, RefreshControl } from "react-native";
import { styles } from "./styles";
import UserItem from "./userItem";

const UsersGrid = ({
    users,
    navigation,
    refreshFunc = () => {},
    refreshing = false,
}) => {
    return (
        <View style={styles.container}>
            <FlatList
                data={users}
                renderItem={({ item }) => (
                    <UserItem user={item} navigation={navigation} />
                )}
                keyExtractor={(item) => item.username}
                numColumns={1}
                style={styles.list}
                extraData={users}
                refreshControl={
                    <RefreshControl
                        enabled={true}
                        refreshing={refreshing}
                        onRefresh={refreshFunc}
                    />
                }
            />
        </View>
    );
};

export default UsersGrid;
