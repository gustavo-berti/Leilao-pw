package com.github.gustavo_berti.back_end.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.github.gustavo_berti.back_end.models.Feedback;

public interface FeedbackRepository extends JpaRepository<Feedback, Long>{

    @Query("SELECT f FROM Feedback f WHERE f.target.id = :targetPersonID")
    public List<Feedback> findByTargetPersonId(Long targetPersonID);
        
}
