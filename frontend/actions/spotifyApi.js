import axios from "axios";

const SpotifyAPI = axios.create({
    baseURL: "https://api.spotify.com",
});

export const SpotifySearchSongByKeyword = async (keyword, accessToken) => {
    SpotifyAPI.defaults.headers.common[
        "Authorization"
    ] = `Bearer ${accessToken}`;
    const response = await SpotifyAPI.get(`/v1/search`, {
        params: {
            q: keyword,
            type: "track",
            limit: 5,
        },
    });
    return response.data.tracks.items.map((track) => ({
        songName: track.name,
        artistName: track.artists[0].name,
        uri: track.uri,
    }));
};

export const SpotifyPlaySong = async (songUri, accessToken) => {
    try {
        SpotifyAPI.defaults.headers.common[
            "Authorization"
        ] = `Bearer ${accessToken}`;

        // Get the list of devices
        const devicesResponse = await SpotifyAPI.get(`/v1/me/player/devices`);
        const devices = devicesResponse.data.devices;

        if (!devices || devices.length === 0) {
            throw new Error(
                "No active devices found. Please open Spotify on a device."
            );
        }

        // Find the active device or use the first device in the list
        const activeDevice =
            devices.find((device) => device.is_active) || devices[0];

        const deviceId = activeDevice.id;

        // Play the song on the selected device
        await SpotifyAPI.put(`/v1/me/player/play?device_id=${deviceId}`, {
            uris: [songUri],
        });
    } catch (error) {
        // 403: premium account required error
        if (
            error.response?.status != 403 ||
            error.message !=
                "No active devices found. Please open Spotify on a device."
        ) {
            console.error(
                "Error playing song:",
                error.response ? error.response.data : error.message
            );
            throw error;
        }
    }
};

export const SpotifyGetAccessTokenUsingRefreshToken = async (
    refreshToken,
    clientId,
    clientSecret
) => {
    const tokenUrl = "https://accounts.spotify.com/api/token";

    try {
        const response = await axios.post(
            tokenUrl,
            new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: refreshToken,
            }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Basic ${btoa(
                        `${clientId}:${clientSecret}`
                    )}`,
                },
            }
        );
        return response.data.access_token;
    } catch (error) {
        console.error(
            "Error refreshing access token:",
            error.response?.data || error.message
        );
    }
};
