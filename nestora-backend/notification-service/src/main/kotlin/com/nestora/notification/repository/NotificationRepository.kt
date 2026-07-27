package com.nestora.notification.repository

import com.nestora.notification.entity.Notification
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Flux

interface NotificationRepository : ReactiveCrudRepository<Notification, Long> {
    fun findByUserId(userId: Long): Flux<Notification>
}
