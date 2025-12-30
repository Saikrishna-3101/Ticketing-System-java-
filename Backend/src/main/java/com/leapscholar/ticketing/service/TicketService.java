package com.leapscholar.ticketing.service;

import com.leapscholar.ticketing.dto.*;
import com.leapscholar.ticketing.model.*;
import com.leapscholar.ticketing.repository.TicketRepository;
import com.leapscholar.ticketing.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import com.leapscholar.ticketing.model.TicketStatus;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TicketService {
    
    @Autowired
    private TicketRepository ticketRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private EmailService emailService;
    
    public TicketDTO createTicket(CreateTicketRequest request, User currentUser) {
        Ticket ticket = new Ticket();
        ticket.setSubject(request.getSubject());
        ticket.setDescription(request.getDescription());
        ticket.setPriority(request.getPriority());
        ticket.setCreatedBy(currentUser);
        ticket.setStatus(TicketStatus.OPEN);
        
        Ticket savedTicket = ticketRepository.save(ticket);
        
        // Send email notification
        emailService.sendTicketCreatedNotification(savedTicket);
        
        return convertToDTO(savedTicket);
    }
    
    public List<TicketDTO> getUserTickets(User currentUser) {
        List<Ticket> tickets = ticketRepository.findByCreatedBy(currentUser);
        return tickets.stream().map(this::convertToDTO).collect(Collectors.toList());
    }
    
    public List<TicketDTO> getAssignedTickets(User currentUser) {
        List<Ticket> tickets = ticketRepository.findByAssignedTo(currentUser);
        return tickets.stream().map(this::convertToDTO).collect(Collectors.toList());
    }
    
    public List<TicketDTO> getAllTickets() {
        List<Ticket> tickets = ticketRepository.findAll();
        return tickets.stream().map(this::convertToDTO).collect(Collectors.toList());
    }
    
    public TicketDTO getTicketById(Long id, User currentUser) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        
        // Check access: user can only view their own tickets unless admin/agent
        if (!currentUser.getRole().equals(Role.ADMIN) && 
            !currentUser.getRole().equals(Role.SUPPORT_AGENT) &&
            !ticket.getCreatedBy().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You don't have access to this ticket");
        }
        
        return convertToDTO(ticket);
    }
    
    public TicketDTO updateTicket(Long id, UpdateTicketRequest request, User currentUser) {

    Ticket ticket = ticketRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Ticket not found"));

    boolean isAdmin = currentUser.getRole().name().equals("ADMIN");
    boolean isAgent = currentUser.getRole().name().equals("SUPPORT_AGENT");
    boolean isOwner = ticket.getCreatedBy().getId().equals(currentUser.getId());

    if (!isAdmin && !isAgent && !isOwner) {
        throw new RuntimeException("Not authorized to update this ticket");
    }

    if (request.getStatus() != null) {

        if (ticket.getStatus() == TicketStatus.CLOSED) {
            throw new RuntimeException("Closed tickets cannot be modified");
        }

        ticket.setStatus(request.getStatus());

        if (request.getStatus() == TicketStatus.RESOLVED) {
            ticket.setResolvedAt(LocalDateTime.now());
        }

        if (request.getStatus() == TicketStatus.CLOSED) {
            ticket.setClosedAt(LocalDateTime.now());
        }
    }

    if (request.getSubject() != null) {
        ticket.setSubject(request.getSubject());
    }

    if (request.getDescription() != null) {
        ticket.setDescription(request.getDescription());
    }

    if (request.getPriority() != null) {
        ticket.setPriority(request.getPriority());
    }

    if (request.getAssignedToId() != null && (isAdmin || isAgent)) {
        User assignee = userRepository.findById(request.getAssignedToId())
                .orElseThrow(() -> new RuntimeException("Assignee not found"));
        ticket.setAssignedTo(assignee);
    }

    ticket.setUpdatedAt(LocalDateTime.now());

    Ticket saved = ticketRepository.save(ticket);
    return convertToDTO(saved);
}

    public List<TicketDTO> searchTickets(String search, TicketStatus status, 
                                         Priority priority, Long assignedToId) {
        List<Ticket> tickets = ticketRepository.searchTickets(
            status, priority, assignedToId, search != null ? search : ""
        );
        return tickets.stream().map(this::convertToDTO).collect(Collectors.toList());
    }
    
    private TicketDTO convertToDTO(Ticket ticket) {
        TicketDTO dto = new TicketDTO();
        dto.setId(ticket.getId());
        dto.setSubject(ticket.getSubject());
        dto.setDescription(ticket.getDescription());
        dto.setStatus(ticket.getStatus());
        dto.setPriority(ticket.getPriority());
        dto.setCreatedById(ticket.getCreatedBy().getId());
        dto.setCreatedByUsername(ticket.getCreatedBy().getUsername());
        if (ticket.getAssignedTo() != null) {
            dto.setAssignedToId(ticket.getAssignedTo().getId());
            dto.setAssignedToUsername(ticket.getAssignedTo().getUsername());
        }
        dto.setCreatedAt(ticket.getCreatedAt());
        dto.setUpdatedAt(ticket.getUpdatedAt());
        dto.setResolvedAt(ticket.getResolvedAt());
        dto.setClosedAt(ticket.getClosedAt());
        dto.setRating(ticket.getRating());
        dto.setFeedback(ticket.getFeedback());
        return dto;
    }
}



