package com.larsobist.TimelessTreasures.service;

import java.nio.file.Path;
import java.util.stream.Stream;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface FilesStorageService {

    // Initialize the file storage service (e.g., set up directories or configurations).
    public void init();

    // Save the provided MultipartFile to the file storage location.
    // This method is used to store uploaded files in the system.
    public void save(MultipartFile file);

    // Load the file with the given filename from the file storage location and return it as a Resource.
    // This method is used to retrieve files from the system.
    public Resource load(String filename);

    // Delete all files from the file storage location.
    // This method is used to clear the file storage, typically during cleanup or reset operations.
    public void deleteAll();

    // Delete the file with the given filename from the file storage location.
    // This method is used to remove a specific file from the system.
    // Returns true if the file existed and was successfully deleted, false otherwise.
    public boolean delete(String filename);

    // Load all files from the file storage location and return them as a Stream of Path objects.
    // This method is used to list all files stored in the system.
    public Stream<Path> loadAll();
}
