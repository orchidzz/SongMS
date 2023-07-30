import React from "react";
import { View, FlatList } from "react-native";
import SongBanner from "./songBanner";
import { styles } from "./styles";

const SongsGrid = ({ songs }) => {
    return (
        <View style={styles.container}>
            <FlatList
                data={songs}
                renderItem={({ item }) => <SongBanner song={item} />}
                keyExtractor={(item) => item.username}
                numColumns={1}
                extraData={songs}
            />
        </View>
    );
};

export default SongsGrid;
