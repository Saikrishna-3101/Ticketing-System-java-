package com.leapscholar.ticketing.config;

import com.leapscholar.ticketing.model.Role;
import com.leapscholar.ticketing.model.User;
import com.leapscholar.ticketing.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) {
        // Create default admin user if it doesn't exist
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@example.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFirstName("Admin");
            admin.setLastName("User");
            admin.setRole(Role.ADMIN);
            admin.setEnabled(true);
            userRepository.save(admin);
            System.out.println("Default admin user created: username=admin, password=admin123");
        }
        
        // Create a sample support agent
        if (userRepository.findByUsername("agent").isEmpty()) {
            User agent = new User();
            agent.setUsername("agent");
            agent.setEmail("agent@example.com");
            agent.setPassword(passwordEncoder.encode("agent123"));
            agent.setFirstName("Support");
            agent.setLastName("Agent");
            agent.setRole(Role.SUPPORT_AGENT);
            agent.setEnabled(true);
            userRepository.save(agent);
            System.out.println("Default support agent created: username=agent, password=agent123");
        }
        
        // Create a sample regular user
        if (userRepository.findByUsername("user").isEmpty()) {
            User user = new User();
            user.setUsername("user");
            user.setEmail("user@example.com");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setFirstName("Regular");
            user.setLastName("User");
            user.setRole(Role.USER);
            user.setEnabled(true);
            userRepository.save(user);
            System.out.println("Default user created: username=user, password=user123");
        }
    }
}



