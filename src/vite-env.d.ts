/// \u003creference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_NAME: string;
    readonly VITE_API_BASE_URL: string;
    readonly VITE_ENABLE_MOCK_API: string;
    readonly VITE_FEATURE_VERSIONING: string;
    readonly VITE_FEATURE_AUDIT_TRAIL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
