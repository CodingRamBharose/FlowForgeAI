import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types/roles';
import { storage, USER_KEY, AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/utils/storage';

interface AuthState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: storage.get<User>(USER_KEY),
    token: storage.get<string>(AUTH_TOKEN_KEY),
    refreshToken: storage.get<string>(REFRESH_TOKEN_KEY),
    isAuthenticated: !!storage.get<string>(AUTH_TOKEN_KEY),
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{ user: User; token: string; refreshToken: string }>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.refreshToken = action.payload.refreshToken;
            state.isAuthenticated = true;
            storage.set(USER_KEY, action.payload.user);
            storage.set(AUTH_TOKEN_KEY, action.payload.token);
            storage.set(REFRESH_TOKEN_KEY, action.payload.refreshToken);
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            storage.remove(USER_KEY);
            storage.remove(AUTH_TOKEN_KEY);
            storage.remove(REFRESH_TOKEN_KEY);
        },
        updateUser: (state, action: PayloadAction<Partial<User>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
                storage.set(USER_KEY, state.user);
            }
        },
        refreshToken: (state, action: PayloadAction<{ token: string; refreshToken: string }>) => {
            state.token = action.payload.token;
            state.refreshToken = action.payload.refreshToken;
            storage.set(AUTH_TOKEN_KEY, action.payload.token);
            storage.set(REFRESH_TOKEN_KEY, action.payload.refreshToken);
        },
    },
});

export const { login, logout, updateUser, refreshToken } = authSlice.actions;
export default authSlice.reducer;
