package com.example.ftpsearch.controller;

import com.example.ftpsearch.dto.FileMetadataDto;
import com.example.ftpsearch.model.FtpServerConfig;
import com.example.ftpsearch.service.CrawlerService;
import com.example.ftpsearch.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private FileService fileService;

    @Autowired
    private CrawlerService crawlerService;

    @GetMapping("/files")
    public ResponseEntity<List<FileMetadataDto>> getAllFiles() {
        List<FileMetadataDto> files = fileService.getAllFiles();
        return ResponseEntity.ok(files);
    }

    @PostMapping("/ftp-servers/{id}/crawl")
    public ResponseEntity<Void> triggerFtpCrawl(@PathVariable Long id) {
        crawlerService.triggerFtpCrawl(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/ftp-servers")
    public ResponseEntity<List<FtpServerConfig>> getFtpServers() {
        List<FtpServerConfig> ftpServers = crawlerService.getFtpServers();
        return ResponseEntity.ok(ftpServers);
    }

    @PostMapping("/ftp-servers")
    public ResponseEntity<FtpServerConfig> addFtpServer(@RequestBody FtpServerConfig ftpServer) {
        FtpServerConfig savedServer = crawlerService.addFtpServer(ftpServer);
        return ResponseEntity.ok(savedServer);
    }
}    