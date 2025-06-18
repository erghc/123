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
import { register } from '../services/authService';
import PageWrapper from '../components/Layout/PageWrapper';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showSnackbar, setShowSnackbar] = useState(false);

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            agreeTerms: false
        },
        validationSchema: Yup.object({
            username: Yup.string()
                .min(3, '用户名至少需要3个字符')
                .max(20, '用户名最多20个字符')
                .required('用户名不能为空'),
            email: Yup.string()
                .email('请输入有效的电子邮件地址')
                .required('电子邮件不能为空'),
            password: Yup.string()
                .min(6, '密码至少需要6个字符')
                .required('密码不能为空'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], '两次输入的密码不一致')
                .required('请确认密码'),
            agreeTerms: Yup.boolean()
                .oneOf([true], '必须同意服务条款和隐私政策')
        }),
        onSubmit: async (values) => {
            setLoading(true);
            setErrorMessage('');

            try {
                const response = await register(values);
                // 注册成功，重定向到登录页
                navigate('/login');
            } catch (error) {
                setErrorMessage(error.message || '注册失败，请重试');
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
        <PageWrapper title="用户注册">
            <Container maxWidth="xs" className="py-12">
                <Box 
                    className="bg-white rounded-lg shadow-sm p-6"
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '100%' }
                    }}
                >
                    <Typography variant="h4" component="h1" className="font-medium mb-6 text-center">
                        注册
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
                            id="email"
                            name="email"
                            label="电子邮件"
                            variant="outlined"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
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
                        
                        <TextField
                            id="confirmPassword"
                            name="confirmPassword"
                            label="确认密码"
                            type="password"
                            variant="outlined"
                            value={formik.values.confirmPassword}
                            onChange={formik.handleChange}
                            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                        />
                        
                        <FormControlLabel
                            control={
                                <Checkbox
                                    id="agreeTerms"
                                    name="agreeTerms"
                                    color="primary"
                                    checked={formik.values.agreeTerms}
                                    onChange={formik.handleChange}
                                />
                            }
                            label={
                                <span>
                                    我同意 <Link to="/terms">服务条款</Link> 和 <Link to="/privacy">隐私政策</Link>
                                </span>
                            }
                            error={formik.touched.agreeTerms && Boolean(formik.errors.agreeTerms)}
                        />
                        
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className="mt-4"
                            disabled={loading}
                        >
                            {loading ? '注册中...' : '注册'}
                        </Button>
                    </form>
                    
                    <Typography variant="body2" className="text-center mt-4">
                        已有账户？ <Link to="/login">登录</Link>
                    </Typography>
                </Box>
                
                <Snackbar
                    open={showSnackbar}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    message={errorMessage}
                    severity="error"
                />
            </Container>
        </PageWrapper>
    );
};

export default RegisterPage;    