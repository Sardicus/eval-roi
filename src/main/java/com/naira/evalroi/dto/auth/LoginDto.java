package com.naira.evalroi.dto.auth;

import com.naira.evalroi.enums.LoginWith;
import lombok.Data;

@Data
public class LoginDto {
    private LoginWith loginWith;
    private String email;
    private String username;
    private String password;
}
