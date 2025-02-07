package com.moneybridge.controller.advice;

import java.util.Map;
import java.util.NoSuchElementException;

import com.moneybridge.util.CustomJWTException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * CustomControllerAdvice
 */
@RestControllerAdvice
public class CustomControllerAdvice {


    @ExceptionHandler(NoSuchElementException.class)
    protected ResponseEntity<?> notExist(NoSuchElementException e) {

        String msg = e.getMessage();

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("msg", msg));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    protected ResponseEntity<?> handleIllegalArgumentException(MethodArgumentNotValidException e) {

        String msg = e.getMessage();

        return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(Map.of("msg", msg));
    }

    @ExceptionHandler(CustomJWTException.class)
    protected ResponseEntity<?> handleJWTException(CustomJWTException e) {

        String msg = e.getMessage();

        return ResponseEntity.ok().body(Map.of("error", msg));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGenericException(Exception ex) {
        // 에러 로그 출력
        ex.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + ex.getMessage());
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<String> handleIllegalStateException(IllegalStateException ex) {
        // 특정 예외 처리
        ex.printStackTrace();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Illegal State: " + ex.getMessage());
    }
}