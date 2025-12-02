package com.github.gustavo_berti.back_end.services;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.github.gustavo_berti.back_end.exception.NotFoundException;
import com.github.gustavo_berti.back_end.models.Image;
import com.github.gustavo_berti.back_end.repositories.AuctionRepository;
import com.github.gustavo_berti.back_end.repositories.ImageRepository;

@Service
public class ImageService {
    @Autowired
    private ImageRepository imageRepository;
    @Autowired
    private AuctionRepository auctionRepository;
    @Autowired
    private MessageSource messageSource;

    private final String uploadDir = "uploads/images/";

    public Image insert(Image image) {
        return imageRepository.save(image);
    }

    public List<Image> uploadImages(Long auctionId, MultipartFile[] images) {
        List<Image> savedImages = new ArrayList<>();
        try {
            Files.createDirectories(Paths.get(uploadDir));
        } catch (Exception e) {
            throw new RuntimeException("Falha ao criar diretório de upload", e);
        }

        for (MultipartFile file : images) {
            try {
                String originalFilename = file.getOriginalFilename();
                if (originalFilename == null || !originalFilename.contains(".")) {
                    throw new RuntimeException("Nome de arquivo inválido");
                }
                String extension = originalFilename.substring(originalFilename.lastIndexOf('.'));
                String uniqueFilename = UUID.randomUUID().toString() + extension;
                Path filePath = Paths.get(uploadDir + uniqueFilename);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                Image image = new Image();
                image.setAuction(auctionRepository.findById(auctionId)
                        .orElseThrow(() -> new RuntimeException("Leilão não encontrado")));
                image.setImageName(uniqueFilename);
                image.setDateHour(new Date());
                savedImages.add(imageRepository.save(image));
            } catch (IOException e) {
                throw new RuntimeException("Erro ao salvar arquivo: " + file.getOriginalFilename(), e);
            } catch (Exception e) {
                throw new RuntimeException("Falha ao fazer upload da imagem: " + file.getOriginalFilename(), e);
            }
        }
        return savedImages;
    }

    public Image update(Image image) {
        Image existingImage = findById(image.getId());
        existingImage.setImageName(image.getImageName());
        return imageRepository.save(existingImage);
    }

    public void delete(Long id) {
        Image image = findById(id);
        imageRepository.delete(image);
        try {
            Path filePath = Paths.get(uploadDir + image.getImageName());
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new RuntimeException("Erro ao deletar arquivo de imagem: " + image.getImageName(), e);
        }
    }

    public Page<Image> findAll(Pageable pageable) {
        return imageRepository.findAll(pageable);
    }

    public List<Image> findByAuctionId(Long auctionId) {
        return imageRepository.findByAuctionId(auctionId);
    }

    public Image findById(Long id) {
        return imageRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(messageSource.getMessage("image.notfound",
                        new Object[] { id }, LocaleContextHolder.getLocale())));
    }
}
