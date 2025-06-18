package com.example.ftpsearch.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileMetadataDto {
    private Long id;
    private String fileName;
    private String fileType;
    private String fullPath;
    private Long sizeBytes;
    private String sizeFormatted;
    private LocalDateTime lastModified;
    private String contentPreview;
    private boolean isDirectory;
}    