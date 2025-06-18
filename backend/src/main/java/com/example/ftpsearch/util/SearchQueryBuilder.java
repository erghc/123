package com.example.ftpsearch.util;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.HashMap;
import java.util.Map;

public class SearchQueryBuilder {

    public static Pageable buildPageable(int page, int size, String sortField, String sortDirection) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortField);
        return PageRequest.of(page, size, sort);
    }

    public static Map<String, Object> buildSearchParams(String keyword, String fileType, 
                                                       Long minSize, Long maxSize, 
                                                       String startDate, String endDate) {
        Map<String, Object> params = new HashMap<>();
        if (keyword != null && !keyword.isEmpty()) params.put("keyword", keyword);
        if (fileType != null && !fileType.isEmpty()) params.put("fileType", fileType);
        if (minSize != null) params.put("minSize", minSize);
        if (maxSize != null) params.put("maxSize", maxSize);
        if (startDate != null && !startDate.isEmpty()) params.put("startDate", startDate);
        if (endDate != null && !endDate.isEmpty()) params.put("endDate", endDate);
        return params;
    }
}    