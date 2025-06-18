package com.example.ftpsearch.service.impl;

import com.example.ftpsearch.model.FileMetadata;
import com.example.ftpsearch.repository.FileMetadataRepository;
import com.example.ftpsearch.service.IndexingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.apache.commons.io.FilenameUtils;
import org.apache.tika.Tika;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class IndexingServiceImpl implements IndexingService {

    @Autowired
    private FileMetadataRepository fileMetadataRepository;

    @Override
    public FileMetadata indexFile(String fileName, String fileType, String fullPath, 
                                 long sizeBytes, String contentPreview, boolean isDirectory) {
        FileMetadata fileMetadata = new FileMetadata();
        fileMetadata.setFileName(fileName);
        fileMetadata.setFileType(fileType);
        fileMetadata.setFullPath(fullPath);
        fileMetadata.setSizeBytes(sizeBytes);
        fileMetadata.setContentPreview(contentPreview);
        fileMetadata.setIsDirectory(isDirectory);
        fileMetadata.setIndexedTime(LocalDateTime.now());
        
        return fileMetadataRepository.save(fileMetadata);
    }

    @Override
    public List<FileMetadata> indexDirectory(String directoryPath, String ftpServerId) throws IOException {
        // 这里应该实现递归索引目录的逻辑
        // 简化示例，返回空列表
        return new ArrayList<>();
    }

    @Override
    public void updateFileIndex(String filePath, MultipartFile file) throws IOException {
        // 从数据库获取文件元数据
        FileMetadata fileMetadata = fileMetadataRepository.findByFullPath(filePath)
            .orElseThrow(() -> new IllegalArgumentException("File not found: " + filePath));
        
        // 更新元数据
        fileMetadata.setFileName(file.getOriginalFilename());
        fileMetadata.setFileType(FilenameUtils.getExtension(file.getOriginalFilename()));
        fileMetadata.setSizeBytes(file.getSize());
        fileMetadata.setLastModified(LocalDateTime.now());
        
        // 提取文件内容预览
        Tika tika = new Tika();
        String content = tika.parseToString(file.getInputStream());
        String preview = content.length() > 200 ? content.substring(0, 200) + "..." : content;
        fileMetadata.setContentPreview(preview);
        
        // 保存更新
        fileMetadataRepository.save(fileMetadata);
    }

    @Override
    public void deleteFileIndex(String filePath) {
        // 根据文件路径从数据库删除文件索引
        fileMetadataRepository.deleteByFullPath(filePath);
    }
}    