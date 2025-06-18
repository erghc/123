// 从环境变量获取配置，没有则使用默认值
const config = {
    apiBaseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api',
    defaultPageSize: parseInt(process.env.REACT_APP_DEFAULT_PAGE_SIZE) || 10,
    maxFileSize: parseInt(process.env.REACT_APP_MAX_FILE_SIZE) || 100 * 1024 * 1024, // 默认100MB
    searchDebounceTime: parseInt(process.env.REACT_APP_SEARCH_DEBOUNCE_TIME) || 300, // 默认300ms
    theme: {
        primaryColor: process.env.REACT_APP_PRIMARY_COLOR || '#165DFF',
        secondaryColor: process.env.REACT_APP_SECONDARY_COLOR || '#0FC6C2',
        accentColor: process.env.REACT_APP_ACCENT_COLOR || '#722ED1',
        darkMode: process.env.REACT_APP_DARK_MODE === 'true' || false
    },
    features: {
        filePreview: process.env.REACT_APP_FEATURE_FILE_PREVIEW === 'true' || true,
        fileUpload: process.env.REACT_APP_FEATURE_FILE_UPLOAD === 'true' || true,
        fileDownload: process.env.REACT_APP_FEATURE_FILE_DOWNLOAD === 'true' || true,
        fileDelete: process.env.REACT_APP_FEATURE_FILE_DELETE === 'true' || true,
        directoryCreation: process.env.REACT_APP_FEATURE_DIRECTORY_CREATION === 'true' || true,
        searchHistory: process.env.REACT_APP_FEATURE_SEARCH_HISTORY === 'true' || true,
        userManagement: process.env.REACT_APP_FEATURE_USER_MANAGEMENT === 'true' || true
    }
};

export default config;    