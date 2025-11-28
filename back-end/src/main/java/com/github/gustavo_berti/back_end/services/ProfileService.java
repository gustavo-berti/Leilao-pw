package com.github.gustavo_berti.back_end.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.github.gustavo_berti.back_end.exception.NotFoundException;
import com.github.gustavo_berti.back_end.models.Profile;
import com.github.gustavo_berti.back_end.repositories.ProfileRepository;

@Service
public class ProfileService {
    @Autowired
    private ProfileRepository profileRepository;
    @Autowired
    private MessageSource messageSource;

    public Profile insert(Profile profile) {
        validateDuplicateProfileName(profile);
        return profileRepository.save(profile);
    }

    public Profile update(Profile profile) {
        Profile existingProfile = findById(profile.getId());
        existingProfile.setType(profile.getType());
        return profileRepository.save(existingProfile);
    }

    public void delete(Long id) {
        Profile profile = findById(id);
        profileRepository.delete(profile);
    }

    public Page<Profile> findAll(Pageable page) {
        return profileRepository.findAll(page);
    }

    public Profile findById(Long id) {
        return profileRepository.findById(id).orElseThrow(() -> new NotFoundException(
                messageSource.getMessage("profile.notfound", new Object[] { id }, LocaleContextHolder.getLocale())));
    }

    public Page<Profile> findByName(String profile, Pageable page) {
        return profileRepository.findByName(profile, page);
    }

    private void validateDuplicateProfileName(Profile profile) {
        Profile existingProfile = profileRepository.findByType(profile.getType());
        if (existingProfile != null && !existingProfile.getType().equals(profile.getType())) {
            throw new IllegalArgumentException(
                    messageSource.getMessage("profile.duplicateName", new Object[] { profile.getType() },
                            LocaleContextHolder.getLocale()));
        }
    }

}
