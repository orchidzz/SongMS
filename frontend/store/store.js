import { create } from "zustand";
import { AuthSlice, UserSlice } from "./slices";

export const useStore = create((...a) => ({
    ...AuthSlice(...a),
    ...UserSlice(...a),
}));
