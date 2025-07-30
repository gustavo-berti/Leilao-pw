package com.github.gustavo_berti.back_end.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.github.gustavo_berti.back_end.models.Category;

public interface CategoryRepository extends JpaRepository<Category, Long>{

}