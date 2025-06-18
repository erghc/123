/**
 * 数据验证工具函数集合
 * 包含表单验证、输入验证等功能
 */

import { VALIDATION_RULES } from './constants';

/**
 * 验证用户名
 * @param {string} username - 要验证的用户名
 * @returns {boolean} 验证结果
 */
export const validateUsername = (username) => {
    if (!username) return false;
    if (username.length < VALIDATION_RULES.USERNAME.min || 
        username.length > VALIDATION_RULES.USERNAME.max) {
        return false;
    }
    return VALIDATION_RULES.USERNAME.pattern.test(username);
};

/**
 * 验证密码
 * @param {string} password - 要验证的密码
 * @returns {boolean} 验证结果
 */
export const validatePassword = (password) => {
    if (!password) return false;
    return password.length >= VALIDATION_RULES.PASSWORD.min && 
           password.length <= VALIDATION_RULES.PASSWORD.max;
};

/**
 * 验证电子邮件
 * @param {string} email - 要验证的电子邮件
 * @returns {boolean} 验证结果
 */
export const validateEmail = (email) => {
    if (!email) return false;
    return VALIDATION_RULES.EMAIL.pattern.test(email);
};

/**
 * 验证文件名
 * @param {string} fileName - 要验证的文件名
 * @returns {boolean} 验证结果
 */
export const validateFileName = (fileName) => {
    if (!fileName) return false;
    if (fileName.length > VALIDATION_RULES.FILE_NAME.max) return false;
    return !VALIDATION_RULES.FILE_NAME.invalidChars.test(fileName);
};

/**
 * 验证文件类型
 * @param {string} fileType - 文件扩展名
 * @returns {boolean} 验证结果
 */
export const validateFileType = (fileType) => {
    if (!fileType) return false;
    const ext = fileType.toLowerCase();
    return SUPPORTED_EXTENSIONS.has(ext);
};

/**
 * 验证文件大小
 * @param {number} fileSize - 文件大小（字节）
 * @param {number} maxSize - 最大允许大小（字节）
 * @returns {boolean} 验证结果
 */
export const validateFileSize = (fileSize, maxSize) => {
    return fileSize <= maxSize;
};

/**
 * 验证表单字段
 * @param {object} fields - 表单字段对象
 * @param {object} rules - 验证规则对象
 * @returns {object} 验证结果对象 { isValid: boolean, errors: object }
 */
export const validateFields = (fields, rules) => {
    const errors = {};
    let isValid = true;

    for (const field in rules) {
        if (rules.hasOwnProperty(field) && fields.hasOwnProperty(field)) {
            const value = fields[field];
            const rule = rules[field];
            
            // 检查必填字段
            if (rule.required && (!value || value.trim() === '')) {
                errors[field] = rule.errorMessage || '此字段为必填项';
                isValid = false;
                continue;
            }
            
            // 检查最小长度
            if (rule.min && value.length < rule.min) {
                errors[field] = rule.minErrorMessage || `至少需要${rule.min}个字符`;
                isValid = false;
                continue;
            }
            
            // 检查最大长度
            if (rule.max && value.length > rule.max) {
                errors[field] = rule.maxErrorMessage || `最多不能超过${rule.max}个字符`;
                isValid = false;
                continue;
            }
            
            // 检查正则表达式
            if (rule.pattern && !rule.pattern.test(value)) {
                errors[field] = rule.errorMessage || '输入格式不正确';
                isValid = false;
            }
        }
    }

    return {
        isValid,
        errors
    };
};

/**
 * 验证文件
 * @param {File} file - 要验证的文件
 * @param {object} options - 验证选项
 * @param {number} options.maxSize - 最大文件大小（字节）
 * @returns {object} 验证结果对象 { isValid: boolean, error: string }
 */
export const validateFile = (file, options = {}) => {
    if (!file) {
        return { isValid: false, error: '请选择文件' };
    }

    const { maxSize = 100 * 1024 * 1024 } = options; // 默认100MB
    const fileType = file.name.split('.').pop()?.toLowerCase();

    if (!validateFileType(fileType)) {
        return { 
            isValid: false, 
            error: '不支持的文件类型，支持的类型: ' + Array.from(SUPPORTED_EXTENSIONS).join(', ') 
        };
    }

    if (!validateFileSize(file.size, maxSize)) {
        return { 
            isValid: false, 
            error: `文件大小不能超过${maxSize / (1024 * 1024)}MB` 
        };
    }

    if (!validateFileName(file.name)) {
        return { 
            isValid: false, 
            error: '文件名包含非法字符或长度超过限制' 
        };
    }

    return { isValid: true, error: '' };
};    