package com.naira.evalroi.security;

import java.time.Duration;

public class SecurityConstants {
    public static final long JWT_EXPIRATION_TIME = Duration.ofMinutes(60).toMillis();
}