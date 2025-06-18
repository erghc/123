package com.example.ftpsearch.controller;

import com.example.ftpsearch.dto.FileMetadataDto;
import com.example.ftpsearch.dto.SearchResultDto;
import com.example.ftpsearch.model.FileMetadata;
import com.example.ftpsearch.service.SearchService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(SearchController.class)
public class SearchControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SearchService searchService;

    @Autowired
    private ObjectMapper objectMapper;

    private List<FileMetadata> fileMetadataList;

    @BeforeEach
    void setUp() {
        FileMetadata file1 = new FileMetadata();
        file1.setId(1L);
        file1.setFileName("document.pdf");
        file1.setFilePath("/documents/");
        file1.setFileSize(1024L);
        file1.setLastModified(System.currentTimeMillis());
        file1.setFileType("PDF");

        FileMetadata file2 = new FileMetadata();
        file2.setId(2L);
        file2.setFileName("spreadsheet.xlsx");
        file2.setFilePath("/documents/");
        file2.setFileSize(2048L);
        file2.setLastModified(System.currentTimeMillis());
        file2.setFileType("XLSX");

        fileMetadataList = Arrays.asList(file1, file2);
    }

    @Test
    void testSearchFiles_WithValidQuery_ReturnsSearchResults() throws Exception {
        String keyword = "document";
        int page = 0;
        int size = 10;

        Page<FileMetadata> pageResult = new PageImpl<>(fileMetadataList);
        SearchResultDto searchResult = new SearchResultDto();
        searchResult.setTotalResults(2L);
        searchResult.setCurrentPage(page);
        searchResult.setPageSize(size);
        searchResult.setFiles(FileMetadataDto.fromEntities(fileMetadataList));

        Mockito.when(searchService.searchFiles(keyword, page, size)).thenReturn(searchResult);

        mockMvc.perform(MockMvcRequestBuilders
                .get("/api/search")
                .param("keyword", keyword)
                .param("page", String.valueOf(page))
                .param("size", String.valueOf(size))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print)
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.totalResults").value(2))
                .andExpect(MockMvcResultMatchers.jsonPath("$.currentPage").value(page))
                .andExpect(MockMvcResultMatchers.jsonPath("$.pageSize").value(size))
                .andExpect(MockMvcResultMatchers.jsonPath("$.files.length()").value(2));
    }

    @Test
    void testSearchFiles_WithEmptyQuery_ReturnsBadRequest() throws Exception {
        String keyword = "";
        int page = 0;
        int size = 10;

        mockMvc.perform(MockMvcRequestBuilders
                .get("/api/search")
                .param("keyword", keyword)
                .param("page", String.valueOf(page))
                .param("size", String.valueOf(size))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print)
                .andExpect(status().isBadRequest());
    }

    @Test
    void testSearchFiles_WithNoResults_ReturnsEmptyList() throws Exception {
        String keyword = "nonexistent";
        int page = 0;
        int size = 10;

        SearchResultDto searchResult = new SearchResultDto();
        searchResult.setTotalResults(0L);
        searchResult.setCurrentPage(page);
        searchResult.setPageSize(size);
        searchResult.setFiles(Collections.emptyList());

        Mockito.when(searchService.searchFiles(keyword, page, size)).thenReturn(searchResult);

        mockMvc.perform(MockMvcRequestBuilders
                .get("/api/search")
                .param("keyword", keyword)
                .param("page", String.valueOf(page))
                .param("size", String.valueOf(size))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print)
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.totalResults").value(0))
                .andExpect(MockMvcResultMatchers.jsonPath("$.files.length()").value(0));
    }

    @Test
    void testGetSuggestions_WithValidQuery_ReturnsSuggestions() throws Exception {
        String query = "doc";
        List<String> suggestions = Arrays.asList("document.pdf", "documentation.txt", "docs");

        Mockito.when(searchService.getSuggestions(query)).thenReturn(suggestions);

        mockMvc.perform(MockMvcRequestBuilders
                .get("/api/suggestions")
                .param("query", query)
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print)
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.length()").value(3));
    }

    @Test
    void testGetSuggestions_WithShortQuery_ReturnsEmptyList() throws Exception {
        String query = "d";

        Mockito.when(searchService.getSuggestions(query)).thenReturn(Collections.emptyList());

        mockMvc.perform(MockMvcRequestBuilders
                .get("/api/suggestions")
                .param("query", query)
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print)
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.length()").value(0));
    }
}    