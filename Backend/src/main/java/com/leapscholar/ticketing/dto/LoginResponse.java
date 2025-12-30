package com.leapscholar.ticketing.dto;

import com.leapscholar.ticketing.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String username;
    private String email;
    private Role role;
    private Long userId;
}



