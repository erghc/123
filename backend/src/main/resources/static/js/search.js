/**
 * 搜索功能脚本
 * 包含搜索页面和搜索结果的交互逻辑
 */
document.addEventListener('DOMContentLoaded', function() {
    // 初始化搜索功能
    initSearch();
    
    // 初始化文件详情模态框
    initFileDetailsModal();
    
    // 初始化自动完成
    initAutocomplete();
});

/**
 * 初始化搜索功能
 */
function initSearch() {
    const searchForm = document.querySelector('form[action="/search"]');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const keywordInput = searchForm.querySelector('input[name="keyword"]');
            const keyword = keywordInput.value.trim();
            
            if (keyword) {
                // 记录搜索历史
                saveSearchHistory(keyword);
                
                // 提交搜索
                window.location.href = `/search?keyword=${encodeURIComponent(keyword)}`;
            } else {
                showToast('请输入搜索关键词', 'warning');
            }
        });
    }
    
    // 高亮搜索关键词
    highlightSearchTerms();
}

/**
 * 保存搜索历史
 * @param {string} keyword - 搜索关键词
 */
function saveSearchHistory(keyword) {
    // 从localStorage获取现有搜索历史
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    
    // 检查是否已有相同的搜索
    const index = searchHistory.findIndex(item => item.query === keyword);
    if (index !== -1) {
        // 如果已有，移除旧的记录
        searchHistory.splice(index, 1);
    }
    
    // 添加新的搜索记录到开头
    searchHistory.unshift({
        query: keyword,
        timestamp: new Date().toISOString()
    });
    
    // 限制最多保存10条记录
    if (searchHistory.length > 10) {
        searchHistory = searchHistory.slice(0, 10);
    }
    
    // 保存到localStorage
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

/**
 * 高亮搜索关键词
 */
function highlightSearchTerms() {
    // 从URL获取搜索关键词
    const urlParams = new URLSearchParams(window.location.search);
    const keyword = urlParams.get('keyword');
    
    if (keyword) {
        // 创建正则表达式匹配关键词（忽略大小写）
        const regex = new RegExp(`(${escapeRegExp(keyword)})`, 'gi');
        
        // 在搜索结果中高亮关键词
        document.querySelectorAll('.list-group-item p').forEach(element => {
            if (element.innerHTML.includes(keyword)) {
                element.innerHTML = element.innerHTML.replace(regex, '<span class="highlight">$1</span>');
            }
        });
    }
}

/**
 * 转义正则表达式特殊字符
 * @param {string} text - 要转义的文本
 * @returns {string} - 转义后的文本
 */
function escapeRegExp(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * 初始化文件详情模态框
 */
function initFileDetailsModal() {
    const fileDetailsModal = document.getElementById('fileDetailsModal');
    if (fileDetailsModal) {
        fileDetailsModal.addEventListener('show.bs.modal', function (event) {
            const button = event.relatedTarget;
            const fileId = button.getAttribute('data-file-id');
            
            // 加载文件详情
            loadFileDetails(fileId);
            
            // 更新下载按钮链接
            const downloadBtn = document.getElementById('downloadFileBtn');
            if (downloadBtn) {
                downloadBtn.href = `/file/${fileId}/download`;
            }
        });
    }
}

/**
 * 加载文件详情
 * @param {string} fileId - 文件ID
 */
function loadFileDetails(fileId) {
    const contentContainer = document.getElementById('fileDetailsContent');
    if (!contentContainer) return;
    
    // 显示加载状态
    contentContainer.innerHTML = `
        <div class="text-center py-5">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3">加载文件详情中...</p>
        </div>
    `;
    
    // 获取文件详情
    fetch(`/api/files/${fileId}`)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('获取文件详情失败');
            }
        })
        .then(data => {
            if (data.success && data.file) {
                // 渲染文件详情
                renderFileDetails(data.file);
            } else {
                contentContainer.innerHTML = `
                    <div class="alert alert-danger text-center" role="alert">
                        <i class="fa fa-exclamation-circle mr-2"></i>
                        ${data.message || '无法获取文件详情'}
                    </div>
                `;
            }
        })
        .catch(error => {
            console.error('加载文件详情错误:', error);
            contentContainer.innerHTML = `
                <div class="alert alert-danger text-center" role="alert">
                    <i class="fa fa-exclamation-circle mr-2"></i>
                    加载文件详情失败，请稍后再试
                </div>
            `;
        });
}

