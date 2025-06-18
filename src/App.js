import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useDispatch, useSelector } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { SnackbarProvider } from 'notistack';

// 导入布局和页面组件
import MainLayout from './components/Layout/MainLayout';
import HomePage from './pages/HomePage';
import SearchResultsPage from './pages/SearchResultsPage';
import FileDetailsPage from './pages/FileDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PrivateRoute from './components/Common/PrivateRoute';
import { fetchUser } from './store/actions/authActions';

// 导入状态管理相关
import store from './store/store';
import { THEMES } from './utils/constants';

// 导入服务
import { checkTokenValidity } from './services/authService';

// 导入管理页面
import AdminDashboardPage from './pages/Admin/AdminDashboardPage';
import ManageUsersPage from './pages/Admin/ManageUsersPage';
import ManageFilesPage from './pages/Admin/ManageFilesPage';

// 创建持久化存储
const persistor = persistStore(store);

const App = () => {
    const dispatch = useDispatch();
    const { theme } = useSelector(state => state.preferences);
    const { isAuthenticated } = useSelector(state => state.auth);
    const [loading, setLoading] = useState(true);

    // 初始化主题
    const appTheme = createTheme({
        palette: {
            mode: theme === THEMES.DARK ? 'dark' : 'light',
            primary: {
                main: '#165DFF'
            },
            secondary: {
                main: '#0FC6C2'
            }
        },
        typography: {
            fontFamily: [
                'Inter',
                'sans-serif'
            ].join(',')
        }
    });

    // 检查用户认证状态
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const isValid = await checkTokenValidity();
                if (isValid) {
                    dispatch(fetchUser());
                }
            } catch (error) {
                console.error('Error checking token validity:', error);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [dispatch]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">加载中...</div>;
    }

    return (
        <ThemeProvider theme={appTheme}>
            <CssBaseline />
            <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
                <Router>
                    <PersistGate loading={null} persistor={persistor}>
                        <Routes>
                            <Route path="/" element={<MainLayout />}>
                                <Route index element={<HomePage />} />
                                <Route path="search" element={<SearchResultsPage />} />
                                <Route path="files/:id" element={<FileDetailsPage />} />
                                
                                {/* 管理路由 */}
                                <Route 
                                    path="admin/dashboard" 
                                    element={
                                        <PrivateRoute roles={['admin']}>
                                            <AdminDashboardPage />
                                        </PrivateRoute>
                                    } 
                                />
                                <Route 
                                    path="admin/users" 
                                    element={
                                        <PrivateRoute roles={['admin']}>
                                            <ManageUsersPage />
                                        </PrivateRoute>
                                    } 
                                />
                                <Route 
                                    path="admin/files" 
                                    element={
                                        <PrivateRoute roles={['admin']}>
                                            <ManageFilesPage />
                                        </PrivateRoute>
                                    } 
                                />
                            </Route>
                            
                            {/* 公开路由 */}
                            <Route 
                                path="login" 
                                element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} 
                            />
                            <Route 
                                path="register" 
                                element={isAuthenticated ? <Navigate to="/" /> : <RegisterPage />} 
                            />
                            
                            {/* 404页面 */}
                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                    </PersistGate>
                </Router>
            </SnackbarProvider>
        </ThemeProvider>
    );
};

export default App;    