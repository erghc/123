import apiClient from './apiClient';

/**
 * 获取文件列表
 * @param {string} directoryPath - 目录路径
 * @returns {Promise<Array>} - 文件列表
 */
export const getFileList = async (directoryPath = '') => {
    try {
        const response = await apiClient.get('/files', {
            params: {
                directoryPath
            }
        });
        return response;
    } catch (error) {
        console.error('获取文件列表失败:', error);
        throw error;
    }
};

/**
 * 获取文件详情
 * @param {string} fileId - 文件ID
 * @returns {Promise<Object>} - 文件详情
 */
export const getFileDetails = async (fileId) => {
    try {
        const response = await apiClient.get(`/files/${fileId}`);
        return response;
    } catch (error) {
        console.error('获取文件详情失败:', error);
        throw error;
    }
};

/**
 * 下载文件
 * @param {string} fileId - 文件ID
 * @returns {Promise<Blob>} - 文件内容
 */
export const downloadFile = async (fileId) => {
    try {
        const response = await apiClient.get(`/files/${fileId}/download`, {
            responseType: 'blob'
        });
        return response;
    } catch (error) {
        console.error('下载文件失败:', error);
        throw error;
    }
};

/**
 * 上传文件
 * @param {File} file - 要上传的文件
 * @param {string} directoryPath - 上传目录路径
 * @returns {Promise<Object>} - 上传结果
 */
export const uploadFile = async (file, directoryPath = '') => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('directoryPath', directoryPath);

        const response = await apiClient.post('/files/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response;
    } catch (error) {
        console.error('上传文件失败:', error);
        throw error;
    }
};

/**
 * 删除文件
 * @param {string} fileId - 文件ID
 * @returns {Promise<void>}
 */
export const deleteFile = async (fileId) => {
    try {
        await apiClient.delete(`/files/${fileId}`);
    } catch (error) {
        console.error('删除文件失败:', error);
        throw error;
    }
};

/**
 * 创建目录
 * @param {string} directoryName - 目录名称
 * @param {string} parentPath - 父目录路径
 * @returns {Promise<Object>} - 创建结果
 */
export const createDirectory = async (directoryName, parentPath = '') => {
    try {
        const response = await apiClient.post('/files/directory', {
            name: directoryName,
            parentPath
        });
        return response;
    } catch (error) {
        console.error('创建目录失败:', error);
        throw error;
    }
};

/**
 * 重命名文件或目录
 * @param {string} itemId - 文件或目录ID
 * @param {string} newName - 新名称
 * @returns {Promise<Object>} - 重命名结果
 */
export const renameItem = async (itemId, newName) => {
    try {
        const response = await apiClient.put(`/files/${itemId}/rename`, {
            newName
        });
        return response;
    } catch (error) {
        console.error('重命名失败:', error);
        throw error;
    }
};    