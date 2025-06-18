package com.example.ftpsearch.repository;

import com.example.ftpsearch.model.SearchHistory;
import com.example.ftpsearch.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SearchHistoryRepository extends JpaRepository<SearchHistory, Long> {

    Page<SearchHistory> findByUser(User user, Pageable pageable);
}    