import React, { useEffect, useState } from 'react';
import { 
    Container, 
    Card, 
    CardHeader, 
    CardContent, 
    Button, 
    TextField, 
    Toolbar, 
    Typography, 
    InputAdornment,
    IconButton,
    Pagination,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import { Search as SearchIcon, FilterList as FilterIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { fetchFiles, deleteFile } from '../../services/adminService';
import FileList from '../../components/FileList/FileList';
import MainLayout from '../../components/Layout/MainLayout';
import PageWrapper from '../../components/Layout/PageWrapper';
import DeleteConfirmationModal from '../../components/Modals/DeleteConfirmationModal';

const ManageFilesPage = () => {
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [fileTypeFilter, setFileTypeFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [filesPerPage] = useState(10);
    const [selectedFileId, setSelectedFileId] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadFiles = async () => {
            try {
                const response = await fetchFiles(searchTerm, fileTypeFilter, currentPage, filesPerPage);
                setFiles(response.data);
            } catch (error) {
                console.error('Error fetching files:', error);
            } finally {
                setLoading(false);
            }
        };

        loadFiles();
    }, [searchTerm, fileTypeFilter, currentPage, filesPerPage]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // 重置到第一页
    };

    const handleFileTypeChange = (e) => {
        setFileTypeFilter(e.target.value);
        setCurrentPage(1); // 重置到第一页
    };

    const handleDeleteFile = (fileId) => {
        setSelectedFileId(fileId);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteFile(selectedFileId);
            setFiles(files.filter(file => file.id !== selectedFileId));
            setDeleteModalOpen(false);
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    };

    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false);
    };

    // 计算当前页的文件
    const indexOfLastFile = currentPage * filesPerPage;
    const indexOfFirstFile = indexOfLastFile - filesPerPage;
    const currentFiles = files.slice(indexOfFirstFile, indexOfLastFile);

    // 计算总页数
    const totalPages = Math.ceil(files.length / filesPerPage);

    return (
        <MainLayout>
            <PageWrapper title="文件管理" breadcrumbs={[{ label: '管理' }]}>
                <Container maxWidth="xl">
                    <Card>
                        <CardHeader title="文件列表" />
                        <CardContent>
                            <Toolbar>
                                <TextField
                                    variant="outlined"
                                    size="small"
                                    placeholder="搜索文件..."
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
                                
                                <FormControl variant="outlined" size="small" className="mr-4">
                                    <InputLabel id="file-type-filter-label">文件类型</InputLabel>
                                    <Select
                                        labelId="file-type-filter-label"
                                        id="file-type-filter"
                                        value={fileTypeFilter}
                                        label="文件类型"
                                        onChange={handleFileTypeChange}
                                    >
                                        <MenuItem value="all">全部</MenuItem>
                                        <MenuItem value="pdf">PDF</MenuItem>
                                        <MenuItem value="doc">文档</MenuItem>
                                        <MenuItem value="image">图片</MenuItem>
                                        <MenuItem value="video">视频</MenuItem>
                                        <MenuItem value="audio">音频</MenuItem>
                                        <MenuItem value="archive">压缩文件</MenuItem>
                                    </Select>
                                </FormControl>
                                
                                <Button variant="contained" color="primary">
                                    <IconButton color="inherit" component="span">
                                        <FilterIcon />
                                    </IconButton>
                                    筛选
                                </Button>
                            </Toolbar>

                            <FileList
                                files={currentFiles}
                                isLoading={loading}
                                onFileClick={(file) => navigate(`/files/${file.id}`)}
                                onDirectoryClick={(dir) => console.log('Navigate to directory:', dir)}
                                onFileDelete={handleDeleteFile}
                                showActions
                            />

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
                    item={{ name: files.find(f => f.id === selectedFileId)?.fileName || '文件' }}
                />
            </PageWrapper>
        </MainLayout>
    );
};

export default ManageFilesPage;    