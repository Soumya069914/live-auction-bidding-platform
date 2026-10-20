package com.liveauction.auction.controller;

import com.liveauction.auction.client.AuthUserClient;
import com.liveauction.auction.entity.Notification;
import com.liveauction.auction.service.NotificationService;

import jakarta.servlet.http.HttpServletRequest;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    private final AuthUserClient authUserClient;

    @GetMapping
 public ResponseEntity<List<Notification>> getNotifications(
            Authentication authentication,
            HttpServletRequest request
{

        Long userId = authenticatedUserId(authentication, request);

        return ResponseEntity.ok(
                notificationService.getForUser(userId)
        );
    }
@GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            Authentication authentication,
            HttpServletRequest request
    )