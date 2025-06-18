import apiClient from './apiClient';

/**
 * 搜索文件
 * @param {string} keyword - 搜索关键词
 * @param {number} page - 页码
 * @param {number} size - 每页数量
 * @param {string} sort - 排序字段
 * @param {string} order - 排序顺序
 * @param {string} path - 路径筛选
 * @param {string} fileType - 文件类型筛选
 * @returns {Promise<Object>} - 搜索结果
 */
export const searchFiles = async (keyword, page = 0, size = 10, sort = 'lastModified', order = 'desc', path = '', fileType = '') => {
    try {
        const response = await apiClient.get('/search', {
            params: {
                keyword,
                page,
                size,
                sort,
                order,
                path,
                fileType
            }
        });
        return response;
    } catch (error) {
        console.error('搜索文件失败:', error);
        throw error;
    }
};

/**
 * 获取搜索建议
 * @param {string} keyword - 搜索关键词
 * @returns {Promise<Array>} - 搜索建议列表
 */
export const getSearchSuggestions = async (keyword) => {
    try {
        const response = await apiClient.get('/search/suggestions', {
            params: {
                keyword
            }
        });
        return response.suggestions;
    } catch (error) {
        console.error('获取搜索建议失败:', error);
        throw error;
    }
};

/**
 * 获取热门搜索
 * @returns {Promise<Array>} - 热门搜索列表
 */
export const getPopularSearches = async () => {
    try {
        const response = await apiClient.get('/search/popular');
        return response;
    } catch (error) {
        console.error('获取热门搜索失败:', error);
        throw error;
    }
};

/**
 * 获取搜索统计
 * @returns {Promise<Object>} - 搜索统计信息
 */
export const getSearchStats = async () => {
    try {
        const response = await apiClient.get('/search/stats');
        return response;
    } catch (error) {
        console.error('获取搜索统计失败:', error);
        throw error;
    }
};    