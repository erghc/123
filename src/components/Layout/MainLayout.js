import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Drawer } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from '../Navigation/Sidebar';
import { useNavigate } from 'react-router-dom';

const MainLayout = ({ children }) => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const navigate = useNavigate();

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <AppBar position="fixed" className="bg-white shadow-sm border-b border-gray-200">
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={handleDrawerToggle}
                        className="mr-2"
                    >
                        <MenuIcon className="text-gray-600" />
                    </IconButton>
                    <Typography variant="h6" className="text-gray-800 font-medium">
                        FTP搜索系统
                    </Typography>
                </Toolbar>
            </AppBar>

            <Sidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} onNavigate={handleNavigate} />

            <main className="flex-grow pt-16 pl-0 md:pl-64 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {children}
                </div>
            </main>

            <footer className="bg-gray-50 border-t border-gray-200 py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-sm text-gray-500">© 2023 FTP搜索系统 - 版权所有</p>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;    