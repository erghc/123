package com.example.ftpsearch.service.impl;

import com.example.ftpsearch.dto.FileMetadataDto;
import com.example.ftpsearch.dto.SearchResultDto;
import com.example.ftpsearch.model.FileMetadata;
import com.example.ftpsearch.repository.FileMetadataRepository;
import com.example.ftpsearch.service.SearchService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SearchServiceImpl implements SearchService {

    private final FileMetadataRepository fileMetadataRepository;

    public SearchServiceImpl(FileMetadataRepository fileMetadataRepository) {
        this.fileMetadataRepository = fileMetadataRepository;
    }

    @Override
    public SearchResultDto search(String keyword, String fileType, Long minSize, Long maxSize, 
                                 String startDate, String endDate, Pageable pageable) {
        Page<FileMetadata> results;
        
        if (keyword != null && !keyword.isEmpty()) {
            // 执行全文搜索
            results = fileMetadataRepository.searchByKeyword(
                keyword, fileType, minSize, maxSize, startDate, endDate, pageable);
        } else {
            // 如果没有关键词，返回所有文件
            results = fileMetadataRepository.findAll(pageable);
        }
        
        List<FileMetadataDto> dtos = results.getContent().stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
            
        return new SearchResultDto(
            dtos,
            results.getNumber(),
            results.getSize(),
            results.getTotalElements(),
            results.getTotalPages(),
            results.isLast()
        );
    }

    @Override
    public List<String> getSuggestions(String prefix) {
        // 从数据库或缓存中获取搜索建议
        List<String> suggestions = new ArrayList<>();
        
        if (prefix != null && !prefix.isEmpty()) {
            suggestions = fileMetadataRepository.findSuggestions(prefix.toLowerCase(), 
                PageRequest.of(0, 10, Sort.by("fileName")))
                .getContent().stream()
                .map(FileMetadata::getFileName)
                .collect(Collectors.toList());
        }
        
        return suggestions;
    }

    @Override
    public void logSearch(String username, String query, int resultCount) {
        // 记录搜索历史
        // searchHistoryRepository.save(new SearchHistory(username, query, resultCount, LocalDateTime.now()));
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
}    