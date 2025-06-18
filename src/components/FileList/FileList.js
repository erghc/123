import React from 'react';
import FileItem from './FileItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faFile, faSpinner } from '@fortawesome/free-solid-svg-icons';

const FileList = ({ files, isLoading, error, onFileClick, onDirectoryClick }) => {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-40">
                <FontAwesomeIcon icon={faSpinner} spin className="text-3xl text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-40 text-gray-600">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-3xl text-red-500 mb-3" />
                <p>{error}</p>
            </div>
        );
    }

    if (!files || files.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                <FontAwesomeIcon icon={faFolder} className="text-5xl text-gray-300 mb-4" />
                <p>未找到文件</p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
            <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700">文件列表</h3>
                <div className="text-sm text-gray-500">{files.length} 个项目</div>
            </div>
            <div className="divide-y divide-gray-200">
                {files.map((file) => (
                    <FileItem
                        key={file.id || file.name}
                        file={file}
                        onFileClick={onFileClick}
                        onDirectoryClick={onDirectoryClick}
                    />
                ))}
            </div>
        </div>
    );
};

export default FileList;    