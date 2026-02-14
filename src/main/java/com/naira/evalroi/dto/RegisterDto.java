package com.naira.evalroi.dto;

import lombok.Data;

@Data
public class RegisterDto {
    private String email;
    private String username;
    private String password;
    private String confirmPassword;
}
