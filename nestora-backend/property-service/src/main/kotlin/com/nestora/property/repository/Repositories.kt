package com.nestora.property.repository

import com.nestora.property.entity.*
import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

interface PropertyRepository : ReactiveCrudRepository<Property, Long> {
    fun findByOwnerId(ownerId: Long): Flux<Property>
    fun findByVerificationStatus(verificationStatus: String): Flux<Property>

    @Query("SELECT * FROM properties p WHERE p.verification_status = 'APPROVED' AND p.status = 'AVAILABLE' AND p.city = :city")
    fun findAvailableByCity(city: String): Flux<Property>

    @Query("SELECT * FROM properties p WHERE p.verification_status = 'APPROVED' AND p.status = 'AVAILABLE'")
    fun findAllAvailable(): Flux<Property>
}

interface PropertyImageRepository : ReactiveCrudRepository<PropertyImage, Long> {
    fun findByPropertyId(propertyId: Long): Flux<PropertyImage>
}

interface PropertyAmenityRepository : ReactiveCrudRepository<PropertyAmenity, Long> {
    fun findByPropertyId(propertyId: Long): Flux<PropertyAmenity>
}

interface WishlistRepository : ReactiveCrudRepository<Wishlist, Long> {
    fun findByUserId(userId: Long): Flux<Wishlist>
    fun findByUserIdAndPropertyId(userId: Long, propertyId: Long): Mono<Wishlist>
    fun deleteByUserIdAndPropertyId(userId: Long, propertyId: Long): Mono<Void>
}

interface ReviewRepository : ReactiveCrudRepository<Review, Long> {
    fun findByPropertyId(propertyId: Long): Flux<Review>
    fun findByPropertyIdAndModerationStatus(propertyId: Long, status: String): Flux<Review>
}
