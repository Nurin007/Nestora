package com.nestora.admin.entity

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table
import java.time.Instant

@Table("audit_logs")
data class AuditLog(
    @Id val id: Long? = null,
    val adminId: Long,
    val action: String,
    val targetType: String,
    val targetId: Long,
    val remarks: String? = null,
    val createdAt: Instant = Instant.now()
)

@Table("complaints")
data class Complaint(
    @Id val id: Long? = null,
    val userId: Long,
    val propertyId: Long,
    val description: String,
    val status: String = "OPEN", // OPEN, UNDER_INVESTIGATION, RESOLVED, CLOSED
    val resolutionDetails: String? = null,
    val createdAt: Instant = Instant.now(),
    val updatedAt: Instant = Instant.now()
)
