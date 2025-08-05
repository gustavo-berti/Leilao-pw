package com.github.gustavo_berti.back_end.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.github.gustavo_berti.back_end.exception.NotFoundException;
import com.github.gustavo_berti.back_end.models.Image;
import com.github.gustavo_berti.back_end.repositories.ImageRepository;

@Service
public class ImageService {
    @Autowired
    private ImageRepository imageRepository;
    @Autowired
    private MessageSource messageSource;

    public Image insert(Image image){
        return imageRepository.save(image);
    }

    public Image update(Image image) {
        Image existingImage = findById(image.getId());
        existingImage.setImageName(image.getImageName());
        return imageRepository.save(existingImage);
    }

    public void delete(Long id) {
        Image image = findById(id);
        imageRepository.delete(image);
    }

    public Page<Image> findAll(Pageable pageable) {
        return imageRepository.findAll(pageable);
    }

    public Image findById(Long id) {
        return imageRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(messageSource.getMessage("image.notfound", 
                    new Object[]{id}, LocaleContextHolder.getLocale())));
    }
}
