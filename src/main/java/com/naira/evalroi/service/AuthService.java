package com.naira.evalroi.service;

import com.naira.evalroi.dto.auth.AuthResponseDto;
import com.naira.evalroi.dto.auth.LoginDto;
import com.naira.evalroi.dto.auth.RegisterDto;

public interface AuthService {
    AuthResponseDto login(LoginDto loginDto);
    String register(RegisterDto registerDto);
}
