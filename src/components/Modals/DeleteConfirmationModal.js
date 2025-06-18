import React from 'react';
import {
    Modal,
    Box,
    Typography,
    Button,
    IconButton,
    Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WarningIcon from '@mui/icons-material/Warning';

const DeleteConfirmationModal = ({ open, onClose, onConfirm, file }) => {
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

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="delete-confirmation-modal"
            aria-describedby="delete-confirmation-description"
        >
            <Box sx={style}>
                <div className="flex justify-between items-center mb-4">
                    <Typography variant="h5" component="h2" className="font-medium">
                        确认删除
                    </Typography>
                    <IconButton onClick={onClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                </div>
                <Divider className="my-4" />
                <div className="flex items-start mb-6">
                    <WarningIcon className="text-yellow-500 text-2xl mt-1 mr-3" />
                    <div>
                        <Typography variant="body1" className="text-gray-800">
                            你确定要删除文件 <strong>{file?.fileName || file?.name}</strong> 吗？
                        </Typography>
                        <Typography variant="body2" className="text-gray-500 mt-2">
                            此操作不可撤销，文件将被永久删除。
                        </Typography>
                    </div>
                </div>
                <div className="flex justify-end space-x-3">
                    <Button variant="outlined" onClick={onClose}>
                        取消
                    </Button>
                    <Button variant="contained" color="error" onClick={onConfirm}>
                        确认删除
                    </Button>
                </div>
            </Box>
        </Modal>
    );
};

export default DeleteConfirmationModal;    