/**
 * 格式化工具函数集合
 * 包含文件大小、日期、数字等格式化功能
 */

/**
 * 格式化文件大小
 * @param {number} bytes - 文件大小（字节）
 * @returns {string} 格式化后的文件大小字符串
 */
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * 格式化日期
 * @param {Date|string|number} date - 日期对象、时间戳或日期字符串
 * @param {string} formatStr - 格式化字符串，默认为 'yyyy-MM-dd HH:mm:ss'
 * @returns {string} 格式化后的日期字符串
 */
export const formatDate = (date, formatStr = 'yyyy-MM-dd HH:mm:ss') => {
    if (!date) return '';
    
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    // 简单的日期格式化实现，实际项目中可使用date-fns等库
    const formatObj = {
        yyyy: d.getFullYear(),
        MM: String(d.getMonth() + 1).padStart(2, '0'),
        dd: String(d.getDate()).padStart(2, '0'),
        HH: String(d.getHours()).padStart(2, '0'),
        mm: String(d.getMinutes()).padStart(2, '0'),
        ss: String(d.getSeconds()).padStart(2, '0')
    };
    
    return formatStr.replace(/(yyyy|MM|dd|HH|mm|ss)/g, (matched) => formatObj[matched] || matched);
};

/**
 * 格式化数字
 * @param {number} num - 要格式化的数字
 * @param {object} options - 格式化选项
 * @param {number} options.decimals - 小数位数，默认为0
 * @param {string} options.separator - 千位分隔符，默认为','
 * @param {string} options.decimalSeparator - 小数点分隔符，默认为'.'
 * @returns {string} 格式化后的数字字符串
 */
export const formatNumber = (num, options = {}) => {
    const { decimals = 0, separator = ',', decimalSeparator = '.' } = options;
    const numStr = num.toFixed(decimals);
    const [integer, decimal] = numStr.split('.');
    
    return integer.replace(/\B(?=(\d{3})+(?!\d))/g, separator) + 
           (decimal ? decimalSeparator + decimal : '');
};

/**
 * 格式化持续时间（毫秒）为时分秒格式
 * @param {number} ms - 持续时间（毫秒）
 * @returns {string} 格式化后的时间字符串，如 "01:30:45"
 */
export const formatDuration = (ms) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

/**
 * 截断字符串
 * @param {string} str - 要截断的字符串
 * @param {number} length - 最大长度
 * @param {string} suffix - 截断后缀，默认为"..."
 * @returns {string} 截断后的字符串
 */
export const truncateString = (str, length, suffix = '...') => {
    if (!str) return '';
    if (str.length <= length) return str;
    return str.substring(0, length) + suffix;
};    