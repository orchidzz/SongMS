import React from "react";
import { View } from "react-native";
import AuthNav from "./components/nav/AuthNav";
import BottomNav from "./components/nav/BottomNav";
import { useStore } from "./store/store";
import { NavigationContainer } from "@react-navigation/native";
const App = () => {
    const isAuthorized = useStore((state) => state.isAuthorized);
    return (
        <View style={{ flex: 1 }}>
            <NavigationContainer>
                {!isAuthorized ? <BottomNav /> : <AuthNav />}
            </NavigationContainer>
        </View>
    );
};

export default App;
