package com.leapscholar.ticketing.service;

import com.leapscholar.ticketing.dto.CommentDTO;
import com.leapscholar.ticketing.dto.CreateCommentRequest;
import com.leapscholar.ticketing.model.Comment;
import com.leapscholar.ticketing.model.Role;
import com.leapscholar.ticketing.model.Ticket;
import com.leapscholar.ticketing.model.User;
import com.leapscholar.ticketing.repository.CommentRepository;
import com.leapscholar.ticketing.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CommentService {
    
    @Autowired
    private CommentRepository commentRepository;
    
    @Autowired
    private TicketRepository ticketRepository;
    
    @Autowired
    private EmailService emailService;
    
    public CommentDTO addComment(CreateCommentRequest request, User currentUser) {
        Ticket ticket = ticketRepository.findById(request.getTicketId())
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        
        // Check access: user can only comment on their own tickets unless admin/agent
        boolean isOwner = ticket.getCreatedBy().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);
        boolean isAgent = currentUser.getRole().equals(Role.SUPPORT_AGENT);
        boolean isAssigned = ticket.getAssignedTo() != null && 
                           ticket.getAssignedTo().getId().equals(currentUser.getId());
        
        if (!isAdmin && !isOwner && !(isAgent && isAssigned)) {
            throw new AccessDeniedException("You don't have permission to comment on this ticket");
        }
        
        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setTicket(ticket);
        comment.setUser(currentUser);
        
        Comment savedComment = commentRepository.save(comment);
        
        // Send email notification to other participants
        emailService.sendCommentNotification(savedComment);
        
        return convertToDTO(savedComment);
    }
    
    public List<CommentDTO> getTicketComments(Long ticketId, User currentUser) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        
        // Check access
        boolean isOwner = ticket.getCreatedBy().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);
        boolean isAgent = currentUser.getRole().equals(Role.SUPPORT_AGENT);
        boolean isAssigned = ticket.getAssignedTo() != null && 
                           ticket.getAssignedTo().getId().equals(currentUser.getId());
        
        if (!isAdmin && !isOwner && !(isAgent && isAssigned)) {
            throw new AccessDeniedException("You don't have access to this ticket's comments");
        }
        
        List<Comment> comments = commentRepository.findByTicketOrderByCreatedAtAsc(ticket);
        return comments.stream().map(this::convertToDTO).collect(Collectors.toList());
    }
    
    private CommentDTO convertToDTO(Comment comment) {
        CommentDTO dto = new CommentDTO();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setTicketId(comment.getTicket().getId());
        dto.setUserId(comment.getUser().getId());
        dto.setUsername(comment.getUser().getUsername());
        dto.setCreatedAt(comment.getCreatedAt());
        return dto;
    }
}



