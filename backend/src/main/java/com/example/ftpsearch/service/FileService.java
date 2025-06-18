package com.example.ftpsearch.service;

import com.example.ftpsearch.dto.FileMetadataDto;
import com.example.ftpsearch.model.FileMetadata;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface FileService {

    FileMetadataDto getFileById(Long id);

    List<FileMetadataDto> getFilesByDirectory(String directoryPath);

    byte[] downloadFile(String filePath) throws IOException;

    FileMetadataDto uploadFile(String directoryPath, MultipartFile file) throws IOException;

    void deleteFile(String filePath) throws IOException;

    void moveFile(String sourcePath, String targetPath) throws IOException;

    void createDirectory(String parentPath, String directoryName) throws IOException;
}    