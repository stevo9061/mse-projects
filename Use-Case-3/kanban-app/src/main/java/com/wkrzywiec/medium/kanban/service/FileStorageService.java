package com.wkrzywiec.medium.kanban.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;


public interface FileStorageService {

    String storeFile(MultipartFile file, Long taskId);
    Resource loadFileAsResource(String uploadedFileName);
    void deleteFile(String uploadedFileName);
    

}
