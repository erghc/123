/**
 * 应用常量定义
 * 包含文件类型、API路径、验证规则等常量
 */

// 文件类型常量
export const FILE_TYPES = {
    ALL: 'all',
    PDF: 'pdf',
    DOCUMENT: 'document',
    IMAGE: 'image',
    VIDEO: 'video',
    AUDIO: 'audio',
    ARCHIVE: 'archive',
    TEXT: 'text',
    CODE: 'code'
};

// 文件扩展名映射到文件类型
export const FILE_EXTENSIONS = {
    pdf: FILE_TYPES.PDF,
    doc: FILE_TYPES.DOCUMENT,
    docx: FILE_TYPES.DOCUMENT,
    xls: FILE_TYPES.DOCUMENT,
    xlsx: FILE_TYPES.DOCUMENT,
    ppt: FILE_TYPES.DOCUMENT,
    pptx: FILE_TYPES.DOCUMENT,
    jpg: FILE_TYPES.IMAGE,
    jpeg: FILE_TYPES.IMAGE,
    png: FILE_TYPES.IMAGE,
    gif: FILE_TYPES.IMAGE,
    bmp: FILE_TYPES.IMAGE,
    svg: FILE_TYPES.IMAGE,
    mp4: FILE_TYPES.VIDEO,
    mov: FILE_TYPES.VIDEO,
    avi: FILE_TYPES.VIDEO,
    mkv: FILE_TYPES.VIDEO,
    mp3: FILE_TYPES.AUDIO,
    wav: FILE_TYPES.AUDIO,
    ogg: FILE_TYPES.AUDIO,
    zip: FILE_TYPES.ARCHIVE,
    rar: FILE_TYPES.ARCHIVE,
    tar: FILE_TYPES.ARCHIVE,
    gz: FILE_TYPES.ARCHIVE,
    txt: FILE_TYPES.TEXT,
    md: FILE_TYPES.TEXT,
    log: FILE_TYPES.TEXT,
    html: FILE_TYPES.CODE,
    css: FILE_TYPES.CODE,
    js: FILE_TYPES.CODE,
    json: FILE_TYPES.CODE,
    xml: FILE_TYPES.CODE,
    java: FILE_TYPES.CODE,
    py: FILE_TYPES.CODE
};

// 支持的文件扩展名集合
export const SUPPORTED_EXTENSIONS = new Set([
    'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
    'jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg',
    'mp4', 'mov', 'avi', 'mkv',
    'mp3', 'wav', 'ogg',
    'zip', 'rar', 'tar', 'gz',
    'txt', 'md', 'log',
    'html', 'css', 'js', 'json', 'xml', 'java', 'py'
]);

// 路由路径常量
export const ROUTES = {
    HOME: '/',
    SEARCH: '/search',
    FILE_DETAILS: '/files/:id',
    LOGIN: '/login',
    REGISTER: '/register',
    UPLOAD: '/upload',
    BROWSE: '/browse',
    ADMIN: {
        DASHBOARD: '/admin/dashboard',
        USERS: '/admin/users',
        FILES: '/admin/files',
        SETTINGS: '/admin/settings'
    }
};

// 验证规则常量
export const VALIDATION_RULES = {
    USERNAME: {
        min: 3,
        max: 20,
        pattern: /^[a-zA-Z0-9_]+$/,
        message: '用户名必须为3-20位字母、数字或下划线'
    },
    PASSWORD: {
        min: 6,
        max: 30,
        message: '密码必须为6-30位字符'
    },
    EMAIL: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: '请输入有效的电子邮件地址'
    },
    FILE_NAME: {
        max: 255,
        invalidChars: /[\\/:*?"<>|]/,
        message: '文件名不能包含 \\ / : * ? " < > | 字符，且长度不能超过255'
    }
};

// 本地存储键常量
export const LOCAL_STORAGE_KEYS = {
    TOKEN: 'ftp-search-token',
    USER: 'ftp-search-user',
    THEME: 'ftp-search-theme',
    SEARCH_HISTORY: 'ftp-search-search-history',
    PREFERENCES: 'ftp-search-preferences'
};

// API错误代码常量
export const API_ERROR_CODES = {
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500
};

// 通知类型常量
export const NOTIFICATION_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
};

// 主题常量
export const THEMES = {
    LIGHT: 'light',
    DARK: 'dark'
};    