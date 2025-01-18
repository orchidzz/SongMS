import axios from "axios";

const YouTubeAPI = axios.create({
    baseURL: "https://www.googleapis.com/youtube/v3",
});

export const YouTubeSearchSongByKeyword = async (keyword, apiKey) => {
    try {
        const query = `${keyword} official music`;
        const response = await YouTubeAPI.get("/search", {
            params: {
                part: "snippet",
                q: query,
                type: "video",
                videoCategoryId: "10", // for music
                maxResults: 5,
                key: apiKey,
                order: "relevance",
            },
        });

        return response.data.items.map((track) => {
            const videoId = track.id.videoId;
            const videoUri = `https://www.youtube.com/watch?v=${videoId}`;
            const title = track.snippet.title;
            const titleParts = title.split(" - "); // Split title into song and artist
            let songName = titleParts.length > 1 ? titleParts[1] : title;
            const artistName = titleParts.length > 1 ? titleParts[0] : "";
            const unwantedWordsRegex = /\s*\(.*official.*?\)/i; // Matches phrases like (Official Music Video), (Official Video), etc.
            songName = songName.replace(unwantedWordsRegex, "").trim();

            return {
                songName,
                artistName,
                uri: videoUri,
            };
        });
    } catch (error) {
        console.error("Error fetching youtube data:", error);
    }
};

export const YouTubeGetUriGivenSong = async (songName, artistName, apiKey) => {
    try {
        const query = `${songName} ${artistName} official music`;
        const response = await YouTubeAPI.get("/search", {
            params: {
                part: "snippet",
                q: query,
                type: "video",
                videoCategoryId: "10", // for music
                maxResults: 1,
                key: apiKey,
                order: "relevance",
            },
        });
        const items = response.data.items;

        if (items.length > 0) {
            const videoId = items[0].id.videoId;
            const videoUri = `https://www.youtube.com/watch?v=${videoId}`;
            return videoUri;
        } else {
            return "";
        }
    } catch (error) {
        console.error("Error fetching video:", error);
        return "";
    }
};
