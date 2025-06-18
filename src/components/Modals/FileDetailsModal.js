import React from 'react';
import {
    Modal,
    Box,
    Typography,
    Divider,
    List,
    ListItem,
    ListItemText,
    Button,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FileSizeFormatter from '../../utils/FileSizeFormatter';

const FileDetailsModal = ({ file, open, onClose, onDownload, onDelete }) => {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        bgcolor: 'background.paper',
        borderRadius: 4,
        boxShadow: 24,
        p: 4,
        maxHeight: '90vh',
        overflowY: 'auto'
    };

    if (!file) return null;

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="file-details-modal"
            aria-describedby="file-details-description"
        >
            <Box sx={style}>
                <div className="flex justify-between items-center mb-4">
                    <Typography variant="h5" component="h2" className="font-medium">
                        文件详情
                    </Typography>
                    <IconButton onClick={onClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                </div>
                <Divider className="my-4" />
                <List>
                    <ListItem>
                        <ListItemText
                            primary="文件名"
                            secondary={file.fileName || file.name}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="文件路径"
                            secondary={file.filePath || '/'}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="文件大小"
                            secondary={file.isDirectory ? '目录' : FileSizeFormatter.format(file.fileSize)}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="最后修改时间"
                            secondary={new Date(file.lastModified).toLocaleString()}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="文件类型"
                            secondary={file.isDirectory ? '目录' : file.fileType || '未知'}
                        />
                    </ListItem>
                    {file.content && (
                        <ListItem>
                            <ListItemText
                                primary="内容预览"
                                secondary={file.content.length > 200 
                                    ? file.content.substring(0, 200) + '...' 
                                    : file.content}
                            />
                        </ListItem>
                    )}
                </List>
                <Divider className="my-4" />
                <div className="flex justify-end space-x-3">
                    {!file.isDirectory && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={onDownload}
                            startIcon={<i className="fa fa-download mr-2" />}
                        >
                            下载
                        </Button>
                    )}
                    <Button
                        variant="contained"
                        color="error"
                        onClick={onDelete}
                        startIcon={<i className="fa fa-trash mr-2" />}
                    >
                        删除
                    </Button>
                    <Button variant="outlined" onClick={onClose}>
                        关闭
                    </Button>
                </div>
            </Box>
        </Modal>
    );
};

export default FileDetailsModal;    