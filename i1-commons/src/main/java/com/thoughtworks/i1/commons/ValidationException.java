package com.thoughtworks.i1.commons;

public class ValidationException extends RuntimeException {
    public ValidationException(String message, Throwable e) {
        super(message, e);
    }

    public ValidationException(String message) {
        super(message);
    }
}
