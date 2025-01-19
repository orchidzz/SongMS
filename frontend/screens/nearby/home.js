import React, { useState, useEffect, useRef } from "react";
import { AppState, Platform, PermissionsAndroid } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import UsersGrid from "../../components/users/usersGrid";
import { useStore } from "../../store/store";
import { getUser, getUsersByUsernameKeyword } from "../../actions/firestore";
import io from "socket.io-client";
import { APIConnectGeohash } from "../../actions/api";
import ErrorPopup from "../../components/errors/customErrorPopup";
import ngeohash from "ngeohash";
import * as Location from "expo-location";
import { distanceBetweenGeohashes } from "../../actions/utils/geohashUtils";

const SOCKET_URL = "https://songms.onrender.com/";

const HomeScreen = ({ navigation }) => {
    const {
        uid,
        userName,
        setUserBio,
        setUserName,
        setSpotifyRefreshToken,
        setUserImg,
        userSocket,
        setUserSocket,
        setLastSendDatetime,
    } = useStore();
    const [nearbyUsers, setNearbyUsers] = useState([]);
    const [refreshing, setRefreshing] = useState(true);
    const [geohash, setGeohash] = useState("");
    const socketRef = useRef(userSocket);
    const appState = useRef(AppState.currentState);
    const [locationPermission, setLocationPermission] = useState(false);
    const [errorVisisble, setErrorVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [intervalId, setIntervalId] = useState(null);

    const requestLocationPermission = async () => {
        try {
            const { status } =
                await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setLocationPermission(false);
            } else {
                setLocationPermission(true);
            }
        } catch (error) {
            console.error("Error getting location", error);
        }
    };
    const initSocket = async () => {
        const newGeohash = await getUserLocation();
        setGeohash(newGeohash);
        try {
            socketRef.current = io(SOCKET_URL);
            setUserSocket(socketRef.current);

            socketRef.current.on("connect", async () => {
                const socketId = socketRef.current.id;
                await APIConnectGeohash(userName, newGeohash, socketId);
            });
            socketRef.current.on("update-nearby-user", async (data) => {
                if (userName === "") {
                    return;
                }
                let newNearbyUsers = [];
                for (const user of data.nearbyUsers) {
                    // skip self
                    if (user.userName === userName) {
                        continue;
                    }
                    const userInfo = await getUsersByUsernameKeyword(
                        user.userName
                    );
                    newNearbyUsers.push(userInfo[0]);
                }
                setNearbyUsers(newNearbyUsers);
            });

            // emit geohash every 5 minutes
            const intervalId = setInterval(async () => {
                if (socketRef.current && locationPermission) {
                    const newGeohash = await getUserLocation();
                    if (
                        newGeohash &&
                        distanceBetweenGeohashes(newGeohash, geohash) > 2
                    ) {
                        socketRef.current.emit("broadcast-geohash", {
                            userGeohash: geohash,
                            user: userName,
                        });
                        setGeohash(newGeohash);
                    }
                }
            }, 300000);

            setIntervalId(intervalId);
        } catch (error) {
            console.log(error);
            setErrorMessage("Error using this feature. Try again later.");
            setErrorVisible(true);
            console.log("Error initiating socket connection");
        }
    };

    const closeSocket = () => {
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
            setNearbyUsers([]);
            setUserSocket(null);
        }
    };

    const checkLocationPermission = async () => {
        if (Platform.OS === "android") {
            const status = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            );
            setLocationPermission(status);
        } else if (Platform.OS === "ios") {
            const status = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
            setLocationPermission(status === RESULTS.GRANTED);
        }
    };

    const getUserLocation = async () => {
        try {
            const location = await Location.getCurrentPositionAsync({});
            const geohash = ngeohash.encode(
                location.coords.latitude,
                location.coords.longitude,
                52
            );
            return geohash;
        } catch (error) {
            console.error("Error getting location", error);
            return null;
        }
    };
    const loadUsers = async () => {
        if (locationPermission) {
            // emit to socket
            const newGeohash = await getUserLocation();
            if (newGeohash && newGeohash != geohash) {
                setGeohash(newGeohash);
                if (socketRef.current && userName !== "") {
                    socketRef.current.emit("broadcast-geohash", {
                        userGeohash: newGeohash,
                        user: userName,
                    });
                } else {
                    initSocket();
                }
            }
        } else {
            await requestLocationPermission();
        }
        setRefreshing(false);
    };

    // get user info initially
    useEffect(() => {
        const loadUserInfo = async () => {
            if (userName === "" && uid != "") {
                const user = await getUser(uid);
                if (user) {
                    setUserBio(user.bio);
                    setUserName(user.username);
                    setUserImg(user.userImg);
                    setSpotifyRefreshToken(user.spotifyRefreshToken);
                    setLastSendDatetime(user.lastSendDatetime);
                }
            }
        };
        loadUserInfo();
    }, [uid]);

    // monitor appstate and permission changes
    useEffect(() => {
        const handleAppStateChange = async (nextAppState) => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === "active"
            ) {
                // App comes to foreground
                checkLocationPermission();

                if (locationPermission && !socketRef.current) {
                    initSocket();
                }
            } else if (nextAppState.match(/inactive|background/)) {
                // App goes to background
                closeSocket();
            }
            appState.current = nextAppState;
        };

        // Initial permission check
        checkLocationPermission();

        // Listen to app state changes
        const subscription = AppState.addEventListener(
            "change",
            handleAppStateChange
        );

        return () => {
            subscription.remove();
            closeSocket();
            intervalId ? clearInterval(intervalId) : () => {};
        };
    }, [locationPermission, uid]);

    // check for location permission change
    useEffect(() => {
        if (locationPermission && (!socketRef || !userSocket)) {
            if (socketRef) {
                closeSocket();
            }
            initSocket();
        } else {
            requestLocationPermission();
            closeSocket();
        }
    }, [locationPermission]);

    return (
        <LinearGradient
            colors={["#647DEE", "#7F53AC"]}
            style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                paddingTop: 60, // might change
            }}
        >
            <ErrorPopup
                visible={errorVisisble}
                message={errorMessage}
                onClose={() => {
                    setErrorVisible(false);
                }}
            />
            <UsersGrid
                users={nearbyUsers}
                navigation={navigation}
                refreshing={refreshing}
                refreshFunc={loadUsers}
            />
        </LinearGradient>
    );
};

export default HomeScreen;
