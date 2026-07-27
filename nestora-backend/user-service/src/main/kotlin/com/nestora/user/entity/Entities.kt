package com.nestora.user.entity

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table
import java.time.Instant

@Table("users")
data class User(
    @Id val id: Long? = null,
    val email: String,
    val phone_number: String?,
    val password_hash: String,
    val full_name: String,
    val role: String, // BUYER, PROPERTY_OWNER, AGENT, ADMIN
    val profile_picture_url: String? = null,
    val is_verified: Boolean = false,
    val created_at: Instant = Instant.now(),
    val updated_at: Instant = Instant.now()
)

@Table("kyc_verifications")
data class KycVerification(
    @Id val id: Long? = null,
    val userId: Long,
    val documentType: String, // NID, TRADE_LICENSE
    val documentNumber: String,
    val documentImageUrl: String,
    val status: String = "PENDING", // PENDING, APPROVED, REJECTED
    val rejectionReason: String? = null,
    val submittedAt: Instant = Instant.now(),
    val reviewedAt: Instant? = null,
    val reviewedByAdminId: Long? = null
)

@Table("user_preferences")
data class UserPreference(
    @Id val id: Long? = null,
    val userId: Long,
    val preferredLocation: String?,
    val minPrice: Double?,
    val maxPrice: Double?,
    val propertyType: String?,
    val createdAt: Instant = Instant.now(),
    val updatedAt: Instant = Instant.now()
)
