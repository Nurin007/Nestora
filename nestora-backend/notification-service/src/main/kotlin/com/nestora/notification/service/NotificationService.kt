package com.nestora.notification.service

import com.nestora.common.exception.ResourceNotFoundException
import com.nestora.notification.entity.Notification
import com.nestora.notification.repository.NotificationRepository
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.time.Instant

@Service
class NotificationService(private val notificationRepository: NotificationRepository) {

    data class SendNotificationRequest(
        val userId: Long,
        val type: String, // PUSH, EMAIL, SMS
        val title: String,
        val content: String
    )

    fun sendNotification(request: SendNotificationRequest): Mono<Notification> {
        val notification = Notification(
            userId = request.userId,
            type = request.type,
            title = request.title,
            content = request.content
        )
        return notificationRepository.save(notification)
            .doOnSuccess { saved ->
                println("---------- [NOTIFICATION MOCK SEND] ----------")
                println("Type: ${saved.type}")
                println("To User ID: ${saved.userId}")
                println("Title: ${saved.title}")
                println("Content: ${saved.content}")
                println("----------------------------------------------")
            }
    }

    fun getNotificationsForUser(userId: Long): Flux<Notification> {
        return notificationRepository.findByUserId(userId)
    }

    fun markAsRead(id: Long): Mono<Notification> {
        return notificationRepository.findById(id)
            .switchIfEmpty(Mono.error(ResourceNotFoundException("Notification not found")))
            .flatMap { notificationRepository.save(it.copy(isRead = true)) }
    }
}
