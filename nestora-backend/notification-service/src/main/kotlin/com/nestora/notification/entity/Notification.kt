package com.nestora.notification.entity

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table
import java.time.Instant

@Table("notifications")
data class Notification(
    @Id val id: Long? = null,
    val userId: Long,
    val type: String, // PUSH, EMAIL, SMS
    val title: String,
    val content: String,
    val isRead: Boolean = false,
    val scheduledFor: Instant = Instant.now(),
    val sentAt: Instant = Instant.now()
)
