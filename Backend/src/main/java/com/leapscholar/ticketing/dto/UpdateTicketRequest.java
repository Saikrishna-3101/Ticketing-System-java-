package com.leapscholar.ticketing.dto;

import com.leapscholar.ticketing.model.Priority;
import com.leapscholar.ticketing.model.TicketStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateTicketRequest {
    private String subject;
    private String description;
    private TicketStatus status;
    private Priority priority;
    private Long assignedToId;
    private Integer rating;
    private String feedback;
}



