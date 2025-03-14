package com.wkrzywiec.medium.kanban.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.core.io.Resource;

import com.wkrzywiec.medium.kanban.service.FileStorageService;

@RestController
@RequestMapping("/task-upload")
@CrossOrigin(origins = "http://localhost:4200")
public class TaskFileController {

    private final FileStorageService fileStorageService;

    @Autowired
    public TaskFileController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }


    // ========= UPLOAD ========
    @PostMapping(
            value = "/{taskId}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadFile(@PathVariable Long taskId, 
                                             @RequestParam("file") MultipartFile file) {
        try {
            String storedFilename = fileStorageService.storeFile(file, taskId);
            return ResponseEntity.ok(storedFilename);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    } 
    
    // =========== ANZEIGEN/HERUNTERLADEN ===========
    @GetMapping("/{taskId}/files/{filename}")
    public ResponseEntity<Resource> getFile(@PathVariable Long taskId,
                                           @PathVariable String filename) {
        // Optional Prüfung, ob Datei zu taskId passt
        Resource resource = fileStorageService.loadFileAsResource(filename);

        // Content-Disposition, damit der Browser einen Download-Dialog anzeigt
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    // =========== LÖSCHEN ===========
    @DeleteMapping("/{taskId}/files/{filename}")
    public ResponseEntity<Void> deleteFile(@PathVariable Long taskId,
                                        @PathVariable String filename) {
        // Optional prüfen, ob Datei zu taskId gehört
        fileStorageService.deleteFile(filename);
        return ResponseEntity.noContent().build();
    }
}
