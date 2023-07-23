import React from "react";
import { View, FlatList } from "react-native";
import SongBanner from "./songBanner";

const SongsGrid = (songs) => {
    return (
        <View style={{ flex: 1, paddingVertical: 16, paddingHorizontal: 8 }}>
            <FlatList
                data={songs}
                renderItem={({ item }) => (
                    <SongBanner
                        songName={item.songName}
                        artistName={item.artistName}
                    />
                )}
                keyExtractor={(item) => item.id}
                numColumns={1}
            />
        </View>
    );
};

export default SongsGrid;
