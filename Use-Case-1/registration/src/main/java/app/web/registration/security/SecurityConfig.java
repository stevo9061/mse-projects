package app.web.registration.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.LogoutConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;


import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {



        http
                .cors(Customizer.withDefaults()) // enables CORS (Cross-Origin Resource Sharing)
                .csrf(csrf -> csrf.disable()) // for simple development, should only be deactivated in production if required
                .authorizeHttpRequests(authorizationManagerRequestMatcherRegistry -> // determines which endpoints are accessible without authentication
                    authorizationManagerRequestMatcherRegistry
                            .requestMatchers("encodedPassword","/api/register", "/api/login", "/api/verify", "/api/test").permitAll()
                            .anyRequest().authenticated() // all other endpoints require authentication
                )
                .httpBasic(Customizer.withDefaults()) // activates HTTP Basic authentication
                .logout(LogoutConfigurer::permitAll); // allows everyone to log out

            return http.build();
    }


   @Bean
    public PasswordEncoder passwordEncoder() { // password encoder for storing passwords securely using BCrypt
        return new BCryptPasswordEncoder();
    }


    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:4200")); // allow requests from these origins
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // allow CORS on all endpoints
        return source;
    }
}
