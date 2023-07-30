import { registerRootComponent } from "expo";
import { initializeApp } from "firebase/app";

import App from "./App";
const firebaseConfig = {
    authDomain: "songms-eb7ed.firebaseapp.com",
    apiKey: "AIzaSyCh6K1CKTeeHKg0Dm7FfqLSz34iTqmK618",
    projectId: "songms-eb7ed",
};
const app = initializeApp(firebaseConfig);

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
