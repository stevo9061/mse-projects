package app.web.registration.service;

import app.web.registration.UserRegistrationRequest;
import app.web.registration.model.User;
import app.web.registration.model.VerificationToken;
import app.web.registration.repository.VerificationTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import app.web.registration.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VerificationTokenRepository tokenRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(UserRegistrationRequest request, String role) {

        User user = new User();
        user.setFullname(request.getFullname());
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setEnabled(false); // Email verification required
        user.setRole(role);
        User savedUser = userRepository.save(user);

        // Generate verification token
        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = new VerificationToken();
        verificationToken.setToken(token);
        verificationToken.setUser(savedUser);
        verificationToken.setExpiryDate(LocalDateTime.now().plusDays(10));
        tokenRepository.save(verificationToken);

        // Send verification email
        String verificationUrl = "http://localhost:8080/api/verify?token=" + token;
        emailService.sendVerificationEmail(savedUser.getEmail(), verificationUrl);

        return savedUser;

    }

    public void enableUser(User user) {
        user.setEnabled(true);
        userRepository.save(user);
    }

    public boolean isUserEnabled(String username) {
        User user = userRepository.findByUsername(username);
        return user != null && user.getEnabled();

    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public User findByPassword(String password) {
        return userRepository.findByPassword(password);
    }


}



