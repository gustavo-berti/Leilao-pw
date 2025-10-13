package com.github.gustavo_berti.back_end.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.github.gustavo_berti.back_end.dto.CategoryListDTO;
import com.github.gustavo_berti.back_end.exception.NotFoundException;
import com.github.gustavo_berti.back_end.models.Category;
import com.github.gustavo_berti.back_end.repositories.CategoryRepository;

@Service
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private MessageSource messageSource;

    public Category insert(Category category) {
        return categoryRepository.save(category);
    }

    public Category update(Category category) {
        Category existingCategory = findById(category.getId());
        existingCategory.setName(category.getName());
        existingCategory.setObservation(category.getObservation());
        return categoryRepository.save(existingCategory);
    }

    public void delete(Long id) {
        Category category = findById(id);
        categoryRepository.delete(category);
    }

    public Page<CategoryListDTO> findAll(Pageable pageable) {
        return categoryRepository.findAll(pageable).map(c -> {
            CategoryListDTO dto = new CategoryListDTO();
            dto.setId(c.getId());
            dto.setName(c.getName());
            dto.setObservation(c.getObservation());
            return dto;
        });
    }

    public Page<CategoryListDTO> findByName(String name, Pageable page) {
        return categoryRepository.findByName(name, page).map(c -> {
            CategoryListDTO dto = new CategoryListDTO();
            dto.setId(c.getId());
            dto.setName(c.getName());
            dto.setObservation(c.getObservation());
            return dto;
        });
    }


    private Category findById(long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(messageSource.getMessage("category.notfound",
                        new Object[] { id }, LocaleContextHolder.getLocale())));
    }
}
