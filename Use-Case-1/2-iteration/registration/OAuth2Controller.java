
package app.web.registration.controller;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/oauth2")
public class OAuth2Controller {

    private final OAuth2AuthorizedClientService authorizedClientService;
    private final RestTemplate restTemplate;

    public OAuth2Controller(OAuth2AuthorizedClientService authorizedClientService) {
        this.authorizedClientService = authorizedClientService;
        this.restTemplate = new RestTemplate();
    }


    @GetMapping("/login")
    public void login(HttpServletResponse response) throws IOException {
        response.sendRedirect("/oauth2/authorization/Azure");
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUserInfo(@AuthenticationPrincipal OAuth2AuthenticationToken authentication) {
        // Get the authorized client
        OAuth2AuthorizedClient client = authorizedClientService.loadAuthorizedClient(
                authentication.getAuthorizedClientRegistrationId(),
                authentication.getName());

        if (client == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No authorized client found");
        }

        // Get the Access Token
        String accessToken = client.getAccessToken().getTokenValue();

        // Call Microsoft Graph API
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<Map> response = restTemplate.exchange(
                "https://graph.microsoft.com/v1.0/me",
                HttpMethod.GET,
                entity,
                Map.class
        );

        return ResponseEntity.ok(response.getBody());
    }

    @GetMapping("/token")
    public ResponseEntity<?> getAccessToken(@AuthenticationPrincipal OAuth2AuthenticationToken authentication) {
        OAuth2AuthorizedClient client = authorizedClientService.loadAuthorizedClient(
                authentication.getAuthorizedClientRegistrationId(),
                authentication.getName());

        if (client == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No authorized client found");
        }

        return ResponseEntity.ok(client.getAccessToken().getTokenValue());
    }

}

