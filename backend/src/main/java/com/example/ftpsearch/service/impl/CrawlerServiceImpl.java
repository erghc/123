package com.example.ftpsearch.service.impl;

import com.example.ftpsearch.model.FileMetadata;
import com.example.ftpsearch.repository.FileMetadataRepository;
import com.example.ftpsearch.service.CrawlerService;
import com.example.ftpsearch.service.IndexingService;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class CrawlerServiceImpl implements CrawlerService {

    @Autowired
    private IndexingService indexingService;
    
    @Autowired
    private FileMetadataRepository fileMetadataRepository;

    @Override
    public List<FileMetadata> crawlFtpServer(String serverId) throws IOException {
        // 这里应该根据serverId获取FTP服务器配置
        // 简化示例，使用硬编码配置
        
        FTPClient ftpClient = new FTPClient();
        List<FileMetadata> indexedFiles = new ArrayList<>();
        
        try {
            // 连接到FTP服务器
            ftpClient.connect("ftp.example.com", 21);
            ftpClient.login("username", "password");
            ftpClient.enterLocalPassiveMode();
            
            // 开始爬取根目录
            indexedFiles = crawlDirectory(ftpClient, "/", serverId);
            
            // 更新最后爬取时间
            // ftpServerRepository.updateLastCrawled(serverId, LocalDateTime.now());
            
        } catch (IOException e) {
            throw new IOException("Error crawling FTP server: " + e.getMessage(), e);
        } finally {
            // 断开连接
            if (ftpClient.isConnected()) {
                ftpClient.logout();
                ftpClient.disconnect();
            }
        }
        
        return indexedFiles;
    }

    private List<FileMetadata> crawlDirectory(FTPClient ftpClient, String directoryPath, String serverId) throws IOException {
        List<FileMetadata> files = new ArrayList<>();
        
        // 获取目录下的所有文件
        FTPFile[] ftpFiles = ftpClient.listFiles(directoryPath);
        
        for (FTPFile ftpFile : ftpFiles) {
            String filePath = directoryPath + "/" + ftpFile.getName();
            
            if (ftpFile.isDirectory()) {
                // 递归爬取子目录
                FileMetadata dirMetadata = indexDirectory(ftpClient, directoryPath, ftpFile.getName(), serverId);
                files.add(dirMetadata);
                
                List<FileMetadata> subFiles = crawlDirectory(ftpClient, filePath, serverId);
                files.addAll(subFiles);
            } else {
                // 索引文件
                FileMetadata fileMetadata = indexFile(ftpClient, directoryPath, ftpFile, serverId);
                files.add(fileMetadata);
            }
        }
        
        return files;
    }

    private FileMetadata indexDirectory(FTPClient ftpClient, String parentPath, String directoryName, String serverId) throws IOException {
        String fullPath = parentPath + "/" + directoryName;
        
        // 创建目录元数据
        FileMetadata directory = new FileMetadata();
        directory.setFileName(directoryName);
        directory.setFileType("directory");
        directory.setFullPath(fullPath);
        directory.setSizeBytes(0);
        directory.setLastModified(LocalDateTime.now());
        directory.setContentPreview("");
        directory.setIsDirectory(true);
        directory.setFtpServerId(serverId);
        
        // 保存到数据库
        return fileMetadataRepository.save(directory);
    }

    private FileMetadata indexFile(FTPClient ftpClient, String parentPath, FTPFile ftpFile, String serverId) throws IOException {
        String fullPath = parentPath + "/" + ftpFile.getName();
        
        // 创建文件元数据
        FileMetadata file = new FileMetadata();
        file.setFileName(ftpFile.getName());
        file.setFileType(getFileType(ftpFile.getName()));
        file.setFullPath(fullPath);
        file.setSizeBytes(ftpFile.getSize());
        file.setLastModified(LocalDateTime.now());
        file.setContentPreview(""); // 实际应提取文件内容预览
        file.setIsDirectory(false);
        file.setFtpServerId(serverId);
        
        // 保存到数据库
        return fileMetadataRepository.save(file);
    }

    private String getFileType(String fileName) {
        if (fileName == null) return "unknown";
        int lastIndex = fileName.lastIndexOf('.');
        if (lastIndex == -1) return "unknown";
        return fileName.substring(lastIndex + 1).toLowerCase();
    }

    @Override
    @Scheduled(cron = "${ftp.crawl.cron:0 0 2 * * *}") // 默认每天凌晨2点执行
    public void scheduleCrawl(String serverId) {
        try {
            crawlFtpServer(serverId);
        } catch (IOException e) {
            // 记录错误日志
            e.printStackTrace();
        }
    }

    @Override
    public void stopCrawl(String serverId) {
        // 实现停止爬取的逻辑
    }

    @Override
    public void startCrawl(String serverId) {
        // 实现开始爬取的逻辑
        try {
            crawlFtpServer(serverId);
        } catch (IOException e) {
            // 记录错误日志
            e.printStackTrace();
        }
    }
}    