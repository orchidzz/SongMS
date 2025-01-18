import { registerRootComponent } from "expo";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import App from "./App";
const firebaseConfig = {
    apiKey: "AIzaSyCh6K1CKTeeHKg0Dm7FfqLSz34iTqmK618",
    authDomain: "songms-eb7ed.firebaseapp.com",
    databaseURL: "https://songms-eb7ed-default-rtdb.firebaseio.com",
    projectId: "songms-eb7ed",
    storageBucket: "songms-eb7ed.appspot.com",
    messagingSenderId: "800350549168",
    appId: "1:800350549168:web:abe4f995a78c38ae3bb775",
};
export const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const database = getDatabase(app);

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
