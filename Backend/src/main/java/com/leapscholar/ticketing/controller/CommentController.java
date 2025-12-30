package com.leapscholar.ticketing.controller;

import com.leapscholar.ticketing.dto.CommentDTO;
import com.leapscholar.ticketing.dto.CreateCommentRequest;
import com.leapscholar.ticketing.model.User;
import com.leapscholar.ticketing.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "*")
public class CommentController {
    
    @Autowired
    private CommentService commentService;
    
    @PostMapping
    public ResponseEntity<CommentDTO> addComment(@Valid @RequestBody CreateCommentRequest request,
                                                  Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        CommentDTO comment = commentService.addComment(request, currentUser);
        return ResponseEntity.ok(comment);
    }
    
    @GetMapping("/ticket/{ticketId}")
    public ResponseEntity<List<CommentDTO>> getTicketComments(@PathVariable Long ticketId,
                                                              Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        List<CommentDTO> comments = commentService.getTicketComments(ticketId, currentUser);
        return ResponseEntity.ok(comments);
    }
}



