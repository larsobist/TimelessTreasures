package com.larsobist.TimelessTreasures.controllers;

import com.larsobist.TimelessTreasures.models.Accessory;
import com.larsobist.TimelessTreasures.repository.AccessoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:8081")
@RestController
@RequestMapping("/api")
public class AccessoryController {

    @Autowired
    AccessoryRepository accessoryRepository;

    // Retrieve all accessories or filter by title
    @GetMapping("/accessories")
    public ResponseEntity<List<Accessory>> getAllAccessories(@RequestParam(required = false) String title) {
        try {
            List<Accessory> accessories = new ArrayList<Accessory>();

            if (title == null)
                // If title is not provided, retrieve all accessories
                accessoryRepository.findAll().forEach(accessories::add);
            else
                // If title is provided, find accessories by title containing the specified keyword
                accessoryRepository.findByTitleContaining(title).forEach(accessories::add);

            if (accessories.isEmpty()) {
                // If no accessories found, return 204 No Content status
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            // Return the list of accessories with 200 OK status
            return new ResponseEntity<>(accessories, HttpStatus.OK);
        } catch (Exception e) {
            // If an exception occurs, return 500 Internal Server Error status
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Retrieve a specific accessory by its ID
    @GetMapping("/accessories/{id}")
    public ResponseEntity<Accessory> getAccessoryById(@PathVariable("id") String id) {
        Optional<Accessory> AccessoryData = accessoryRepository.findById(id);

        if (AccessoryData.isPresent()) {
            // If accessory is found, return it with 200 OK status
            return new ResponseEntity<>(AccessoryData.get(), HttpStatus.OK);
        } else {
            // If accessory is not found, return 404 Not Found status
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Create a new accessory
    @PostMapping("/accessories")
    public ResponseEntity<Accessory> createAccessory(@RequestBody Accessory accessory) {
        try {
            // Save the new accessory to the repository and return it with 201 Created status
            Accessory _accessory = accessoryRepository.save(new Accessory(accessory.getAuthor(), false, false, accessory.getBuyer(), accessory.getTitle(), accessory.getDescription(), accessory.getCategory(), accessory.getGender(), accessory.getPrice(), accessory.getLocation(), accessory.getFileName()));
            return new ResponseEntity<>(_accessory, HttpStatus.CREATED);
        } catch (Exception e) {
            // If an exception occurs during creation, return 500 Internal Server Error status
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update an existing accessory by its ID
    @PutMapping("/accessories/{id}")
    public ResponseEntity<Accessory> updateAccessory(@PathVariable("id") String id, @RequestBody Accessory accessory) {
        Optional<Accessory> AccessoryData = accessoryRepository.findById(id);

        if (AccessoryData.isPresent()) {
            // If the accessory is found, update its attributes and return it with 200 OK status
            Accessory _accessory = AccessoryData.get();
            _accessory.setAuthor(accessory.getAuthor());
            _accessory.setPublished(accessory.isPublished());
            _accessory.setSold(accessory.isSold());
            _accessory.setBuyer(accessory.getBuyer());
            _accessory.setTitle(accessory.getTitle());
            _accessory.setDescription(accessory.getDescription());
            _accessory.setCategory(accessory.getCategory());
            _accessory.setGender(accessory.getGender());
            _accessory.setPrice(accessory.getPrice());
            _accessory.setLocation(accessory.getLocation());
            _accessory.setFileName(accessory.getFileName());
            return new ResponseEntity<>(accessoryRepository.save(_accessory), HttpStatus.OK);
        } else {
            // If accessory is not found, return 404 Not Found status
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Delete a specific accessory by its ID
    @DeleteMapping("/accessories/{id}")
    public ResponseEntity<HttpStatus> deleteAccessory(@PathVariable("id") String id) {
        try {
            // Delete the accessory with the specified ID and return 204 No Content status
            accessoryRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            // If an exception occurs during deletion, return 500 Internal Server Error status
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Delete all accessories
    @DeleteMapping("/accessories")
    public ResponseEntity<HttpStatus> deleteAllAccessories() {
        try {
            // Delete all accessories from the repository and return 204 No Content status
            accessoryRepository.deleteAll();
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            // If an exception occurs during deletion, return 500 Internal Server Error status
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Retrieve all published accessories
    @GetMapping("/accessories/published")
    public ResponseEntity<List<Accessory>> findByPublished() {
        try {
            // Find all published accessories and return them with 200 OK status
            List<Accessory> accessories = accessoryRepository.findByPublished(true);

            if (accessories.isEmpty()) {
                // If no published accessories found, return 204 No Content status
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            // Return the list of published accessories with 200 OK status
            return new ResponseEntity<>(accessories, HttpStatus.OK);
        } catch (Exception e) {
            // If an exception occurs during retrieval, return 500 Internal Server Error status
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}