package com.naira.evalroi.dto;

import lombok.Data;

@Data
public class LoginDto {
    private Enums.LoginWith loginWith;
    private String email;
    private String username;
    private String password;
}
