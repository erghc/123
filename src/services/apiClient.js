import axios from 'axios';
import { getToken, removeToken } from '../utils/authUtils';

// 创建axios实例
const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// 请求拦截器
apiClient.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('请求拦截器错误:', error);
        return Promise.reject(error);
    }
);

// 响应拦截器
apiClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        console.error('响应拦截器错误:', error);
        
        // 处理401 Unauthorized错误
        if (error.response && error.response.status === 401) {
            removeToken();
            window.location.href = '/login';
        }
        
        return Promise.reject(error);
    }
);

export default apiClient;    