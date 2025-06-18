import config from './index';

const API_BASE = config.apiBaseUrl;

const endpoints = {
    // 认证相关
    auth: {
        login: `${API_BASE}/auth/login`,
        register: `${API_BASE}/auth/register`,
        logout: `${API_BASE}/auth/logout`,
        user: `${API_BASE}/auth/user`,
        refresh: `${API_BASE}/auth/refresh`
    },
    
    // 文件相关
    files: {
        list: (directoryPath = '') => `${API_BASE}/files?directoryPath=${encodeURIComponent(directoryPath)}`,
        details: (fileId) => `${API_BASE}/files/${fileId}`,
        download: (fileId) => `${API_BASE}/files/${fileId}/download`,
        upload: `${API_BASE}/files/upload`,
        delete: (fileId) => `${API_BASE}/files/${fileId}`,
        createDirectory: `${API_BASE}/files/directory`,
        rename: (itemId) => `${API_BASE}/files/${itemId}/rename`,
        move: `${API_BASE}/files/move`,
        copy: `${API_BASE}/files/copy`
    },
    
    // 搜索相关
    search: {
        search: `${API_BASE}/search`,
        suggestions: `${API_BASE}/search/suggestions`,
        popular: `${API_BASE}/search/popular`,
        stats: `${API_BASE}/search/stats`,
        history: `${API_BASE}/search/history`
    },
    
    // 系统设置相关
    settings: {
        general: `${API_BASE}/settings/general`,
        ftp: `${API_BASE}/settings/ftp`,
        indexing: `${API_BASE}/settings/indexing`,
        notifications: `${API_BASE}/settings/notifications`
    },
    
    // 管理相关
    admin: {
        users: `${API_BASE}/admin/users`,
        user: (userId) => `${API_BASE}/admin/users/${userId}`,
        stats: `${API_BASE}/admin/stats`,
        logs: `${API_BASE}/admin/logs`,
        config: `${API_BASE}/admin/config`
    }
};

export default endpoints;    