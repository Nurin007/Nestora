package com.nestora.notification.controller

import com.nestora.notification.client.UserServiceClient
import com.nestora.notification.entity.Notification
import com.nestora.notification.service.NotificationService
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@RestController
@RequestMapping("/api/v1/notifications")
class NotificationController(
    private val notificationService: NotificationService,
    private val userServiceClient: UserServiceClient
) {

    @GetMapping
    fun getNotifications(@RequestHeader("X-User-Email") email: String): Flux<Notification> {
        return userServiceClient.getUserProfile(email)
            .flatMapMany { user ->
                notificationService.getNotificationsForUser(user.id!!)
            }
    }

    @PatchMapping("/{id}/read")
    fun markAsRead(@PathVariable id: Long): Mono<Notification> {
        return notificationService.markAsRead(id)
    }

    @PostMapping("/send")
    fun sendNotification(@RequestBody request: NotificationService.SendNotificationRequest): Mono<Notification> {
        return notificationService.sendNotification(request)
    }
}
