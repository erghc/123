package com.example.ftpsearch.service;

import com.example.ftpsearch.dto.FileMetadataDto;
import com.example.ftpsearch.dto.SearchResultDto;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface SearchService {

    SearchResultDto search(String keyword, String fileType, Long minSize, Long maxSize, 
                          String startDate, String endDate, Pageable pageable);

    List<String> getSuggestions(String prefix);

    void logSearch(String username, String query, int resultCount);
}    