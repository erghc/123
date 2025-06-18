package com.example.ftpsearch.controller;

import com.example.ftpsearch.dto.FileMetadataDto;
import com.example.ftpsearch.exception.FileNotFoundException;
import com.example.ftpsearch.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/files")
public class FileController {

    @Autowired
    private FileService fileService;

    @GetMapping("/{id}")
    public ResponseEntity<FileMetadataDto> getFileMetadata(@PathVariable Long id) {
        FileMetadataDto fileMetadata = fileService.getFileMetadata(id)
                .orElseThrow(() -> new FileNotFoundException("File not found with id: " + id));
        return ResponseEntity.ok(fileMetadata);
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id) throws IOException {
        Resource resource = fileService.downloadFile(id);
        FileMetadataDto fileMetadata = fileService.getFileMetadata(id)
                .orElseThrow(() -> new FileNotFoundException("File not found with id: " + id));

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(fileMetadata.getFileType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}    