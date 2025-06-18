import apiClient from './apiClient';
import { setToken, removeToken } from '../utils/authUtils';

/**
 * 用户登录
 * @param {string} username - 用户名
 * @param {string} password - 密码
 * @returns {Promise<Object>} - 包含用户信息和token的对象
 */
export const login = async (username, password) => {
    try {
        const response = await apiClient.post('/auth/login', {
            username,
            password
        });
        
        if (response.token) {
            setToken(response.token);
        }
        
        return response;
    } catch (error) {
        console.error('登录失败:', error);
        throw error;
    }
};

/**
 * 用户注册
 * @param {string} username - 用户名
 * @param {string} email - 邮箱
 * @param {string} password - 密码
 * @returns {Promise<Object>} - 注册结果
 */
export const register = async (username, email, password) => {
    try {
        const response = await apiClient.post('/auth/register', {
            username,
            email,
            password
        });
        return response;
    } catch (error) {
        console.error('注册失败:', error);
        throw error;
    }
};

/**
 * 用户登出
 */
export const logout = () => {
    removeToken();
    window.location.href = '/login';
};

/**
 * 获取当前用户信息
 * @returns {Promise<Object>} - 用户信息
 */
export const getCurrentUser = async () => {
    try {
        const response = await apiClient.get('/auth/user');
        return response;
    } catch (error) {
        console.error('获取用户信息失败:', error);
        throw error;
    }
};

/**
 * 刷新令牌
 * @returns {Promise<Object>} - 包含新token的对象
 */
export const refreshToken = async () => {
    try {
        const response = await apiClient.post('/auth/refresh');
        
        if (response.token) {
            setToken(response.token);
        }
        
        return response;
    } catch (error) {
        console.error('刷新令牌失败:', error);
        throw error;
    }
};    