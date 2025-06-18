package com.example.ftpsearch.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "file_metadata")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileMetadata {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fileName;

    private String fileType;

    @Column(nullable = false, unique = true)
    private String fullPath;

    private Long sizeBytes;

    @Column(nullable = false)
    private LocalDateTime lastModified;

    @Lob
    private String contentPreview;

    @Column(nullable = false)
    private boolean isDirectory;

    @Column(nullable = false)
    private LocalDateTime indexedTime;
}    