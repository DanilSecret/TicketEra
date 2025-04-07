import { create } from "zustand";
import { persist } from 'zustand/middleware'

type UserData = {
    command: string;
    rowCount: number;
    rows: {
        uuid: string;
        username: string;
        role: string;
        email: string;
        responsibility: number | null;
    }[];
} | null;

type UserState = {
    isAuth: boolean;
    userData: UserData;
    setIsAuth: (auth: boolean) => void;
    setUserData: (data: UserData) => void;
};

export const useUserStore = create(
    persist<UserState>(
        (set) => ({
            isAuth: false,
            userData: null,
            setIsAuth: (auth) => set({ isAuth: auth }),
            setUserData: (data) => set({ userData: data }),
        }),
        { name: 'userdata-storage' },
    )
);