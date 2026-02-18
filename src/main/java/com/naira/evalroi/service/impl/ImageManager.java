package com.naira.evalroi.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Service
public class ImageManager {
    String saveImage(MultipartFile imageFile){
        //TODO : implement file save to local file
        String originalFilename = imageFile.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : ".jpg";
        String filename = UUID.randomUUID().toString() + extension;
        return "/uploads/listings/" + filename;
    }

    void deleteImage(String imageUrl){
        //TODO : implement file delete from local file
    }
}
