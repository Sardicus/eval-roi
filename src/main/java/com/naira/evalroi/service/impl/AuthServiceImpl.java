package com.naira.evalroi.service.impl;

import com.naira.evalroi.dto.auth.AuthResponseDto;
import com.naira.evalroi.dto.auth.LoginDto;
import com.naira.evalroi.dto.auth.RegisterDto;
import com.naira.evalroi.entity.Role;
import com.naira.evalroi.entity.UserEntity;
import com.naira.evalroi.enums.LoginWith;
import com.naira.evalroi.enums.RoleEnum;
import com.naira.evalroi.repository.RoleRepository;
import com.naira.evalroi.repository.UserRepository;
import com.naira.evalroi.security.JWTGenerator;
import com.naira.evalroi.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JWTGenerator  jwtGenerator;

    @Override
    public AuthResponseDto login(LoginDto loginDto) {
        String username = null;
        if (LoginWith.EMAIL.equals(loginDto.getLoginWith())) {
            username = loginDto.getEmail();
        }
        else if (LoginWith.USERNAME.equals(loginDto.getLoginWith())) {
            username = loginDto.getUsername();
        }
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username,
                        loginDto.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(auth);
        String jwt = jwtGenerator.generateToken(auth);
        return new AuthResponseDto(jwt);
    }

    @Override
    public String register(RegisterDto registerDto) {
        if (userRepository.existsByUsername(registerDto.getUsername())) {
            throw new RuntimeException("Username is already taken");
        }
        if (userRepository.existsByEmail(registerDto.getEmail())) {
            throw new RuntimeException("Email is already in use");
        }
        if (!registerDto.getConfirmPassword().equals(registerDto.getPassword())) {
            throw new RuntimeException("Password is not valid");
        }

        UserEntity userEntity = new UserEntity();
        userEntity.setUsername(registerDto.getUsername());
        userEntity.setEmail(registerDto.getEmail());
        userEntity.setPassword(passwordEncoder.encode(registerDto.getPassword()));

        RoleEnum roleEnum = registerDto.getRole() != null ? registerDto.getRole() : RoleEnum.USER;
        Role role = roleRepository.findByRole(roleEnum)
                .orElseThrow(() -> new RuntimeException("Role not found"));
        userEntity.setRoles(Collections.singletonList(role));

        userRepository.save(userEntity);
        return "User registered successfully";
    }
}
