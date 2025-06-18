import React from 'react';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    Button, 
    Tooltip,
    IconButton,
    Menu,
    MenuItem
} from '@mui/material';
import { 
    Edit as EditIcon, 
    Delete as DeleteIcon, 
    MoreVert as MoreIcon 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const UserTable = ({ users }) => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedUserId, setSelectedUserId] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event, userId) => {
        setAnchorEl(event.currentTarget);
        setSelectedUserId(userId);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        navigate(`/admin/users/${selectedUserId}/edit`);
        handleClose();
    };

    const handleDelete = () => {
        // 执行删除操作
        console.log(`Deleting user ${selectedUserId}`);
        handleClose();
    };

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="用户表格">
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>用户名</TableCell>
                        <TableCell>邮箱</TableCell>
                        <TableCell>角色</TableCell>
                        <TableCell>状态</TableCell>
                        <TableCell>注册时间</TableCell>
                        <TableCell>操作</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user) => (
                        <TableRow
                            key={user.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {user.id}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center">
                                    <img 
                                        src={user.avatar || 'https://picsum.photos/200/200'} 
                                        alt="用户头像" 
                                        className="w-8 h-8 rounded-full mr-3" 
                                    />
                                    {user.username}
                                </div>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                                }`}>
                                    {user.role === 'admin' ? '管理员' : '普通用户'}
                                </span>
                            </TableCell>
                            <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    user.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                    {user.enabled ? '已启用' : '已禁用'}
                                </span>
                            </TableCell>
                            <TableCell>
                                {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                            </TableCell>
                            <TableCell>
                                <IconButton
                                    aria-label="更多操作"
                                    aria-controls={open ? 'user-actions-menu' : undefined}
                                    aria-haspopup="true"
                                    onClick={(e) => handleClick(e, user.id)}
                                >
                                    <MoreIcon />
                                </IconButton>
                                <Menu
                                    id="user-actions-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    MenuListProps={{
                                        'aria-labelledby': 'user-actions-button',
                                    }}
                                >
                                    <MenuItem onClick={handleEdit}>
                                        <EditIcon className="mr-2" /> 编辑
                                    </MenuItem>
                                    <MenuItem onClick={handleDelete}>
                                        <DeleteIcon className="mr-2" /> 删除
                                    </MenuItem>
                                </Menu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default UserTable;    