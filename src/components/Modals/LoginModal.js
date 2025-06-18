import React, { useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    IconButton,
    Divider,
    FormControlLabel,
    Checkbox
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const LoginModal = ({ open, onClose, onLogin, errorMessage }) => {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        borderRadius: 4,
        boxShadow: 24,
        p: 4
    };

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
        onSubmit: (values) => {
            onLogin(values);
        }
    });

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="login-modal"
            aria-describedby="login-description"
        >
            <Box sx={style}>
                <div className="flex justify-between items-center mb-4">
                    <Typography variant="h5" component="h2" className="font-medium">
                        用户登录
                    </Typography>
                    <IconButton onClick={onClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                </div>
                <Divider className="my-4" />
                <form onSubmit={formik.handleSubmit}>
                    <TextField
                        fullWidth
                        id="username"
                        name="username"
                        label="用户名"
                        variant="outlined"
                        margin="normal"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        error={formik.touched.username && Boolean(formik.errors.username)}
                        helperText={formik.touched.username && formik.errors.username}
                    />
                    <TextField
                        fullWidth
                        id="password"
                        name="password"
                        label="密码"
                        type="password"
                        variant="outlined"
                        margin="normal"
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
                    {errorMessage && (
                        <div className="text-red-500 text-sm mt-2 mb-4">
                            {errorMessage}
                        </div>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className="mt-4"
                    >
                        登录
                    </Button>
                </form>
            </Box>
        </Modal>
    );
};

export default LoginModal;    