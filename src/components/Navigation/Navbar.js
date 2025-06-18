import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onToggleSidebar }) => {
    const navigate = useNavigate();

    return (
        <AppBar position="fixed" color="primary">
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                    onClick={onToggleSidebar}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    FTP搜索系统
                </Typography>
                <Button color="inherit" onClick={() => navigate('/upload')}>
                    上传文件
                </Button>
                <Button color="inherit" onClick={() => navigate('/settings')}>
                    设置
                </Button>
                <Button color="inherit" onClick={() => navigate('/logout')}>
                    退出
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;    