import axios from "axios";
import { useStore } from "../store/store";

// need for push notif and sockets later on?
const API = axios.create({
    baseURL: "https://songms.onrender.com/api",
});

useStore.subscribe(
    (state) => (API.defaults.headers.common["Authorization"] = state.token)
);

export const APIConnectGeohash = async (userName, geohash, socketId) => {
    const response = await API.post(
        "/geohash",
        {
            roomId: userName,
            geohash: geohash,
            socketId: socketId,
        },
        {
            headers: {
                "Content-Type": "application/json",
            },
            timeout: 120000, // 2 minutes
        }
    );
    return response;
};

// export const APISendNotif = async (token, title, body) => {
//     const response = await API.post(
//         "/send-push-notif",
//         {
//             token: token,
//             title: title,
//             body: body,
//         },
//         {
//             headers: {
//                 "Content-Type": "application/json",
//             },
//         }
//     );
//     return response;
// };
