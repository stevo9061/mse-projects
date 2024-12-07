package app.web.registration.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HomeController {

    @GetMapping("/home")
    public Map<String, String> home(@AuthenticationPrincipal Object user) {
        Map<String, String> response = new HashMap<>();
        if (user instanceof OAuth2User oauth2User) {
            response.put("message", "Welcome " + oauth2User.getAttribute("name") + "!");
            response.put("type", "OAuth2");
        } else if (user instanceof User basicAuthUser) {
            response.put("message", "Welcome " + basicAuthUser.getUsername() + "!");
            response.put("type", "BasicAuth");
        } else {
            response.put("message", "Welcome guest!");
            response.put("type", "Anonymous");
        }
        return response;
    }
}
