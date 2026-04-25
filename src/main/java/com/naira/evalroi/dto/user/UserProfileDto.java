package com.naira.evalroi.dto.user;

public record UserProfileDto(
        String username,
        String email,
        String firstName,
        String lastName,
        String phoneNumber
){}
