package com.wkrzywiec.medium.kanban.service;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;

import javax.annotation.PostConstruct;

import com.wkrzywiec.medium.kanban.model.Task;
import com.wkrzywiec.medium.kanban.repository.TaskRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    private final Path rootLocation = Paths.get("uploads");

    @Autowired
    private TaskRepository taskRepository;

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage", e);
        }
    }

    public String storeFile(MultipartFile file, Long taskId) {
        try {
            // Dateiname generieren (z. B. "taskId_originalFileName")
            String uploadedFileName = taskId + "_" + file.getOriginalFilename();
            Path desintationFile = this.rootLocation
                    .resolve(Paths.get(uploadedFileName))
                    .normalize()
                    .toAbsolutePath();
            
            // Existiert Datei schon?
            if (Files.exists(desintationFile)) {
                throw new RuntimeException("Datei existiert bereits: " + uploadedFileName);
            }

            // Datei kopieren
            Files.copy(file.getInputStream(), desintationFile, StandardCopyOption.REPLACE_EXISTING);


            // Task laden und Dateiname speichern
            Task task = taskRepository.findById(taskId)
                    .orElseThrow(() -> new RuntimeException("Task nicht gefunden: " + taskId));
            task.setUploadedFileName(uploadedFileName);
            taskRepository.save(task);

            return uploadedFileName;
        } catch (IOException e) {
            throw new RuntimeException("Fehler beim Speichern der Datei: " + e.getMessage(), e);
        }
    }

    public Resource loadFileAsResource(String uploadedFileName) {
        try {
            Path filePath = this.rootLocation.resolve(uploadedFileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("Datei konnte nicht gefunden oder nicht lesbar: " + uploadedFileName);
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Fehler beim Laden der Datei: " + e.getMessage(), e);
        }   
    }

        public void deleteFile(String uploadedFileName) {
        try {
            Path filePath = this.rootLocation.resolve(uploadedFileName).normalize();
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new RuntimeException("Fehler beim Löschen der Datei: " + uploadedFileName, e);
        }
    }
    
}
