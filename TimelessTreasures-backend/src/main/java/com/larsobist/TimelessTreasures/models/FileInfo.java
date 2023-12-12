package com.larsobist.TimelessTreasures.models;

public class FileInfo {
    private String name;
    private String url;

    // Constructor to initialize the FileInfo object with a name and URL
    public FileInfo(String name, String url) {
        this.name = name;
        this.url = url;
    }

    // Getter method for retrieving the name of the file
    public String getName() {
        return this.name;
    }

    // Setter method to update the name of the file
    public void setName(String name) {
        this.name = name;
    }

    // Getter method for retrieving the URL of the file
    public String getUrl() {
        return this.url;
    }

    // Setter method to update the URL of the file
    public void setUrl(String url) {
        this.url = url;
    }
}
