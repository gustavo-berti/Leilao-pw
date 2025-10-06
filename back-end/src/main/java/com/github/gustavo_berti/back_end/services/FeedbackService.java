package com.github.gustavo_berti.back_end.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.github.gustavo_berti.back_end.exception.NotFoundException;
import com.github.gustavo_berti.back_end.models.Feedback;
import com.github.gustavo_berti.back_end.repositories.FeedbackRepository;

@Service
public class FeedbackService {
    @Autowired
    private FeedbackRepository feedbackRepository;
    @Autowired
    private MessageSource messageSource;

    public Feedback insert (Feedback feedback) {
        return feedbackRepository.save(feedback);
    }

    public Feedback update (Feedback feedback) {
        Feedback existingFeedback = findById(feedback.getId());
        existingFeedback.setComment(feedback.getComment());
        existingFeedback.setRating(feedback.getRating());
        return feedbackRepository.save(existingFeedback);
    }

    public void delete (Long id) {
        Feedback feedback = findById(id);
        feedbackRepository.delete(feedback);
    }

    public Page<Feedback> findAll (Pageable pageable) {
        return feedbackRepository.findAll(pageable);
    }

    public Feedback findById (Long id) {
        return feedbackRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(messageSource.getMessage("feedback.notfound",
                    new Object[] {id}, LocaleContextHolder.getLocale())));
    }

}
