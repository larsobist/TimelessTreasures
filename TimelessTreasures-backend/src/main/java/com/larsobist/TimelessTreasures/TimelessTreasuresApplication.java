package com.larsobist.TimelessTreasures;

import com.larsobist.TimelessTreasures.service.FilesStorageService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


import org.springframework.boot.CommandLineRunner;

import javax.annotation.Resource;

@SpringBootApplication
public class TimelessTreasuresApplication implements CommandLineRunner{

    @Resource
    FilesStorageService storageService;
    public static void main(String[] args) {
        SpringApplication.run(TimelessTreasuresApplication.class, args);
    }
    @Override
    public void run(String... arg) throws Exception {
        storageService.init();
    }
}
