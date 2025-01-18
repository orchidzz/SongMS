import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, View } from "react-native";
import SongForm from "../../components/forms/songForm";
import { useRoute } from "@react-navigation/native";

const SendSongScreen = ({ navigation }) => {
    const route = useRoute();
    const user = route.params.user;
    return (
        <LinearGradient colors={["#647DEE", "#7F53AC"]} style={{ flex: 1 }}>
            <View contentContainerStyle={{ marginTop: 0 }}>
                <SongForm receiver={user} navigation={navigation} />
            </View>
        </LinearGradient>
    );
};

export default SendSongScreen;
