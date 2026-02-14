package com.naira.evalroi.dto;

import lombok.Getter;

public class Enums {

    @Getter
    public enum Role {
        ADMIN("Has full access to everything"),
        USER("Standard user access"),
        MODERATOR("Can moderate content");

        private final String description;

        Role(String description) {
            this.description = description;
        }

    }

    public enum LoginWith {
        USERNAME,
        EMAIL
    }
}
