package com.leapscholar.ticketing.service;

import com.leapscholar.ticketing.model.Comment;
import com.leapscholar.ticketing.model.Ticket;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    @Autowired(required = false)
    private JavaMailSender mailSender;
    
    @Value("${spring.mail.username:}")
    private String fromEmail;
    
    public void sendTicketCreatedNotification(Ticket ticket) {
        if (mailSender == null || fromEmail.isEmpty()) {
            // Email not configured, skip
            return;
        }
        
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(ticket.getCreatedBy().getEmail());
            message.setSubject("Ticket #" + ticket.getId() + " Created: " + ticket.getSubject());
            message.setText("Your ticket has been created successfully.\n\n" +
                          "Ticket ID: #" + ticket.getId() + "\n" +
                          "Subject: " + ticket.getSubject() + "\n" +
                          "Priority: " + ticket.getPriority() + "\n" +
                          "Status: " + ticket.getStatus() + "\n\n" +
                          "Description:\n" + ticket.getDescription());
            mailSender.send(message);
        } catch (Exception e) {
            // Log error but don't fail the request
            System.err.println("Failed to send email notification: " + e.getMessage());
        }
    }
    
    public void sendTicketAssignedNotification(Ticket ticket) {
        if (mailSender == null || fromEmail.isEmpty() || ticket.getAssignedTo() == null) {
            return;
        }
        
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(ticket.getAssignedTo().getEmail());
            message.setSubject("Ticket #" + ticket.getId() + " Assigned to You");
            message.setText("You have been assigned to a new ticket.\n\n" +
                          "Ticket ID: #" + ticket.getId() + "\n" +
                          "Subject: " + ticket.getSubject() + "\n" +
                          "Priority: " + ticket.getPriority() + "\n" +
                          "Created by: " + ticket.getCreatedBy().getUsername());
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email notification: " + e.getMessage());
        }
    }
    
    public void sendTicketResolvedNotification(Ticket ticket) {
        if (mailSender == null || fromEmail.isEmpty()) {
            return;
        }
        
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(ticket.getCreatedBy().getEmail());
            message.setSubject("Ticket #" + ticket.getId() + " Resolved");
            message.setText("Your ticket has been resolved.\n\n" +
                          "Ticket ID: #" + ticket.getId() + "\n" +
                          "Subject: " + ticket.getSubject());
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email notification: " + e.getMessage());
        }
    }
    
    public void sendCommentNotification(Comment comment) {
        if (mailSender == null || fromEmail.isEmpty()) {
            return;
        }
        
        Ticket ticket = comment.getTicket();
        
        try {
            // Notify ticket creator if comment is not from them
            if (!ticket.getCreatedBy().getId().equals(comment.getUser().getId())) {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(fromEmail);
                message.setTo(ticket.getCreatedBy().getEmail());
                message.setSubject("New Comment on Ticket #" + ticket.getId());
                message.setText("A new comment has been added to your ticket.\n\n" +
                              "Ticket ID: #" + ticket.getId() + "\n" +
                              "Subject: " + ticket.getSubject() + "\n" +
                              "Comment by: " + comment.getUser().getUsername() + "\n\n" +
                              "Comment:\n" + comment.getContent());
                mailSender.send(message);
            }
            
            // Notify assigned agent if comment is not from them and they exist
            if (ticket.getAssignedTo() != null && 
                !ticket.getAssignedTo().getId().equals(comment.getUser().getId())) {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(fromEmail);
                message.setTo(ticket.getAssignedTo().getEmail());
                message.setSubject("New Comment on Ticket #" + ticket.getId());
                message.setText("A new comment has been added to a ticket assigned to you.\n\n" +
                              "Ticket ID: #" + ticket.getId() + "\n" +
                              "Subject: " + ticket.getSubject() + "\n" +
                              "Comment by: " + comment.getUser().getUsername() + "\n\n" +
                              "Comment:\n" + comment.getContent());
                mailSender.send(message);
            }
        } catch (Exception e) {
            System.err.println("Failed to send email notification: " + e.getMessage());
        }
    }
}



