import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import FileList from './FileList';
import FileItem from './FileItem';

jest.mock('./FileItem', () => ({
    __esModule: true,
    default: jest.fn(() => <div data-testid="file-item" />)
}));

describe('FileList', () => {
    test('renders loading state', () => {
        render(<FileList isLoading={true} />);
        const spinner = screen.getByTestId('loading-spinner');
        expect(spinner).toBeInTheDocument();
    });

    test('renders error state', () => {
        render(<FileList error="加载失败" />);
        const errorMessage = screen.getByText('加载失败');
        expect(errorMessage).toBeInTheDocument();
    });

    test('renders empty state', () => {
        render(<FileList files={[]} />);
        const emptyMessage = screen.getByText('未找到文件');
        expect(emptyMessage).toBeInTheDocument();
    });

    test('renders file list', () => {
        const files = [
            { id: 1, fileName: 'document.pdf', fileSize: 1024, lastModified: new Date() },
            { id: 2, fileName: 'image.jpg', fileSize: 2048, lastModified: new Date() }
        ];

        render(<FileList files={files} />);
        expect(FileItem).toHaveBeenCalledTimes(2);
        expect(FileItem).toHaveBeenCalledWith(
            expect.objectContaining({ file: files[0] }),
            {}
        );
        expect(FileItem).toHaveBeenCalledWith(
            expect.objectContaining({ file: files[1] }),
            {}
        );
    });

    test('calls onFileClick when file is clicked', () => {
        const onFileClick = jest.fn();
        const file = { id: 1, fileName: 'document.pdf', isDirectory: false };

        render(<FileList files={[file]} onFileClick={onFileClick} />);
        fireEvent.click(screen.getByTestId('file-item'));

        expect(onFileClick).toHaveBeenCalledWith(file);
    });

    test('calls onDirectoryClick when directory is clicked', () => {
        const onDirectoryClick = jest.fn();
        const directory = { id: 2, name: 'documents', isDirectory: true };

        render(<FileList files={[directory]} onDirectoryClick={onDirectoryClick} />);
        fireEvent.click(screen.getByTestId('file-item'));

        expect(onDirectoryClick).toHaveBeenCalledWith(directory);
    });

    test('displays correct item count', () => {
        const files = [
            { id: 1, fileName: 'file1.txt' },
            { id: 2, fileName: 'file2.txt' },
            { id: 3, fileName: 'file3.txt' }
        ];

        render(<FileList files={files} />);
        const countElement = screen.getByText('3 个项目');
        expect(countElement).toBeInTheDocument();
    });
});    