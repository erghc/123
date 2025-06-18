/**
 * 主应用脚本
 * 包含全局功能和初始化逻辑
 */
document.addEventListener('DOMContentLoaded', function() {
    // 初始化导航栏交互
    initNavbar();
    
    // 初始化主题切换
    initThemeToggle();
    
    // 初始化通知提示
    initToasts();
    
    // 初始化登录表单
    initLoginForm();
});

/**
 * 初始化导航栏交互
 */
function initNavbar() {
    // 移动端导航栏切换
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    navbarToggler.addEventListener('click', function() {
        navbarCollapse.classList.toggle('show');
    });
    
    // 导航链接点击时关闭移动端菜单
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth < 992) {
                navbarCollapse.classList.remove('show');
            }
        });
    });
}

/**
 * 初始化主题切换功能
 */
function initThemeToggle() {
    // 检查用户偏好的主题
    const savedTheme = localStorage.getItem('theme') || 
                      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    // 应用保存的主题
    applyTheme(savedTheme);
    
    // 创建主题切换按钮
    const themeToggleBtn = document.createElement('button');
    themeToggleBtn.className = 'btn btn-outline-secondary ms-2';
    themeToggleBtn.innerHTML = '<i class="fa fa-moon-o"></i>';
    themeToggleBtn.id = 'themeToggleBtn';
    themeToggleBtn.title = '切换主题';
    
    // 将按钮添加到导航栏
    const navbarRight = document.querySelector('.navbar-nav.ms-auto');
    if (navbarRight) {
        navbarRight.parentNode.insertBefore(themeToggleBtn, navbarRight.nextSibling);
        
        // 主题切换事件
        themeToggleBtn.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
}

/**
 * 应用指定主题
 * @param {string} theme - 主题名称 ('light' 或 'dark')
 */
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    // 更新主题切换按钮图标
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
        themeToggleBtn.innerHTML = theme === 'light' ? 
            '<i class="fa fa-moon-o"></i>' : 
            '<i class="fa fa-sun-o"></i>';
    }
    
    // 加载相应的主题样式
    const themeLink = document.getElementById('themeStylesheet');
    if (themeLink) {
        themeLink.href = `/css/themes/${theme}.css`;
    } else {
        const link = document.createElement('link');
        link.id = 'themeStylesheet';
        link.rel = 'stylesheet';
        link.href = `/css/themes/${theme}.css`;
        document.head.appendChild(link);
    }
}

/**
 * 初始化通知提示
 */
function initToasts() {
    // 创建toast容器
    const toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    document.body.appendChild(toastContainer);
}

/**
 * 显示通知提示
 * @param {string} message - 提示消息
 * @param {string} type - 提示类型 ('success', 'error', 'info', 'warning')
 * @param {number} duration - 显示时长 (毫秒)
 */
function showToast(message, type = 'success', duration = 3000) {
    const toastContainer = document.getElementById('toastContainer');
    
    // 创建toast元素
    const toast = document.createElement('div');
    toast.className = `toast bg-${type} text-white border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    // 设置toast内容
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    
    // 添加到容器
    toastContainer.appendChild(toast);
    
    // 初始化toast
    const bsToast = new bootstrap.Toast(toast, {
        animation: true,
        autohide: true,
        delay: duration
    });
    
    // 显示toast
    bsToast.show();
    
    // 自动移除
    setTimeout(() => {
        toast.remove();
    }, duration + 300);
}

/**
 * 初始化登录表单
 */
function initLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
    
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn && !loginBtn.hasAttribute('listener-attached')) {
        loginBtn.setAttribute('listener-attached', 'true');
        loginBtn.addEventListener('click', handleLogin);
    }
}

/**
 * 处理登录请求
 */
function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // 简单验证
    if (!username || !password) {
        showToast('请输入用户名和密码', 'error');
        return;
    }
    
    // 准备登录数据
    const loginData = {
        username: username,
        password: password,
        rememberMe: rememberMe
    };
    
    // 发送登录请求
    fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('登录失败');
        }
    })
    .then(data => {
        if (data.success) {
            showToast('登录成功', 'success');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            showToast(data.message || '登录失败', 'error');
        }
    })
    .catch(error => {
        console.error('登录错误:', error);
        showToast('登录请求失败，请稍后再试', 'error');
    });
}

/**
 * 处理登出
 */
function logout() {
    if (confirm('确定要退出登录吗？')) {
        fetch('/api/auth/logout', {
            method: 'POST'
        })
        .then(response => {
            if (response.ok) {
                showToast('已成功登出', 'success');
                setTimeout(() => {
                    window.location.href = '/';
                }, 1000);
            } else {
                throw new Error('登出失败');
            }
        })
        .catch(error => {
            console.error('登出错误:', error);
            showToast('登出失败，请稍后再试', 'error');
        });
    }
}    