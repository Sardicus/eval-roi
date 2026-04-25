package com.naira.evalroi.dto.auth;

import com.naira.evalroi.enums.RoleEnum;
import lombok.Data;

@Data
public class RegisterDto {
    private String email;
    private String username;
    private String password;
    private String confirmPassword;
    private RoleEnum role;
    private String firstName;
    private String lastName;
    private String phoneNumber;
}
