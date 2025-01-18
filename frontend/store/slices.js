export const AuthSlice = (set) => ({
    isAuthorized: false,
    spotifyRefreshToken: "",
    spotifyAccessToken: "",
    uid: "",
    token: "",
    youtubeApikey: "",
    setIsAuthorized: (isAuthorized) => set({ isAuthorized: isAuthorized }),
    setSpotifyRefreshToken: (token) => set({ spotifyRefreshToken: token }),
    setSpotifyAccessToken: (token) => set({ spotifyAccessToken: token }),
    setUID: (uid) => set({ uid: uid }),
    setToken: (token) => set({ token: token }),
    setYoutubeApikey: (key) => set({ youtubeApikey: key }),
});

export const UserSlice = (set) => ({
    userName: "",
    userEmail: "",
    userGeohash: "",
    userBio: "",
    userImg: "",
    defaultUserImg: require("../assets/User-avatar.svg.png"),
    setUserName: (username) => set({ userName: username }),
    setUserEmail: (userEmail) => set({ userEmail: userEmail }),
    setUserBio: (userBio) => set({ userBio: userBio }),
    setUserImg: (userImg) => set({ userImg: userImg }),
    setUserGeohash: (userGeohash) => set({ userGeohash: userGeohash }),
    userSocket: null,
    setUserSocket: (socket) => set({ userSocket: socket }),
    lastSendDatetime: null, // to limit write op
    setLastSendDatetime: (datetime) => set({ lastSendDatetime: datetime }),
});
