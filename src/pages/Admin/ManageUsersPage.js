import React, { useEffect, useState } from 'react';
import { 
    Container, 
    Card, 
    CardHeader, 
    CardContent, 
    TableContainer, 
    Table, 
    TableHead, 
    TableBody, 
    TableRow, 
    TableCell, 
    Paper, 
    Button, 
    TextField, 
    Toolbar, 
    Typography, 
    InputAdornment,
    IconButton,
    Pagination
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { fetchUsers, deleteUser } from '../../services/adminService';
import MainLayout from '../../components/Layout/MainLayout';
import PageWrapper from '../../components/Layout/PageWrapper';
import DeleteConfirmationModal from '../../components/Modals/DeleteConfirmationModal';

const ManageUsersPage = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const response = await fetchUsers(searchTerm, currentPage, usersPerPage);
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        loadUsers();
    }, [searchTerm, currentPage, usersPerPage]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // 重置到第一页
    };

    const handleEditUser = (userId) => {
        navigate(`/admin/users/${userId}/edit`);
    };

    const handleDeleteUser = (userId) => {
        setSelectedUserId(userId);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteUser(selectedUserId);
            setUsers(users.filter(user => user.id !== selectedUserId));
            setDeleteModalOpen(false);
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false);
    };

    // 计算当前页的用户
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    // 计算总页数
    const totalPages = Math.ceil(users.length / usersPerPage);

    return (
        <MainLayout>
            <PageWrapper title="用户管理" breadcrumbs={[{ label: '管理' }]}>
                <Container maxWidth="xl">
                    <Card>
                        <CardHeader title="用户列表" />
                        <CardContent>
                            <Toolbar>
                                <TextField
                                    variant="outlined"
                                    size="small"
                                    placeholder="搜索用户..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        )
                                    }}
                                    className="flex-grow mr-4"
                                />
                                <Button variant="contained" color="primary" onClick={() => navigate('/admin/users/create')}>
                                    添加用户
                                </Button>
                            </Toolbar>

                            <TableContainer component={Paper}>
                                <Table aria-label="用户表格">
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
                                        {currentUsers.map((user) => (
                                            <TableRow key={user.id} hover>
                                                <TableCell>{user.id}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center">
                                                        <img 
                                                            src={user.avatar || 'https://picsum.photos/200/200'} 
                                                            alt="用户头像" 
                                                            className="w-8 h-8 rounded-full mr-2" 
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
                                                <TableCell>{new Date(user.createdAt).toLocaleString()}</TableCell>
                                                <TableCell>
                                                    <Button 
                                                        size="small" 
                                                        color="primary" 
                                                        onClick={() => handleEditUser(user.id)}
                                                    >
                                                        编辑
                                                    </Button>
                                                    <Button 
                                                        size="small" 
                                                        color="error" 
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        className="ml-2"
                                                    >
                                                        删除
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <div className="mt-4 flex justify-center">
                                <Pagination
                                    count={totalPages}
                                    page={currentPage}
                                    onChange={(event, value) => setCurrentPage(value)}
                                    variant="outlined"
                                    shape="rounded"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </Container>

                <DeleteConfirmationModal
                    open={deleteModalOpen}
                    onClose={handleCloseDeleteModal}
                    onConfirm={handleConfirmDelete}
                    item={{ name: users.find(u => u.id === selectedUserId)?.username || '用户' }}
                />
            </PageWrapper>
        </MainLayout>
    );
};

export default ManageUsersPage;    