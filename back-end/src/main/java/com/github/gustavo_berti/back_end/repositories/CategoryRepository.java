package com.github.gustavo_berti.back_end.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.github.gustavo_berti.back_end.models.Category;

public interface CategoryRepository extends JpaRepository<Category, Long>{

    @Query("from Category c where c.name like %:name%")
    public Page<Category> findByName(@Param("name") String name, Pageable pageable);

}