package com.larsobist.TimelessTreasures.exception;

import com.larsobist.TimelessTreasures.payload.response.MessageResponse;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class FileUploadExceptionAdvice extends ResponseEntityExceptionHandler {

    // Exception handler for MaxUploadSizeExceededException
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<MessageResponse> handleMaxSizeException(MaxUploadSizeExceededException exc) {
        // When the maximum upload size is exceeded, return 417 Expectation Failed status
        // with a custom message indicating that the file is too large.
        return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new MessageResponse("File too large!"));
    }
}