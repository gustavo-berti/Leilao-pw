package com.github.gustavo_berti.back_end.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender javaMail;
    @Autowired
    private TemplateEngine templateEngine;

    @Async
    public void sendSimpleMail(String to, String subject, String message) {
        SimpleMailMessage simpleMail = new SimpleMailMessage();
        simpleMail.setTo(to);
        simpleMail.setSubject(subject);
        simpleMail.setText(message);
        javaMail.send(simpleMail);
    }

    @Async
    public void emailTemplate(String to, String subject, String templateName, Context context){
        String process = templateEngine.process(templateName, context);
        MimeMessage message = javaMail.createMimeMessage();
        MimeMessageHelper helper;
        try{
            helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(process, true);
            javaMail.send(message);
        } catch (MessagingException e){
            e.printStackTrace();
        }
    }
}
