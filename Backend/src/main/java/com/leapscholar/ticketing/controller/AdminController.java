package com.leapscholar.ticketing.controller;

import com.leapscholar.ticketing.dto.CreateUserRequest;
import com.leapscholar.ticketing.dto.TicketDTO;
import com.leapscholar.ticketing.dto.UpdateTicketRequest;
import com.leapscholar.ticketing.dto.UserDTO;
import com.leapscholar.ticketing.model.Role;
import com.leapscholar.ticketing.model.User;
import com.leapscholar.ticketing.service.AdminService;
import com.leapscholar.ticketing.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    
    @Autowired
    private AdminService adminService;
    
    @Autowired
    private TicketService ticketService;
    
    // User Management
    @PostMapping("/users")
    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody CreateUserRequest request) {
        UserDTO user = adminService.createUser(request);
        return ResponseEntity.ok(user);
    }
    
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = adminService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/users/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        UserDTO user = adminService.getUserById(id);
        return ResponseEntity.ok(user);
    }
    
    @PutMapping("/users/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id,
                                               @Valid @RequestBody CreateUserRequest request) {
        UserDTO user = adminService.updateUser(id, request);
        return ResponseEntity.ok(user);
    }
    
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/users/role/{role}")
    public ResponseEntity<List<UserDTO>> getUsersByRole(@PathVariable Role role) {
        List<UserDTO> users = adminService.getUsersByRole(role);
        return ResponseEntity.ok(users);
    }
    
    // Ticket Management (Admin Override)
    @GetMapping("/tickets")
    public ResponseEntity<List<TicketDTO>> getAllTickets() {
        List<TicketDTO> tickets = ticketService.getAllTickets();
        return ResponseEntity.ok(tickets);
    }
    
    @PutMapping("/tickets/{id}")
    public ResponseEntity<TicketDTO> updateTicket(@PathVariable Long id,
                                                   @Valid @RequestBody UpdateTicketRequest request,
                                                   Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        TicketDTO ticket = ticketService.updateTicket(id, request, currentUser);
        return ResponseEntity.ok(ticket);
    }
}



