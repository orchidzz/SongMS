import { create } from "zustand";
import { AuthSlice, UserSlice, NearbyUsersSlice } from "./slices";

export const useStore = create((...a) => ({
    ...AuthSlice(...a),
    ...UserSlice(...a),
    ...NearbyUsersSlice(...a),
}));
