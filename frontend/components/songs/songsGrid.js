import React from "react";
import { View, FlatList, RefreshControl } from "react-native";
import SongBanner from "./songBanner";
import { styles } from "./styles";

const SongsGrid = ({ songs, refreshFunc = () => {}, refreshing = false }) => {
    return (
        <View style={styles.container}>
            <FlatList
                data={songs}
                renderItem={({ item }) => <SongBanner song={item} />}
                keyExtractor={(item) => item.datetime}
                numColumns={1}
                extraData={songs}
                style={styles.list}
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

export default SongsGrid;
