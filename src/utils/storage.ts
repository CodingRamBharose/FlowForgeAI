const STORAGE_PREFIX = 'flowforge_';

export const storage = {
    get: <T>(key: string): T | null => {
        try {
            const item = localStorage.getItem(STORAGE_PREFIX + key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(`Error reading from localStorage: ${error}`);
            return null;
        }
    },

    set: <T>(key: string, value: T): void => {
        try {
            localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error writing to localStorage: ${error}`);
        }
    },

    remove: (key: string): void => {
        try {
            localStorage.removeItem(STORAGE_PREFIX + key);
        } catch (error) {
            console.error(`Error removing from localStorage: ${error}`);
        }
    },

    clear: (): void => {
        try {
            Object.keys(localStorage)
                .filter((key) => key.startsWith(STORAGE_PREFIX))
                .forEach((key) => localStorage.removeItem(key));
        } catch (error) {
            console.error(`Error clearing localStorage: ${error}`);
        }
    },
};

export const AUTH_TOKEN_KEY = 'auth_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';
export const USER_KEY = 'user';
export const THEME_KEY = 'theme';
