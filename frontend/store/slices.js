export const AuthSlice = (set) => ({
    isAuthorized: false,
    token: "",
    setIsAuthorized: () => set({ isAuthorized: !state.isAuthorized }),
    setToken: (token) => set({ token: token }),
});

export const UserSlice = (set) => ({
    username: "",
    userEmail: "",
    userGeohash: "",
    userBio: "",
    userImg: require("../assets/User-avatar.svg.png"),
    // song object: {songName: , artistName: , username: , songImg}
    userInbox: [],
    setUsername: (username) => set({ username: username }),
    setUserEmail: (userEmail) => set({ userEmail: userEmail }),
    setUserBio: (userBio) => set({ userBio: userBio }),
    setUserImg: (userImg) => set({ userImg: userImg }),
    setUserGeohash: (userGeohash) => set({ userGeohash: userGeohash }),
    setUserInbox: (userInbox) => set({ userInbox: userInbox }),
});

export const NearbyUsersSlice = (set) => ({
    // user object: {username: string, geohash: string, userImg: string, userBio: string}
    nearbyUsers: [],
    setNearbyUsers: (nearbyUsers) => set({ nearbyUsers: nearbyUsers }),
});
