/**
 * 文件操作脚本
 * 包含文件下载、预览等操作的逻辑
 */
document.addEventListener('DOMContentLoaded', function() {
    // 初始化文件下载功能
    initFileDownloads();
    
    // 初始化文件预览功能
    initFilePreviews();
    
    // 初始化复制文件链接功能
    initCopyFileLinks();
});

/**
 * 初始化文件下载功能
 */
function initFileDownloads() {
    // 为所有下载按钮添加事件监听器
    document.querySelectorAll('a[href*="/download"]').forEach(link => {
        link.addEventListener('click', function(e) {
            // 如果是目录，阻止下载
            if (this.getAttribute('data-is-directory') === 'true') {
                e.preventDefault();
                showToast('无法下载目录，请下载目录中的具体文件', 'warning');
            } else {
                // 记录下载开始时间
                const start = performance.now();
                
                // 显示下载提示
                showToast('开始下载文件...', 'info');
                
                // 下载完成后计算并显示下载时间
                setTimeout(() => {
                    const end = performance.now();
                    const duration = Math.round((end - start) / 1000);
                    if (duration > 1) {
                        showToast(`文件下载完成，耗时 ${duration} 秒`, 'success');
                    }
                }, 1000);
            }
        });
    });
}

/**
 * 初始化文件预览功能
 */
function initFilePreviews() {
    // 为所有预览按钮添加事件监听器
    document.querySelectorAll('button[data-bs-target="#fileDetailsModal"]').forEach(button => {
        button.addEventListener('click', function() {
            const fileId = this.getAttribute('data-file-id');
            if (fileId) {
                // 显示加载中提示
                showToast('正在加载文件详情...', 'info');
                
                // 在模态框中加载文件详情
                loadFileDetails(fileId);
            }
        });
    });
}

/**
 * 初始化复制文件链接功能
 */
function initCopyFileLinks() {
    // 为所有复制链接按钮添加事件监听器
    document.querySelectorAll('#copyLinkBtn, button[onclick*="copyFileLink"]').forEach(button => {
        button.addEventListener('click', function() {
            let fileId;
            
            // 从按钮的onclick属性中提取fileId
            if (this.hasAttribute('onclick')) {
                const onclick = this.getAttribute('onclick');
                const match = onclick.match(/copyFileLink\('([^']+)'\)/);
                if (match && match[1]) {
                    fileId = match[1];
                }
            }
            
            // 如果没有找到fileId，尝试从父元素获取
            if (!fileId) {
                const fileItem = this.closest('[data-file-id]');
                if (fileItem) {
                    fileId = fileItem.getAttribute('data-file-id');
                }
            }
            
            if (fileId) {
                const link = window.location.origin + `/file/${fileId}`;
                
                // 复制链接到剪贴板
                navigator.clipboard.writeText(link)
                    .then(() => {
                        showToast('文件链接已复制到剪贴板', 'success');
                    })
                    .catch(err => {
                        console.error('无法复制链接: ', err);
                        showToast('复制失败，请手动复制', 'error');
                    });
            } else {
                showToast('无法获取文件链接', 'error');
            }
        });
    });
}

/**
 * 下载文件
 * @param {string} fileId - 文件ID
 * @param {string} fileName - 文件名（可选）
 */
function downloadFile(fileId, fileName = null) {
    const downloadUrl = `/file/${fileId}/download`;
    
    // 创建临时链接
    const link = document.createElement('a');
    link.href = downloadUrl;
    
    // 如果提供了文件名，设置download属性
    if (fileName) {
        link.download = fileName;
    }
    
    // 将链接添加到文档中并点击
    document.body.appendChild(link);
    link.click();
    
    // 移除临时链接
    document.body.removeChild(link);
}

/**
 * 预览文件
 * @param {string} fileId - 文件ID
 */
function previewFile(fileId) {
    const previewUrl = `/file/${fileId}/preview`