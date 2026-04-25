package com.naira.evalroi.service.impl;

import com.naira.evalroi.dto.user.UserProfileDto;
import com.naira.evalroi.dto.user.UpdateUserProfileDto;
import com.naira.evalroi.entity.UserEntity;
import com.naira.evalroi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserProfileService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserProfileDto getUserProfile(String userIdentifier){
        UserEntity user = userRepository.findByUsernameOrEmail(userIdentifier,userIdentifier)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return new UserProfileDto(
            user.getUsername(), 
            user.getEmail(), 
            user.getFirstName(), 
            user.getLastName(), 
            user.getPhoneNumber()
        );
    }

    public UserProfileDto updateUserProfile(String userIdentifier, UpdateUserProfileDto updateDto) {
        UserEntity user = userRepository.findByUsernameOrEmail(userIdentifier, userIdentifier)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (updateDto.email() != null && !updateDto.email().equals(user.getEmail())) {
            if (userRepository.existsByEmail(updateDto.email())) {
                throw new IllegalArgumentException("Email is already taken");
            }
            user.setEmail(updateDto.email());
        }

        if (updateDto.username() != null && !updateDto.username().equals(user.getUsername())) {
            if (userRepository.existsByUsername(updateDto.username())) {
                throw new IllegalArgumentException("Username is already taken");
            }
            user.setUsername(updateDto.username());
        }

        if (updateDto.firstName() != null) {
            user.setFirstName(updateDto.firstName());
        }
        if (updateDto.lastName() != null) {
            user.setLastName(updateDto.lastName());
        }
        if (updateDto.phoneNumber() != null) {
            user.setPhoneNumber(updateDto.phoneNumber());
        }

        userRepository.save(user);

        return new UserProfileDto(
            user.getUsername(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName(),
            user.getPhoneNumber()
        );
    }

    public void changePassword(String userIdentifier, String currentPassword, String newPassword, String confirmPassword) {
        UserEntity user = userRepository.findByUsernameOrEmail(userIdentifier, userIdentifier)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        if (!newPassword.equals(confirmPassword)) {
            throw new IllegalArgumentException("New passwords do not match");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public void resetPassword(String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        
        String tempPassword = "Temp123!@#";
        user.setPassword(passwordEncoder.encode(tempPassword));
        userRepository.save(user);
        
        // TODO: Send email with temporary password
        // For now, just log it (in production, use email service)
        System.out.println("Temporary password for " + email + ": " + tempPassword);
    }
}
