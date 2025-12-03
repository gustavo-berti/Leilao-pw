package com.github.gustavo_berti.back_end.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.github.gustavo_berti.back_end.dto.FeedbackCreateDTO;
import com.github.gustavo_berti.back_end.dto.FeedbackListDTO;
import com.github.gustavo_berti.back_end.exception.NotFoundException;
import com.github.gustavo_berti.back_end.models.Feedback;
import com.github.gustavo_berti.back_end.models.Person;
import com.github.gustavo_berti.back_end.repositories.FeedbackRepository;
import com.github.gustavo_berti.back_end.repositories.PersonRepository;

@Service
public class FeedbackService {
    @Autowired
    private FeedbackRepository feedbackRepository;
    @Autowired
    private MessageSource messageSource;
    @Autowired
    private PersonRepository personRepository;

    public Feedback insert(FeedbackCreateDTO feedback) {
        Feedback newFeedback = new Feedback();
        newFeedback.setComment(feedback.getComment());
        newFeedback.setRating(feedback.getRating());
        newFeedback.setDateHour(feedback.getDateHour());
        newFeedback.setAuthor(personRepository.findByEmail(feedback.getAuthorEmail())
                .orElseThrow(() -> new NotFoundException(messageSource.getMessage("person.notfound", 
                    new Object[]{ feedback.getAuthorEmail() }, LocaleContextHolder.getLocale()))));
        newFeedback.setTarget(personRepository.findByEmail(feedback.getTargetPersonEmail())
                .orElseThrow(() -> new NotFoundException(messageSource.getMessage("person.notfound", 
                    new Object[]{ feedback.getTargetPersonEmail() }, LocaleContextHolder.getLocale()))));
        return feedbackRepository.save(newFeedback);
    }

    public Feedback update(Feedback feedback) {
        Feedback existingFeedback = findById(feedback.getId());
        existingFeedback.setComment(feedback.getComment());
        existingFeedback.setRating(feedback.getRating());
        return feedbackRepository.save(existingFeedback);
    }

    public void delete(Long id) {
        Feedback feedback = findById(id);
        feedbackRepository.delete(feedback);
    }

    public Page<Feedback> findAll(Pageable pageable) {
        return feedbackRepository.findAll(pageable);
    }

    public Feedback findById(Long id) {
        return feedbackRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(messageSource.getMessage("feedback.notfound",
                        new Object[] { id }, LocaleContextHolder.getLocale())));
    }

    public List<FeedbackListDTO> findByTargetPersonEmail(String targetPersonEmail) {
        Optional<Person> targetPerson = personRepository.findByEmail(targetPersonEmail);
        return feedbackRepository.findByTargetPersonId(targetPerson.get().getId()).stream().map(t -> {
            FeedbackListDTO dto = new FeedbackListDTO();
            dto.setId(t.getId());
            dto.setComment(t.getComment());
            dto.setRating(t.getRating());
            dto.setPersonName(t.getAuthor().getName());
            dto.setTargetPersonName(t.getTarget().getName());
            dto.setDateHour(t.getDateHour());
            return dto;
        }).toList();
    }

}
