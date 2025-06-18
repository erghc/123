import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, Divider, Tabs, Tab, Snackbar } from '@mui/material';
import { getFileDetails, downloadFile } from '../services/fileService';
import { useSelector } from 'react-redux';
import { FileTypeIcon } from '../components/Common/FileTypeIcon';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FileSizeFormatter } from '../utils/FileSizeFormatter';
import { format } from 'date-fns';
import PageWrapper from '../components/Layout/PageWrapper';
import DeleteConfirmationModal from '../components/Modals/DeleteConfirmationModal';

const FileDetailsPage = () => {
    const { fileId } = useParams();
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tabValue, setTabValue] = useState(0);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const user = useSelector(state => state.auth.user);

    useEffect(() => {
        const fetchFileDetails = async () => {
            try {
                const response = await getFileDetails(fileId);
                setFile(response.data);
            } catch (error) {
                setError(error.message || '获取文件详情失败');
                console.error('Error fetching file details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFileDetails();
    }, [fileId]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleDownload = async () => {
        try {
            await downloadFile(fileId);
        } catch (error) {
            console.error('Error downloading file:', error);
            setError('下载文件失败');
        }
    };

    const handleDelete = () => {
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            // 执行删除操作
            console.log('Deleting file:', fileId);
            // 实际项目中调用删除API
            navigate('/');
        } catch (error) {
            console.error('Error deleting file:', error);
            setError('删除文件失败');
        } finally {
            setDeleteModalOpen(false);
        }
    };

    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false);
    };

    const handleCopyLink = () => {
        setCopySuccess(true);
    };

    const handleCloseSnackbar = () => {
        setCopySuccess(false);
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">加载中...</div>;
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
                <Button variant="contained" onClick={() => navigate(-1)} className="mt-4">
                    返回
                </Button>
            </div>
        );
    }

    if (!file) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <Typography variant="h6">文件不存在</Typography>
                <Button variant="contained" onClick={() => navigate(-1)} className="mt-4">
                    返回
                </Button>
            </div>
        );
    }

    return (
        <PageWrapper 
            title={file.fileName || file.name} 
            breadcrumbs={[{ label: '文件' }, { label: file.fileName || file.name }]}
        >
            <Container maxWidth="lg" className="py-6">
                <Box className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-start">
                        <FileTypeIcon file={file} size={64} className="mr-4" />
                        <div className="flex-grow">
                            <Typography variant="h4" component="h1" className="font-medium">
                                {file.fileName || file.name}
                            </Typography>
                            <div className="flex items-center mt-2 text-sm text-gray-500">
                                <span className="flex items-center mr-4">
                                    <i className="fa fa-folder-o mr-1" />
                                    {file.filePath || '/'}
                                </span>
                                <span className="flex items-center mr-4">
                                    <i className="fa fa-calendar mr-1" />
                                    {format(new Date(file.lastModified), 'yyyy-MM-dd HH:mm:ss')}
                                </span>
                                <span className="flex items-center">
                                    <i className="fa fa-user mr-1" />
                                    {file.owner || '未知'}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            {file.isDirectory ? (
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    className="mb-2"
                                    onClick={() => navigate(`/browse${file.filePath || ''}${file.fileName || file.name}`)}
                                >
                                    <i className="fa fa-folder-open-o mr-1" /> 浏览
                                </Button>
                            ) : (
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    className="mb-2"
                                    onClick={handleDownload}
                                >
                                    <i className="fa fa-download mr-1" /> 下载
                                </Button>
                            )}
                            <CopyToClipboard text={window.location.href} onCopy={handleCopyLink}>
                                <Button variant="outlined" className="text-sm">
                                    <i className="fa fa-link mr-1" /> 复制链接
                                </Button>
                            </CopyToClipboard>
                        </div>
                    </div>

                    <Divider className="my-6" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Typography variant="h6" component="h3" className="font-medium mb-3">
                                基本信息
                            </Typography>
                            <div className="space-y-3">
                                <div className="flex">
                                    <span className="text-gray-500 w-24">文件类型:</span>
                                    <span>{file.isDirectory ? '目录' : file.fileType || '未知'}</span>
                                </div>
                                <div className="flex">
                                    <span className="text-gray-500 w-24">文件大小:</span>
                                    <span>{file.isDirectory ? '-' : FileSizeFormatter.format(file.fileSize)}</span>
                                </div>
                                <div className="flex">
                                    <span className="text-gray-500 w-24">文件路径:</span>
                                    <span className="truncate">{file.filePath || '/'}</span>
                                </div>
                                <div className="flex">
                                    <span className="text-gray-500 w-24">最后修改:</span>
                                    <span>{format(new Date(file.lastModified), 'yyyy-MM-dd HH:mm:ss')}</span>
                                </div>
                                <div className="flex">
                                    <span className="text-gray-500 w-24">访问权限:</span>
                                    <span>{file.permissions || '读取/写入'}</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <Typography variant="h6" component="h3" className="font-medium mb-3">
                                操作
                            </Typography>
                            <div className="space-y-3">
                                <Button 
                                    variant="outlined" 
                                    fullWidth 
                                    onClick={() => console.log('Rename file')}
                                >
                                    <i className="fa fa-pencil mr-1" /> 重命名
                                </Button>
                                <Button 
                                    variant="outlined" 
                                    fullWidth 
                                    onClick={() => console.log('Move file')}
                                >
                                    <i className="fa fa-cut mr-1" /> 移动
                                </Button>
                                <Button 
                                    variant="outlined" 
                                    fullWidth 
                                    onClick={() => console.log('Copy file')}
                                >
                                    <i className="fa fa-copy mr-1" /> 复制
                                </Button>
                                <Button 
                                    variant="outlined" 
                                    fullWidth 
                                    onClick={() => console.log('Share file')}
                                >
                                    <i className="fa fa-share-alt mr-1" /> 分享
                                </Button>
                                <Button 
                                    variant="outlined" 
                                    color="error" 
                                    fullWidth 
                                    onClick={handleDelete}
                                >
                                    <i className="fa fa-trash mr-1" /> 删除
                                </Button>
                            </div>
                        </div>
                    </div>
                </Box>

                <Box className="bg-white rounded-lg shadow-sm p-6">
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="文件详情标签页">
                        <Tab label="内容预览" />
                        <Tab label="历史版本" />
                        <Tab label="分享设置" />
                    </Tabs>

                    <Divider className="my-4" />

                    {tabValue === 0 && (
                        <div>
                            {file.isDirectory ? (
                                <Typography variant="body1" className="text-gray-600">
                                    这是一个目录，包含 {file.childrenCount || 0} 个文件/文件夹。
                                </Typography>
                            ) : (
                                <div>
                                    {file.previewAvailable ? (
                                        <div className="border rounded p-4 min-h-[300px]">
                                            {/* 这里可以根据文件类型显示不同的预览 */}
                                            {file.fileType === 'PDF' ? (
                                                <iframe 
                                                    src={`/api/files/${file.id}/preview`} 
                                                    width="100%" 
                                                    height="500px" 
                                                    title="PDF预览"
                                                ></iframe>
                                            ) : file.fileType === 'IMAGE' ? (
                                                <img 
                                                    src={`/api/files/${file.id}/preview`} 
                                                    alt="文件预览" 
                                                    className="max-w-full max-h-[500px]"
                                                />
                                            ) : file.fileType === 'TEXT' ? (
                                                <pre className="font-mono text-sm p-4 bg-gray-50 rounded overflow-x-auto">
                                                    {file.content || '无预览内容'}
                                                </pre>
                                            ) : (
                                                <Typography variant="body1" className="text-gray-600">
                                                    预览类型: {file.previewType || '未知'}
                                                </Typography>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-12">
                                            <i className="fa fa-file-o text-4xl text-gray-300 mb-4" />
                                            <Typography variant="body1" className="text-gray-500">
                                                无法预览此文件类型
                                            </Typography>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {tabValue === 1 && (
                        <div className="min-h-[300px]">
                            <Typography variant="body1" className="text-gray-600">
                                暂无历史版本
                            </Typography>
                        </div>
                    )}

                    {tabValue === 2 && (
                        <div className="min-h-[300px]">
                            <Typography variant="body1" className="text-gray-600">
                                分享设置
                            </Typography>
                        </div>
                    )}
                </Box>
            </Container>

            <DeleteConfirmationModal
                open={deleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={confirmDelete}
                file={file}
            />

            <Snackbar
                open={copySuccess}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                message="链接已复制到剪贴板"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            />
        </PageWrapper>
    );
};

export default FileDetailsPage;    