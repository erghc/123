package com.example.ftpsearch.controller;

import com.example.ftpsearch.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/suggestions")
public class SuggestionController {

    @Autowired
    private SearchService searchService;

    @GetMapping
    public ResponseEntity<List<String>> getSearchSuggestions(@RequestParam String prefix) {
        List<String> suggestions = searchService.getSearchSuggestions(prefix);
        return ResponseEntity.ok(suggestions);
    }
}    