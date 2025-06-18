package com.example.ftpsearch.service;

import com.example.ftpsearch.dto.JwtResponse;
import com.example.ftpsearch.dto.LoginRequest;
import com.example.ftpsearch.dto.SignupRequest;
import com.example.ftpsearch.model.User;

public interface AuthService {

    JwtResponse authenticateUser(LoginRequest loginRequest);

    User registerUser(SignupRequest signUpRequest);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}    