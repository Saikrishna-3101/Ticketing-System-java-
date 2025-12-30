package com.leapscholar.ticketing.service;

import com.leapscholar.ticketing.dto.LoginRequest;
import com.leapscholar.ticketing.dto.LoginResponse;
import com.leapscholar.ticketing.model.User;
import com.leapscholar.ticketing.repository.UserRepository;
import com.leapscholar.ticketing.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    public LoginResponse login(LoginRequest request) {
        // Authenticate user credentials
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        String token = jwtUtil.generateToken(user);
        
        return new LoginResponse(
            token,
            user.getUsername(),
            user.getEmail(),
            user.getRole(),
            user.getId()
        );
    }
}

