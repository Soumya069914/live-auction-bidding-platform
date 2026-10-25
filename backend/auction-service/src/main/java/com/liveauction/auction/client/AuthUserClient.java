package com.liveauction.auction.client;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Getter;
import lombok.Setter;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Component
public class AuthUserClient {

    @Value("${auth.service.url}")
    private String authServiceUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Get the authenticated user's ID.
     */
    public Long getUserId(String token) {

        AuthUserResponse user = getCurrentUser(token);

        return user.getId();
    }

    /**
     * Get the authenticated user's profile.
     */
    public AuthUserResponse getCurrentUser(String token) {

        return getUserResponse("/api/users/me", token);
    }

    /**
     * Get a user's public profile by ID.
     */
    public AuthUserResponse getUserById(
            Long userId,
            String token) {

        if (userId == null || userId <= 0) {
            throw new IllegalArgumentException(
                    "A valid user ID is required."
            );
        }

        return getUserResponse(
                "/api/users/" + userId,
                token
        );
    }

    /**
     * Make an authenticated request to Auth Service.
     */
    private AuthUserResponse getUserResponse(
            String path,
            String token) {

        if (token == null || token.isBlank()) {
            throw new IllegalArgumentException(
                    "Authentication token is required."
            );
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        try {

            ResponseEntity<AuthUserResponse> response =
                    restTemplate.exchange(
                            authServiceUrl + path,
                            HttpMethod.GET,
                            request,
                            AuthUserResponse.class
                    );

            AuthUserResponse user = response.getBody();

            if (!response.getStatusCode().is2xxSuccessful()
                    || user == null
                    || user.getId() == null) {

                throw new IllegalStateException(
                        "Could not retrieve user information."
                );
            }

            return user;

        } catch (RestClientException exception) {

            throw new IllegalStateException(
                    "Unable to retrieve user information from Auth Service.",
                    exception
            );
        }
    }

    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AuthUserResponse {

        private Long id;
        private String name;
        private String email;
        private String phone;
        private String role;
    }
}