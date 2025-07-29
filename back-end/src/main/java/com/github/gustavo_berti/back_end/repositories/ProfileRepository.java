package com.github.gustavo_berti.back_end.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.github.gustavo_berti.back_end.models.Profile;

public interface ProfileRepository extends JpaRepository<Profile, Long>{

    @Query("from Profile p where p.type =:type")
    public Page<Profile> findByType(@Param("type") String type, Pageable pageable);
}
