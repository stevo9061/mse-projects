package app.web.registration.controller;


import app.web.registration.UserLoginRequest;
import app.web.registration.UserRegistrationRequest;
import app.web.registration.enums.Roles;
import app.web.registration.model.User;
import app.web.registration.model.VerificationToken;
import app.web.registration.repository.VerificationTokenRepository;
import app.web.registration.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class RegistrationController {


    @Autowired
    private UserService userService;

    @Autowired
    private VerificationTokenRepository tokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> registerUser(@RequestBody UserRegistrationRequest request) {

        userService.registerUser(request, Roles.USER.toString());

        // Create Map object that can be serialized as JSON
        Map<String, String> response = new HashMap<>();

        // Send confirmation email with token
        response.put("message", "Registration successful. Please check your email for verification");

    return ResponseEntity.ok(response);

    }

    @GetMapping("/verify")
    public ResponseEntity<String> verifyUser(@RequestParam String token) {
        VerificationToken verificationToken = tokenRepository.findByToken(token).orElse(null);

        if(verificationToken == null) {
            return ResponseEntity.badRequest().body("Invalid token");
        }

        if (verificationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Token expired");
        }

        userService.enableUser(verificationToken.getUser());

        return ResponseEntity.ok("Email verified successfully. You can now login :)");
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginUser(@RequestBody UserLoginRequest loginRequest) {
        User user = userService.findByUsername(loginRequest.getUsername());

        Map<String, String> response = new HashMap<>();

        if (user == null) {
            response.put("message", "Invalid username or password");
            return ResponseEntity.status(401).body(response);
        }

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            response.put("message", "Invalid username or password");
            return ResponseEntity.status(401).body(response);
        }

        if (!user.getEnabled()) {
            response.put("message", "Please verify our email to activate your account");
            return ResponseEntity.status(403).body(response);
        }

        response.put("message", "Login successful");

        return ResponseEntity.ok(response);

    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Test successful");
    }
}
