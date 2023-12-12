package com.larsobist.TimelessTreasures.repository;

import com.larsobist.TimelessTreasures.models.Accessory;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface AccessoryRepository extends MongoRepository<Accessory, String> {
    // Custom query method to find accessories by their title.
    List<Accessory> findByTitleContaining(String title);

    // Custom query method to find accessories by their published status.
    List<Accessory> findByPublished(boolean published);
}
