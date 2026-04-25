package com.naira.evalroi.dto.user;

import jakarta.validation.constraints.NotBlank;

public record ChangePasswordDto(
        @NotBlank String currentPassword,
        @NotBlank String newPassword,
        @NotBlank String confirmPassword
) {}
