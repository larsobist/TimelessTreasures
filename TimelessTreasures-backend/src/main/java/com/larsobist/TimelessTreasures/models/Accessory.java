package com.larsobist.TimelessTreasures.models;

import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@NoArgsConstructor
@Document(collection = "Accessory")
public class Accessory {
    @Id
    private String id;
    private String author;
    private boolean published;
    private boolean sold;

    private String buyer;
    private String title;
    private String description;
    private String category;
    private String gender;
    private String price;
    private String location;
    private String fileName;

    // Constructors
    public Accessory(String author, boolean published, boolean sold, String buyer, String title, String description, String category, String gender, String price, String location, String fileName) {
        this.author = author;
        this.published = published;
        this.sold = sold;
        this.buyer = buyer;
        this.title = title;
        this.description = description;
        this.category = category;
        this.gender = gender;
        this.price = price;
        this.location = location;
        this.fileName = fileName;
    }

    public String getId() {
        return id;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public boolean isPublished() {
        return published;
    }

    public void setPublished(boolean isPublished) {
        this.published = isPublished;
    }

    public boolean isSold() {
        return sold;
    }

    public void setSold(boolean isSold) {
        this.sold = isSold;
    }

    public String getBuyer() {
        return buyer;
    }

    public void setBuyer(String buyer) {
        this.buyer = buyer;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getFileName() {
        return fileName;
    }
    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    // toString() method for debugging and logging
    @Override
    public String toString() {
        return "Accessory [id=" + id + ", author=" + author + ", published=" + published + ", sold=" + sold + ", title=" + title + ", desc=" + description +   ", category=" + category + ", gender=" + gender + ", price=" + price + ", location=" + location + ", fileName=" + fileName + "]";
    }
}
