import React from "react";
import { View } from "react-native";
import AuthNav from "./components/nav/AuthNav";
import BottomNav from "./components/nav/BottomNav";

const App = () => {
    return (
        <View style={{ flex: 1 }}>
            <BottomNav />
        </View>
    );
};

export default App;
