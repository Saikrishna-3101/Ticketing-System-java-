package com.leapscholar.ticketing.controller;

import com.leapscholar.ticketing.dto.*;
import com.leapscholar.ticketing.model.Priority;
import com.leapscholar.ticketing.model.TicketStatus;
import com.leapscholar.ticketing.model.User;
import com.leapscholar.ticketing.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    /* ---------------- CREATE ---------------- */

    @PostMapping
    public ResponseEntity<TicketDTO> createTicket(
            @Valid @RequestBody CreateTicketRequest request,
            Authentication authentication
    ) {
        User currentUser = (User) authentication.getPrincipal();
        TicketDTO ticket = ticketService.createTicket(request, currentUser);
        return ResponseEntity.ok(ticket);
    }

    /* ---------------- READ ---------------- */

    @GetMapping("/my-tickets")
    public ResponseEntity<List<TicketDTO>> getMyTickets(Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        return ResponseEntity.ok(ticketService.getUserTickets(currentUser));
    }

    @GetMapping("/assigned")
    public ResponseEntity<List<TicketDTO>> getAssignedTickets(Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        return ResponseEntity.ok(ticketService.getAssignedTickets(currentUser));
    }

    @GetMapping
    public ResponseEntity<List<TicketDTO>> getAllTickets(Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();

        if (currentUser.getRole().name().equals("ADMIN") ||
            currentUser.getRole().name().equals("SUPPORT_AGENT")) {
            return ResponseEntity.ok(ticketService.getAllTickets());
        }

        return ResponseEntity.ok(ticketService.getUserTickets(currentUser));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketDTO> getTicketById(
            @PathVariable Long id,
            Authentication authentication
    ) {
        User currentUser = (User) authentication.getPrincipal();
        return ResponseEntity.ok(ticketService.getTicketById(id, currentUser));
    }

    /* ---------------- UPDATE (FULL) ---------------- */

    @PutMapping("/{id}")
    public ResponseEntity<TicketDTO> updateTicket(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTicketRequest request,
            Authentication authentication
    ) {
        User currentUser = (User) authentication.getPrincipal();
        TicketDTO ticket = ticketService.updateTicket(id, request, currentUser);
        return ResponseEntity.ok(ticket);
    }

    /* ---------------- UPDATE (STATUS ONLY) ---------------- */
    /* ✅ NEW ENDPOINT – SAFE & CLEAN */

    @PatchMapping("/{id}/status")
    public ResponseEntity<TicketDTO> updateTicketStatus(
            @PathVariable Long id,
            @RequestParam TicketStatus status,
            Authentication authentication
    ) {
        User currentUser = (User) authentication.getPrincipal();

        UpdateTicketRequest request = new UpdateTicketRequest();
        request.setStatus(status);

        TicketDTO updatedTicket = ticketService.updateTicket(id, request, currentUser);
        return ResponseEntity.ok(updatedTicket);
    }

    /* ---------------- SEARCH ---------------- */

    @GetMapping("/search")
    public ResponseEntity<List<TicketDTO>> searchTickets(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) TicketStatus status,
            @RequestParam(required = false) Priority priority,
            @RequestParam(required = false) Long assignedToId,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                ticketService.searchTickets(search, status, priority, assignedToId)
        );
    }
}