/**
 * 渲染文件详情
 * @param {object} file - 文件对象
 */
function renderFileDetails(file) {
    const contentContainer = document.getElementById('fileDetailsContent');
    if (!contentContainer) return;
    
    // 格式化日期和大小
    const lastModified = new Date(file.lastModified).toLocaleString();
    const size = formatFileSize(file.sizeBytes);
    
    // 构建文件详情HTML
    let fileDetailsHtml = `
        <div class="card mb-4">
            <div class="card-header">
                <h5 class="mb-0">
                    <i class="fa ${getFileIconClass(file)} mr-2"></i>
                    ${file.fileName}
                </h5>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6">
                        <dl class="row">
                            <dt class="col-sm-4">文件类型:</dt>
                            <dd class="col-sm-8">${file.isDirectory ? '目录' : file.fileType.toUpperCase()}</dd>
                            
                            <dt class="col-sm-4">文件大小:</dt>
                            <dd class="col-sm-8">${file.isDirectory ? '-' : size}</dd>
                            
                            <dt class="col-sm-4">修改日期:</dt>
                            <dd class="col-sm-8">${lastModified}</dd>
                            
                            <dt class="col-sm-4">文件路径:</dt>
                            <dd class="col-sm-8">${file.fullPath}</dd>
                        </dl>
                    </div>
                    <div class="col-md-6">
                        <div class="d-grid gap-2">
                            <a href="/file/${file.id}/download" class="btn btn-primary" ${file.isDirectory ? 'disabled' : ''}>
                                <i class="fa fa-download"></i> 下载文件
                            </a>
                            <a href="/search?keyword=${encodeURIComponent(file.fullPath)}" class="btn btn-outline-secondary">
                                <i class="fa fa-folder-open"></i> 浏览目录
                            </a>
                            <button class="btn btn-outline-secondary" onclick="copyFileLink('${file.id}')">
                                <i class="fa fa-link"></i> 复制文件链接
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // 添加文件预览部分
    if (file.isDirectory) {
        fileDetailsHtml += `
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0">目录内容</h5>
                </div>
                <div class="card-body">
                    <div class="list-group" id="directoryContents">
                        <div class="text-center py-3">
                            <div class="spinner-border" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                            <p class="mt-2">加载目录内容中...</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else if (file.previewAvailable) {
        fileDetailsHtml += `
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0">文件预览</h5>
                </div>
                <div class="card-body">
                    <div class="preview-container" id="filePreview">
                        <div class="text-center py-3">
                            <div class="spinner-border" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                            <p class="mt-2">加载预览中...</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else {
        fileDetailsHtml += `
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0">文件预览</h5>
                </div>
                <div class="card-body">
                    <div class="alert alert-info text-center" role="alert">
                        <i class="fa fa-info-circle mr-2"></i>
                        无法预览此文件类型。请下载后查看。
                    </div>
                    ${file.contentPreview ? `
                        <div class="mt-4">
                            <h5>文件内容摘要</h5>
                            <p class="text-muted small">${file.contentPreview}</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
    
    // 设置内容
    contentContainer.innerHTML = fileDetailsHtml;
    
    // 如果是目录，加载目录内容
    if (file.isDirectory) {
        loadDirectoryContents(file.id);
    } 
    // 如果可以预览，加载预览内容
    else if (file.previewAvailable) {
        loadFilePreview(file);
    }
}

/**
 * 获取文件图标类
 * @param {object} file - 文件对象
 * @returns {string} - 图标类名
 */
function getFileIconClass(file) {
    if (file.isDirectory) {
        return 'fa-folder text-warning';
    }
    
    switch (file.fileType.toLowerCase()) {
        case 'pdf':
            return 'fa-file-pdf-o text-danger';
        case 'docx':
        case 'doc':
            return 'fa-file-word-o text-primary';
        case 'xlsx':
        case 'xls':
            return 'fa-file-excel-o text-success';
        case 'pptx':
        case 'ppt':
            return 'fa-file-powerpoint-o text-warning';
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
        case 'bmp':
            return 'fa-file-image-o text-info';
        case 'txt':
            return 'fa-file-text-o text-secondary';
        case 'zip':
        case 'rar':
        case '7z':
            return 'fa-file-archive-o text-secondary';
        case 'mp3':
        case 'wav':
        case 'ogg':
            return 'fa-file-audio-o text-secondary';
        case 'mp4':
        case 'avi':
        case 'mov':
            return 'fa-file-video-o text-secondary';
        default:
            return 'fa-file-o text-secondary';
    }
}

/**
 * 加载目录内容
 * @param {string} directoryId - 目录ID
 */
function loadDirectoryContents(directoryId) {
    const container = document.getElementById('directoryContents');
    if (!container) return;
    
    fetch(`/api/files/${directoryId}/contents`)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('获取目录内容失败');
            }
        })
        .then(data => {
            if (data.success && data.contents) {
                renderDirectoryContents(data.contents);
            } else {
                container.innerHTML = `
                    <div class="alert alert-danger text-center" role="alert">
                        <i class="fa fa-exclamation-circle mr-2"></i>
                        ${data.message || '无法获取目录内容'}
                    </div>
                `;
            }
        })
        .catch(error => {
            console.error('加载目录内容错误:', error);
            container.innerHTML = `
                <div class="alert alert-danger text-center" role="alert">
                    <i class="fa fa-exclamation-circle mr-2"></i>
                    加载目录内容失败，请稍后再试
                </div>
            `;
        });
}

/**
 * 渲染目录内容
 * @param {array} contents - 目录内容数组
 */
function renderDirectoryContents(contents) {
    const container = document.getElementById('directoryContents');
    if (!container) return;
    
    if (contents.length === 0) {
        container.innerHTML = `
            <div class="alert alert-info text-center" role="alert">
                <i class="fa fa-info-circle mr-2"></i>
                此目录为空
            </div>
        `;
        return;
    }
    
    let html = '';
    
    // 先添加目录
    contents.filter(item => item.isDirectory).forEach(item => {
        html += `
            <a href="#" class="list-group-item list-group-item-action" onclick="loadFileDetails('${item.id}')">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center">
                        <i class="fa fa-folder text-warning mr-3" style="font-size: 24px;"></i>
                        <span>${item.fileName}</span>
                    </div>
                    <span class="text-muted small">目录</span>
                </div>
            </a>
        `;
    });
    
    // 再添加文件
    contents.filter(item => !item.isDirectory).forEach(item => {
        const size = formatFileSize(item.sizeBytes);
        html += `
            <a href="#" class="list-group-item list-group-item-action" onclick="loadFileDetails('${item.id}')">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center">
                        <i class="fa ${getFileIconClass(item)} mr-3" style="font-size: 24px;"></i>
                        <span>${item.fileName}</span>
                    </div>
                    <span class="text-muted small">${size}</span>
                </div>
            </a>
        `;
    });
    
    container.innerHTML = html;
}

/**
 * 加载文件预览
 * @param {object} file - 文件对象
 */
function loadFilePreview(file) {
    const container = document.getElementById('filePreview');
    if (!container) return;
    
    let previewContent = '';
    
    // 根据文件类型生成不同的预览内容
    switch (file.fileType.toLowerCase()) {
        case 'pdf':
            previewContent = `
                <div class="ratio ratio-16x9">
                    <iframe src="/file/${file.id}/preview" title="PDF预览" frameborder="0"></iframe>
                </div>
            `;
            break;
            
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
        case 'bmp':
            previewContent = `
                <div class="text-center">
                    <img src="/file/${file.id}/preview" alt="${file.fileName}" class="img-fluid rounded" style="max-height: 600px;">
                </div>
            `;
            break;
            
        case 'txt':
        case 'md':
        case 'xml':
        case 'json':
        case 'html':
        case 'css':
        case 'js':
            previewContent = `
                <div class="bg-dark text-white p-3 rounded overflow-auto" style="max-height: 600px;">
                    <pre class="mb-0"><code>${escapeHTML(file.contentPreview)}</code></pre>
                </div>
            `;
            break;
            
        case 'docx':
        case 'xlsx':
        case 'pptx':
            previewContent = `
                <div class="text-center">
                    <p class="text-muted">Microsoft Office文档预览</p>
                    <iframe src="https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(file.previewUrl)}" 
                            width="100%" height="600px" frameborder="0"></iframe>
                </div>
            `;
            break;
            
        default:
            previewContent = `
                <div class="alert alert-info text-center" role="alert">
                    <i class="fa fa-info-circle mr-2"></i>
                    此文件类型的预览功能正在开发中。请下载后查看。
                </div>
            `;
    }
    
    container.innerHTML = previewContent;
}

/**
 * 转义HTML特殊字符
 * @param {string} text - 要转义的文本
 * @returns {string} - 转义后的文本
 */
function escapeHTML(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/**
 * 格式化文件大小
 * @param {number} bytes - 文件大小（字节）
 * @returns {string} - 格式化后的文件大小
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 复制文件链接
 * @param {string} fileId - 文件ID
 */
function copyFileLink(fileId) {
    const link = window.location.origin + `/file/${fileId}`;
    
    navigator.clipboard.writeText(link)
        .then(() => {
            showToast('文件链接已复制到剪贴板', 'success');
        })
        .catch(err => {
            console.error('无法复制链接: ', err);
            showToast('复制失败，请手动复制', 'error');
        });
}

/**
 * 初始化自动完成
 */
function initAutocomplete() {
    const searchInput = document.querySelector('input[name="keyword"]');
    if (!searchInput) return;
    
    // 创建自动完成容器
    const autocompleteContainer = document.createElement('div');
    autocompleteContainer.id = 'autocomplete-container';
    autocompleteContainer.className = 'position-absolute z-100 bg-white border rounded shadow-lg w-100 mt-1 d-none';
    searchInput.parentNode.insertBefore(autocompleteContainer, searchInput.nextSibling);
    
    // 输入事件
    searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        
        if (query.length < 2) {
            autocompleteContainer.classList.add('d-none');
            return;
        }
        
        // 获取建议
        getSearchSuggestions(query)
            .then(suggestions => {
                if (suggestions.length > 0) {
                    renderSuggestions(suggestions, query);
                    autocompleteContainer.classList.remove('d-none');
                } else {
                    autocompleteContainer.classList.add('d-none');
                }
            })
            .catch(error => {
                console.error('获取搜索建议错误:', error);
                autocompleteContainer.classList.add('d-none');
            });
    });
    
    // 失去焦点事件
    searchInput.addEventListener('blur', function() {
        setTimeout(() => {
            autocompleteContainer.classList.add('d-none');
        }, 200);
    });
    
    // 获得焦点事件
    searchInput.addEventListener('focus', function() {
        if (this.value.trim().length >= 2) {
            autocompleteContainer.classList.remove('d-none');
        }
    });
    
    // 点击文档关闭自动完成
    document.addEventListener('click', function(event) {
        if (!searchInput.contains(event.target) && !autocompleteContainer.contains(event.target)) {
            autocompleteContainer.classList.add('d-none');
        }
    });
}

/**
 * 获取搜索建议
 * @param {string} query - 查询词
 * @returns {Promise<Array>} - 搜索建议数组
 */
function getSearchSuggestions(query) {
    return fetch(`/api/suggestions?query=${encodeURIComponent(query)}`)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('获取搜索建议失败');
            }
        })
        .then(data => {
            return data.suggestions || [];
        });
}

/**
 * 渲染搜索建议
 * @param {Array} suggestions - 搜索建议数组
 * @param {string} query - 查询词
 */
function renderSuggestions(suggestions, query) {
    const container = document.getElementById('autocomplete-container');
    if (!container) return;
    
    // 清除现有内容
    container.innerHTML = '';
    
    // 创建正则表达式匹配查询词（忽略大小写）
    const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
    
    // 添加建议项
    suggestions.forEach(suggestion => {
        const item = document.createElement('div');
        item.className = 'p-2 hover:bg-gray-100 cursor-pointer';
        item.innerHTML = suggestion.replace(regex, '<strong>$1</strong>');
        
        // 点击建议项
        item.addEventListener('click', function() {
            const searchInput = document.querySelector('input[name="keyword"]');
            if (searchInput) {
                searchInput.value = suggestion;
                document.querySelector('form[action="/search"]').submit();
            }
            container.classList.add('d-none');
        });
        
        container.appendChild(item);
    });
}    