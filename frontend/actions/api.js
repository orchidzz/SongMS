import axios from "axios";
import { useStore } from "../store/store";

const API = axios.create({
    baseURL: "",
});
function listen() {
    useStore.subscribe(
        (state) => (API.defaults.headers.common["Authorization"] = state.token)
    );
}
listen();

export const APIGetUser = () => API.get(`/getUser`);
export const APIUpdateUser = (user) => API.post(`/updateUser`, user);
export const APIRegisterUser = (user) => API.post(`/register`, user);
// message object: {receiver: string, ...songObject}
export const APISendSong = (message) => API.post(`/send`, message);
