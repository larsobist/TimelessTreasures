package com.larsobist.TimelessTreasures.payload.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MessageResponse {
    private String message;
    // Represents the message to be sent in the response.

    // Constructor to create a MessageResponse object with the provided message
    public MessageResponse(String message) {
        this.message = message;
    }

    // Getter method for retrieving the message
    public String getMessage() {
        return message;
    }

    // Setter method to update the message
    public void setMessage(String message) {
        this.message = message;
    }
}
