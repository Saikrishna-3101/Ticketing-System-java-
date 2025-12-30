package com.leapscholar.ticketing.dto;

import com.leapscholar.ticketing.model.Priority;
import com.leapscholar.ticketing.model.TicketStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketDTO {
    private Long id;
    private String subject;
    private String description;
    private TicketStatus status;
    private Priority priority;
    private Long createdById;
    private String createdByUsername;
    private Long assignedToId;
    private String assignedToUsername;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;
    private LocalDateTime closedAt;
    private Integer rating;
    private String feedback;
}



