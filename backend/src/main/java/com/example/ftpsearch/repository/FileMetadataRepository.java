package com.example.ftpsearch.repository;

import com.example.ftpsearch.model.FileMetadata;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileMetadataRepository extends JpaRepository<FileMetadata, Long> {

    Page<FileMetadata> findByFileNameContainingIgnoreCase(String keyword, Pageable pageable);

    @Query("SELECT fm FROM FileMetadata fm " +
            "WHERE (:keyword IS NULL OR LOWER(fm.fileName) LIKE %:keyword% OR LOWER(fm.contentPreview) LIKE %:keyword%) " +
            "AND (:fileType IS NULL OR fm.fileType = :fileType) " +
            "AND (:minSize IS NULL OR fm.sizeBytes >= :minSize) " +
            "AND (:maxSize IS NULL OR fm.sizeBytes <= :maxSize) " +
            "AND (:startDate IS NULL OR fm.lastModified >= :startDate) " +
            "AND (:endDate IS NULL OR fm.lastModified <= :endDate)")
    Page<FileMetadata> advancedSearch(
            @Param("keyword") String keyword,
            @Param("fileType") String fileType,
            @Param("minSize") Long minSize,
            @Param("maxSize") Long maxSize,
            @Param("startDate") String startDate,
            @Param("endDate") String endDate,
            Pageable pageable);

    @Query("SELECT DISTINCT fm.fileType FROM FileMetadata fm WHERE fm.fileType IS NOT NULL")
    List<String> findAllFileTypes();

    List<FileMetadata> findTop10ByFileNameContainingIgnoreCaseOrderByLastModifiedDesc(String prefix);
}    