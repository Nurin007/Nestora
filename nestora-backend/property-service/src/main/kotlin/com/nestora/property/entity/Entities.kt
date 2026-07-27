package com.nestora.property.entity

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table
import java.time.Instant

@Table("properties")
data class Property(
    @Id val id: Long? = null,
    val title: String,
    val description: String,
    val propertyType: String, // RESIDENTIAL, COMMERCIAL, RENTAL, LAND
    val status: String = "AVAILABLE", // AVAILABLE, SOLD, RENTED
    val verificationStatus: String = "PENDING", // PENDING, APPROVED, REJECTED
    val pricing: Double,
    val areaSize: Double,
    val numberOfBedrooms: Int = 0,
    val numberOfBathrooms: Int = 0,
    val address: String,
    val city: String,
    val locationLat: Double?,
    val locationLong: Double?,
    val ownerId: Long,
    val createdAt: Instant = Instant.now(),
    val updatedAt: Instant = Instant.now()
)

@Table("property_images")
data class PropertyImage(
    @Id val id: Long? = null,
    val propertyId: Long,
    val imageUrl: String,
    val isThumbnail: Boolean = false,
    val createdAt: Instant = Instant.now()
)

@Table("property_amenities")
data class PropertyAmenity(
    @Id val id: Long? = null,
    val propertyId: Long,
    val amenityName: String
)

@Table("wishlists")
data class Wishlist(
    @Id val id: Long? = null,
    val userId: Long,
    val propertyId: Long,
    val createdAt: Instant = Instant.now()
)

@Table("reviews")
data class Review(
    @Id val id: Long? = null,
    val propertyId: Long,
    val reviewerId: Long,
    val rating: Int,
    val comment: String?,
    val visitProofImageUrl: String?,
    val moderationStatus: String = "PENDING", // PENDING, APPROVED, SPAM
    val createdAt: Instant = Instant.now(),
    val updatedAt: Instant = Instant.now()
)
