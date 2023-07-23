import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import LoginScreen from "../../screens/auth/login";
import RegistrationScreen from "../../screens/auth/register";
import ResetPWScreen from "../../screens/auth/reset";
import ForgotPWScreen from "../../screens/auth/forgotpw";
import { createAppContainer } from "react-navigation";

const AuthNavigator = createStackNavigator(
    {
        Login: { screen: LoginScreen },
        Registration: { screen: RegistrationScreen },
        ResetPW: { screen: ResetPWScreen },
        ForgotPW: { screen: ForgotPWScreen },
    },
    {
        initialRouteName: "Login",
        defaultNavigationOptions: {
            headerShown: false, // Hide header for all screens in the stack
        },
    }
);
export default createAppContainer(AuthNavigator);
