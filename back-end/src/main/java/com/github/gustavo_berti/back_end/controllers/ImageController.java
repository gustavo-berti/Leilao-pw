package com.github.gustavo_berti.back_end.controllers;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.github.gustavo_berti.back_end.models.Image;
import com.github.gustavo_berti.back_end.services.ImageService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/images")
public class ImageController {
    @Autowired
    private ImageService imageService;

    @GetMapping
    public ResponseEntity<Page<Image>> findAll(Pageable pageable) {
        return ResponseEntity.ok(imageService.findAll(pageable));
    }

    @GetMapping("/auction/{auctionId}")
    public ResponseEntity<List<Image>> findByAuctionId(@PathVariable("auctionId") Long auctionId) {
        return ResponseEntity.ok(imageService.findByAuctionId(auctionId));
    }

    @GetMapping("/file/{filename}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        try {
            Path filePath = Paths.get("uploads/images/").resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    public ResponseEntity<Image> insert(@Valid @RequestBody Image image) {
        return ResponseEntity.ok(imageService.insert(image));
    }

    @PostMapping("/upload")
    public ResponseEntity<List<Image>> uploadImages(@RequestParam("auctionId") Long auctionId,
            @RequestParam("images") MultipartFile[] images) {
        return ResponseEntity.ok(imageService.uploadImages(auctionId, images));
    }

    @PutMapping
    public ResponseEntity<Image> update(@Valid @RequestBody Image image) {
        return ResponseEntity.ok(imageService.update(image));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable("id") Long id) {
        imageService.delete(id);
        return ResponseEntity.ok("Image deleted successfully");
    }
}
