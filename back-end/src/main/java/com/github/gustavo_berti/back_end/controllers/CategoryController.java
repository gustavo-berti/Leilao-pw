package com.github.gustavo_berti.back_end.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

import com.github.gustavo_berti.back_end.dto.CategoryListDTO;
import com.github.gustavo_berti.back_end.models.Category;
import com.github.gustavo_berti.back_end.services.CategoryService;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public ResponseEntity<Page<CategoryListDTO>> findAll(Pageable page){
        return ResponseEntity.ok(categoryService.findAll(page));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<CategoryListDTO>> findByName(@RequestParam(value="name",required = false) String name, Pageable page){
        if(name == null || name.isEmpty()){
            return ResponseEntity.ok(categoryService.findAll(page));
        }
        return ResponseEntity.ok(categoryService.findByName(name, page));
    }

    @PostMapping
    public ResponseEntity<Category> insert(@RequestBody Category category){
        return ResponseEntity.ok(categoryService.insert(category));
    }

    @PutMapping
    public ResponseEntity<Category> update(@RequestBody Category category){
        return ResponseEntity.ok(categoryService.update(category));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable("id")long id){
        categoryService.delete(id);
        return ResponseEntity.ok("Category deleted successfully");
    }

}
