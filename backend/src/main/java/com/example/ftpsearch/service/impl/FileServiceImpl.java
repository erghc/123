package com.example.ftpsearch.service.impl;

import com.example.ftpsearch.dto.FileMetadataDto;
import com.example.ftpsearch.model.FileMetadata;
import com.example.ftpsearch.repository.FileMetadataRepository;
import com.example.ftpsearch.service.FileService;
import com.example.ftpsearch.service.IndexingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.*;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FileServiceImpl implements FileService {

    @Autowired
    private FileMetadataRepository fileMetadataRepository;
    
    @Autowired
    private IndexingService indexingService;

    @Override
    public FileMetadataDto getFileById(Long id) {
        FileMetadata file = fileMetadataRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("File not found with id: " + id));
        return convertToDto(file);
    }

    @Override
    public List<FileMetadataDto> getFilesByDirectory(String directoryPath) {
        List<FileMetadata> files = fileMetadataRepository.findByParentPath(directoryPath);
        return files.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    @Override
    public byte[] downloadFile(String filePath) throws IOException {
        // 这里应该从FTP服务器获取文件
        // 简化示例，实际应通过FTP客户端获取
        FileMetadata file = fileMetadataRepository.findByFullPath(filePath)
            .orElseThrow(() -> new RuntimeException("File not found: " + filePath));
        
        // 模拟从FTP服务器下载文件
        return new byte[0];
    }

    @Override
    public FileMetadataDto uploadFile(String directoryPath, MultipartFile file) throws IOException {
        // 上传文件到FTP服务器
        // 简化示例，实际应通过FTP客户端上传
        
        // 索引新上传的文件
        FileMetadata indexedFile = indexingService.indexFile(
            file.getOriginalFilename(),
            getFileType(file.getOriginalFilename()),
            directoryPath + "/" + file.getOriginalFilename(),
            file.getSize(),
            extractContentPreview(file),
            false
        );
        
        return convertToDto(indexedFile);
    }

    @Override
    public void deleteFile(String filePath) throws IOException {
        // 从FTP服务器删除文件
        // 简化示例，实际应通过FTP客户端删除
        
        // 删除文件索引
        indexingService.deleteFileIndex(filePath);
    }

    @Override
    public void moveFile(String sourcePath, String targetPath) throws IOException {
        // 在FTP服务器上移动文件
        // 简化示例，实际应通过FTP客户端移动
        
        // 更新文件索引
        FileMetadata file = fileMetadataRepository.findByFullPath(sourcePath)
            .orElseThrow(() -> new RuntimeException("File not found: " + sourcePath));
        
        file.setFullPath(targetPath);
        fileMetadataRepository.save(file);
    }

    @Override
    public void createDirectory(String parentPath, String directoryName) throws IOException {
        // 在FTP服务器上创建目录
        // 简化示例，实际应通过FTP客户端创建
        
        // 索引新创建的目录
        String fullPath = parentPath + "/" + directoryName;
        indexingService.indexFile(
            directoryName,
            "directory",
            fullPath,
            0,
            "",
            true
        );
    }

    private FileMetadataDto convertToDto(FileMetadata file) {
        FileMetadataDto dto = new FileMetadataDto();
        dto.setId(file.getId());
        dto.setFileName(file.getFileName());
        dto.setFileType(file.getFileType());
        dto.setFullPath(file.getFullPath());
        dto.setSizeBytes(file.getSizeBytes());
        dto.setLastModified(file.getLastModified());
        dto.setContentPreview(file.getContentPreview());
        dto.setIsDirectory(file.getIsDirectory());
        return dto;
    }

    private String getFileType(String fileName) {
        if (fileName == null) return "unknown";
        int lastIndex = fileName.lastIndexOf('.');
        if (lastIndex == -1) return "unknown";
        return fileName.substring(lastIndex + 1).toLowerCase();
    }

    private String extractContentPreview(MultipartFile file) throws IOException {
        // 简化示例，实际应使用Apache Tika等工具提取文件内容
        return "Preview of " + file.getOriginalFilename();
    }
}    