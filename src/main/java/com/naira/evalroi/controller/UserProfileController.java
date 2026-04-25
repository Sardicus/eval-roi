package com.naira.evalroi.controller;

import com.naira.evalroi.dto.user.ChangePasswordDto;
import com.naira.evalroi.dto.user.ResetPasswordDto;
import com.naira.evalroi.dto.user.UpdateUserProfileDto;
import com.naira.evalroi.dto.user.UserProfileDto;
import com.naira.evalroi.service.impl.UserProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("userProfile")
public class UserProfileController {

    private final UserProfileService userProfileService;

    @GetMapping
    public UserProfileDto getUserProfile(@AuthenticationPrincipal UserDetails userDetails) {
        return userProfileService.getUserProfile(userDetails.getUsername());
    }

    @PutMapping
    public UserProfileDto updateUserProfile(@AuthenticationPrincipal UserDetails userDetails,
                                            @RequestBody @Valid UpdateUserProfileDto updateDto) {
        return userProfileService.updateUserProfile(userDetails.getUsername(), updateDto);
    }

    @PostMapping("/changePassword")
    public ResponseEntity<String> changePassword(@AuthenticationPrincipal UserDetails userDetails,
                                                 @RequestBody @Valid ChangePasswordDto changePasswordDto) {
        userProfileService.changePassword(
            userDetails.getUsername(),
            changePasswordDto.currentPassword(),
            changePasswordDto.newPassword(),
            changePasswordDto.confirmPassword()
        );
        return ResponseEntity.ok("Password changed successfully");
    }

    @PostMapping("/resetPassword")
    public ResponseEntity<String> resetPassword(@RequestBody @Valid ResetPasswordDto resetPasswordDto) {
        userProfileService.resetPassword(resetPasswordDto.email());
        return ResponseEntity.ok("Password reset email sent");
    }
}
