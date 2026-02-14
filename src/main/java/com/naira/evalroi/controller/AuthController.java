package com.naira.evalroi.controller;

import com.naira.evalroi.dto.AuthResponseDto;
import com.naira.evalroi.dto.Enums;
import com.naira.evalroi.dto.LoginDto;
import com.naira.evalroi.dto.RegisterDto;
import com.naira.evalroi.entity.Role;
import com.naira.evalroi.entity.UserEntity;
import com.naira.evalroi.repository.RoleRepository;
import com.naira.evalroi.repository.UserRepository;
import com.naira.evalroi.security.JWTGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;

@RestController
@RequestMapping("api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JWTGenerator jwtGenerator;

    @PostMapping("register")
    public ResponseEntity<String> register(@RequestBody RegisterDto registerDto) {
        if (userRepository.existsByUsername(registerDto.getUsername())) {
            return new ResponseEntity<>("Username is already taken", HttpStatus.BAD_REQUEST);
        }
        if (userRepository.existsByEmail(registerDto.getEmail())) {
            return new ResponseEntity<>("Email is already in use", HttpStatus.BAD_REQUEST);
        }
        if (!registerDto.getConfirmPassword().equals(registerDto.getPassword())) {
            return new ResponseEntity<>("Password is not valid", HttpStatus.BAD_REQUEST);
        }

        UserEntity userEntity = new UserEntity();
        userEntity.setUsername(registerDto.getUsername());
        userEntity.setEmail(registerDto.getEmail());
        userEntity.setPassword(passwordEncoder.encode(registerDto.getPassword()));

        Role  role = roleRepository.findByRole(Enums.Role.USER).get();
        userEntity.setRoles(Collections.singletonList(role));

        userRepository.save(userEntity);
        return new ResponseEntity<>("User registered successfully", HttpStatus.OK);
    }

    @PostMapping("login")
    public ResponseEntity<AuthResponseDto> login(@RequestBody LoginDto loginDto) {
        String username = null;
        if (Enums.LoginWith.EMAIL.equals(loginDto.getLoginWith())) {
            username = loginDto.getEmail();
        }
        else if (Enums.LoginWith.USERNAME.equals(loginDto.getLoginWith())) {
            username = loginDto.getUsername();
        }
       Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username,
                        loginDto.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(auth);
        String jwt = jwtGenerator.generateToken(auth);
        return new ResponseEntity<>(new AuthResponseDto(jwt), HttpStatus.OK);
    }

}
