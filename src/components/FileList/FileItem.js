import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFolder,
    faFilePdf,
    faFileWord,
    faFileExcel,
    faFilePowerpoint,
    faFileImage,
    faFileVideo,
    faFileAudio,
    faFileCode,
    faFileText,
    faFileZip
} from '@fortawesome/free-solid-svg-icons';
import FileSizeFormatter from '../../utils/FileSizeFormatter';

const getFileIcon = (file) => {
    if (file.isDirectory) {
        return faFolder;
    }

    const ext = file.fileName?.split('.').pop()?.toLowerCase() || '';

    switch (ext) {
        case 'pdf':
            return faFilePdf;
        case 'doc':
        case 'docx':
            return faFileWord;
        case 'xls':
        case 'xlsx':
            return faFileExcel;
        case 'ppt':
        case 'pptx':
            return faFilePowerpoint;
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
        case 'bmp':
        case 'svg':
            return faFileImage;
        case 'mp4':
        case 'mov':
        case 'avi':
        case 'mkv':
            return faFileVideo;
        case 'mp3':
        case 'wav':
        case 'ogg':
            return faFileAudio;
        case 'html':
        case 'css':
        case 'js':
        case 'json':
        case 'xml':
        case 'java':
        case 'py':
            return faFileCode;
        case 'txt':
        case 'md':
        case 'log':
            return faFileText;
        case 'zip':
        case 'rar':
        case 'tar':
        case 'gz':
            return faFileZip;
        default:
            return faFile;
    }
};

const getFileIconColor = (file) => {
    if (file.isDirectory) {
        return 'text-blue-500';
    }

    const ext = file.fileName?.split('.').pop()?.toLowerCase() || '';

    switch (ext) {
        case 'pdf':
            return 'text-red-500';
        case 'doc':
        case 'docx':
            return 'text-blue-600';
        case 'xls':
        case 'xlsx':
            return 'text-green-600';
        case 'ppt':
        case 'pptx':
            return 'text-orange-500';
        default:
            return 'text-gray-500';
    }
};

const FileItem = ({ file, onFileClick, onDirectoryClick }) => {
    const handleClick = () => {
        if (file.isDirectory && onDirectoryClick) {
            onDirectoryClick(file);
        } else if (onFileClick) {
            onFileClick(file);
        }
    };

    return (
        <div
            className={`px-4 py-3 flex items-center hover:bg-gray-50 transition-colors ${
                file.isDirectory ? 'cursor-pointer' : ''
            }`}
            onClick={handleClick}
        >
            <div className="flex-shrink-0 mr-3">
                <FontAwesomeIcon
                    icon={getFileIcon(file)}
                    className={`${getFileIconColor(file)} text-xl`}
                />
            </div>
            <div className="flex-grow min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                    {file.fileName || file.name}
                </p>
                {file.isDirectory ? (
                    <p className="text-xs text-gray-500">目录</p>
                ) : (
                    <p className="text-xs text-gray-500">
                        {FileSizeFormatter.format(file.fileSize)} · {new Date(file.lastModified).toLocaleDateString()}
                    </p>
                )}
            </div>
            <div className="flex items-center ml-4">
                {file.isDirectory && (
                    <FontAwesomeIcon icon={faChevronRight} className="text-gray-400 text-xs" />
                )}
            </div>
        </div>
    );
};

export default FileItem;    