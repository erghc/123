import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import FolderIcon from '@mui/icons-material/Folder';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';

const Sidebar = ({ open, onClose, onNavigate }) => {
    const menuItems = [
        { text: '主页', icon: <HomeIcon />, path: '/' },
        { text: '搜索', icon: <SearchIcon />, path: '/search' },
        { text: '文件管理', icon: <FolderIcon />, path: '/files' },
        { text: '搜索历史', icon: <HistoryIcon />, path: '/history' },
        { text: '设置', icon: <SettingsIcon />, path: '/settings' }
    ];

    return (
        <Drawer open={open} onClose={onClose}>
            <List>
                {menuItems.map((item) => (
                    <ListItem button key={item.text} onClick={() => {
                        onNavigate(item.path);
                        onClose();
                    }}>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
};

export default Sidebar;    