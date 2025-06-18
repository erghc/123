package com.example.ftpsearch.service;

import com.example.ftpsearch.model.FileMetadata;

import java.io.IOException;
import java.util.List;

public interface CrawlerService {

    List<FileMetadata> crawlFtpServer(String serverId) throws IOException;

    void scheduleCrawl(String serverId, String cronExpression);

    void stopCrawl(String serverId);

    void startCrawl(String serverId);
}    