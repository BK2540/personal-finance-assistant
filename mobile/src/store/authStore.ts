import { create } from 'zustand'
import * as SecureStore from 'expo-secure-store'

const TOKEN_KEY = 'mini_token';

interface AuthState {
    token: string | null;
    isLoading: boolean;
    setToken: (token: string) => Promise<void>;
    clearToken: () => Promise<void>;
    loadToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    token: null,
    isLoading: true,

    setToken: async (token: string) => {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
        set({ token });
    },

    clearToken: async () => {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        set({token: null});
    },

    loadToken: async () => {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        set({token, isLoading: false});
    }
}));