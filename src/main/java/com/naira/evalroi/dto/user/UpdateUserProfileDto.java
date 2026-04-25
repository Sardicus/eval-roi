package com.naira.evalroi.dto.user;

public record UpdateUserProfileDto(
        String username,
        String email,
        String firstName,
        String lastName,
        String phoneNumber
) {}
