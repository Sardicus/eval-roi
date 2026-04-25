package com.naira.evalroi.dto.user;

import jakarta.validation.constraints.NotBlank;

public record ResetPasswordDto(
        @NotBlank String email
) {}
