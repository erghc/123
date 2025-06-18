import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
    Container, 
    Typography, 
    Box, 
    TextField, 
    Button, 
    FormControlLabel, 
    Checkbox, 
    Snackbar 
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { login } from '../services/authService';
import PageWrapper from '../components/Layout/PageWrapper';

const LoginPage = () => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showSnackbar, setShowSnackbar] = useState(false);

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
            rememberMe: false
        },
        validationSchema: Yup.object({
            username: Yup.string().required('用户名不能为空'),
            password: Yup.string().required('密码不能为空')
        }),
        onSubmit: async (values) => {
            setLoading(true);
            setErrorMessage('');

            try {
                const response = await login(values.username, values.password, values.rememberMe);
                // 登录成功，重定向到主页或之前的页面
                navigate('/');
            } catch (error) {
                setErrorMessage(error.message || '登录失败，请检查用户名和密码');
                setShowSnackbar(true);
            } finally {
                setLoading(false);
            }
        }
    });

    const handleCloseSnackbar = () => {
        setShowSnackbar(false);
    };

    return (
        <PageWrapper title="用户登录">
            <Container maxWidth="xs" className="py-12">
                <Box 
                    className="bg-white rounded-lg shadow-sm p-6"
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '100%' }
                    }}
                >
                    <Typography variant="h4" component="h1" className="font-medium mb-6 text-center">
                        登录
                    </Typography>
                    
                    <form onSubmit={formik.handleSubmit}>
                        <TextField
                            id="username"
                            name="username"
                            label="用户名"
                            variant="outlined"
                            value={formik.values.username}
                            onChange={formik.handleChange}
                            error={formik.touched.username && Boolean(formik.errors.username)}
                            helperText={formik.touched.username && formik.errors.username}
                        />
                        
                        <TextField
                            id="password"
                            name="password"
                            label="密码"
                            type="password"
                            variant="outlined"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                        />
                        
                        <FormControlLabel
                            control={
                                <Checkbox
                                    id="rememberMe"
                                    name="rememberMe"
                                    color="primary"
                                    checked={formik.values.rememberMe}
                                    onChange={formik.handleChange}
                                />
                            }
                            label="记住我"
                        />
                        
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className="mt-4"
                            disabled={loading}
                        >
                            {loading ? '登录中...' : '登录'}
                        </Button>
                    </form>
                    
                    <Box className="mt-6 text-center">
                        <Link to="/register" className="text-primary hover:underline">
                            还没有账号？注册
                        </Link>
                    </Box>
                </Box>
            </Container>
            
            <Snackbar
                open={showSnackbar}
                autoHideDuration={5000}
                onClose={handleCloseSnackbar}
                message={errorMessage}
                severity="error"
            />
        </PageWrapper>
    );
};

export default LoginPage;    