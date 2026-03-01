package com.naira.evalroi.enums;

import lombok.Getter;

@Getter
public enum RoleEnum {
    ADMIN("Has full access to everything"),
    USER("Standard user access"),
    MODERATOR("Can moderate content"),
    OWNER("Property owner access");

    private final String description;

    RoleEnum(String description) {
        this.description = description;
    }
}
