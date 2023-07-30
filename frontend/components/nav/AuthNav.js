import React from "react";
import LoginScreen from "../../screens/auth/login";
import RegistrationScreen from "../../screens/auth/register";
import ResetPWScreen from "../../screens/auth/reset";
import ForgotPWScreen from "../../screens/auth/forgotpw";
import { createStackNavigator } from "@react-navigation/stack";

const AuthNavigator = createStackNavigator();
const AuthNav = () => {
    return (
        <AuthNavigator.Navigator screenOptions={{ headerShown: false }}>
            <AuthNavigator.Screen name="Login" component={LoginScreen} />
            <AuthNavigator.Screen
                name="Registration"
                component={RegistrationScreen}
            />
            <AuthNavigator.Screen name="ResetPW" component={ResetPWScreen} />
            <AuthNavigator.Screen name="ForgotPW" component={ForgotPWScreen} />
        </AuthNavigator.Navigator>
    );
};
// const AuthNavigator = createStackNavigator(
//     {
//         Login: { screen: LoginScreen },
//         Registration: { screen: RegistrationScreen },
//         ResetPW: { screen: ResetPWScreen },
//         ForgotPW: { screen: ForgotPWScreen },
//     },
//     {
//         initialRouteName: "Login",
//         defaultNavigationOptions: {
//             headerShown: false, // Hide header for all screens in the stack
//         },
//     }
// );
export default AuthNav;
