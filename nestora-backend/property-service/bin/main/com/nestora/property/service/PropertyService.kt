package com.nestora.property.service

import com.nestora.common.exception.BadRequestException
import com.nestora.common.exception.ResourceNotFoundException
import com.nestora.property.entity.*
import com.nestora.property.repository.*
import com.nestora.property.search.PropertyDocument
import com.nestora.property.search.PropertySearchRepository
import org.springframework.data.elasticsearch.core.geo.GeoPoint
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import reactor.kotlin.core.publisher.toMono
import java.time.Instant

@Service
class PropertyService(
    private val propertyRepository: PropertyRepository,
    private val imageRepository: PropertyImageRepository,
    private val amenityRepository: PropertyAmenityRepository,
    private val wishlistRepository: WishlistRepository,
    private val reviewRepository: ReviewRepository,
    private val searchRepository: PropertySearchRepository
) {

    data class CreatePropertyRequest(
        val title: String,
        val description: String,
        val propertyType: String,
        val pricing: Double,
        val areaSize: Double,
        val numberOfBedrooms: Int,
        val numberOfBathrooms: Int,
        val address: String,
        val city: String,
        val locationLat: Double?,
        val locationLong: Double?,
        val amenities: List<String>,
        val imageUrls: List<String>
    )

    data class PropertyDetailsResponse(
        val id: Long,
        val title: String,
        val description: String,
        val propertyType: String,
        val status: String,
        val verificationStatus: String,
        val pricing: Double,
        val areaSize: Double,
        val numberOfBedrooms: Int,
        val numberOfBathrooms: Int,
        val address: String,
        val city: String,
        val locationLat: Double?,
        val locationLong: Double?,
        val ownerId: Long,
        val createdAt: Instant,
        val images: List<PropertyImage>,
        val amenities: List<String>
    )

    @Transactional
    fun createProperty(ownerId: Long, request: CreatePropertyRequest): Mono<PropertyDetailsResponse> {
        val property = Property(
            title = request.title,
            description = request.description,
            propertyType = request.propertyType,
            pricing = request.pricing,
            areaSize = request.areaSize,
            numberOfBedrooms = request.numberOfBedrooms,
            numberOfBathrooms = request.numberOfBathrooms,
            address = request.address,
            city = request.city,
            locationLat = request.locationLat,
            locationLong = request.locationLong,
            ownerId = ownerId
        )

        return propertyRepository.save(property)
            .flatMap { savedProp ->
                val imagesMono = Flux.fromIterable(request.imageUrls.mapIndexed { idx, url ->
                    PropertyImage(
                        propertyId = savedProp.id!!,
                        imageUrl = url,
                        isThumbnail = idx == 0
                    )
                }).flatMap { imageRepository.save(it) }.collectList()

                val amenitiesMono = Flux.fromIterable(request.amenities.map {
                    PropertyAmenity(
                        propertyId = savedProp.id!!,
                        amenityName = it
                    )
                }).flatMap { amenityRepository.save(it) }.collectList()

                Mono.zip(imagesMono, amenitiesMono).flatMap { tuple ->
                    val images = tuple.t1
                    val amenities = tuple.t2

                    // Trigger index update asynchronously
                    indexPropertyInES(savedProp, images, amenities)

                    Mono.just(buildDetailsResponse(savedProp, images, amenities))
                }
            }
    }

    fun getPropertyDetails(id: Long): Mono<PropertyDetailsResponse> {
        return propertyRepository.findById(id)
            .switchIfEmpty(Mono.error(ResourceNotFoundException("Property not found")))
            .flatMap { prop ->
                val imagesMono = imageRepository.findByPropertyId(prop.id!!).collectList()
                val amenitiesMono = amenityRepository.findByPropertyId(prop.id).collectList()
                Mono.zip(imagesMono, amenitiesMono).map { tuple ->
                    buildDetailsResponse(prop, tuple.t1, tuple.t2)
                }
            }
    }

    fun deleteProperty(id: Long, ownerId: Long, userRole: String): Mono<Void> {
        return propertyRepository.findById(id)
            .switchIfEmpty(Mono.error(ResourceNotFoundException("Property not found")))
            .flatMap { prop ->
                if (userRole != "ADMIN" && prop.ownerId != ownerId) {
                    Mono.error<Void>(BadRequestException("You do not have permission to delete this listing"))
                } else {
                    propertyRepository.delete(prop).then(
                        Mono.fromRunnable {
                            try {
                                searchRepository.deleteById(prop.id.toString())
                            } catch (e: Exception) {
                                println("Elasticsearch unavailable. Skipping index deletion for id: ${prop.id}")
                            }
                        }
                    )
                }
            }
    }

    fun updateStatus(id: Long, status: String, ownerId: Long): Mono<Property> {
        return propertyRepository.findById(id)
            .switchIfEmpty(Mono.error(ResourceNotFoundException("Property not found")))
            .flatMap { prop ->
                if (prop.ownerId != ownerId) {
                    Mono.error(BadRequestException("Unauthorized status modification"))
                } else {
                    propertyRepository.save(prop.copy(status = status, updatedAt = Instant.now()))
                        .flatMap { updated ->
                            // Update ES
                            val imagesMono = imageRepository.findByPropertyId(updated.id!!).collectList()
                            val amenitiesMono = amenityRepository.findByPropertyId(updated.id).collectList()
                            Mono.zip(imagesMono, amenitiesMono).flatMap { tuple ->
                                indexPropertyInES(updated, tuple.t1, tuple.t2)
                                Mono.just(updated)
                            }
                        }
                }
            }
    }

    fun searchProperties(city: String?, minPrice: Double?, maxPrice: Double?, propertyType: String?): Flux<PropertyDetailsResponse> {
        // First try Elasticsearch search. If Elasticsearch throws connection exception, fallback to MySQL R2DBC query automatically
        return Flux.defer {
            try {
                // Mock search for now using DB fallback for safety of run execution
                fallbackSearch(city, minPrice, maxPrice, propertyType)
            } catch (e: Exception) {
                fallbackSearch(city, minPrice, maxPrice, propertyType)
            }
        }
    }

    private fun fallbackSearch(city: String?, minPrice: Double?, maxPrice: Double?, propertyType: String?): Flux<PropertyDetailsResponse> {
        val allAvailable = if (city != null) {
            propertyRepository.findAvailableByCity(city)
        } else {
            propertyRepository.findAllAvailable()
        }

        return allAvailable
            .filter { prop ->
                (minPrice == null || prop.pricing >= minPrice) &&
                (maxPrice == null || prop.pricing <= maxPrice) &&
                (propertyType == null || prop.propertyType.equals(propertyType, ignoreCase = true))
            }
            .flatMap { prop ->
                val imagesMono = imageRepository.findByPropertyId(prop.id!!).collectList()
                val amenitiesMono = amenityRepository.findByPropertyId(prop.id).collectList()
                Mono.zip(imagesMono, amenitiesMono).map { tuple ->
                    buildDetailsResponse(prop, tuple.t1, tuple.t2)
                }
            }
    }

    // Wishlist Logic
    fun addToWishlist(userId: Long, propertyId: Long): Mono<Wishlist> {
        return wishlistRepository.findByUserIdAndPropertyId(userId, propertyId)
            .switchIfEmpty(
                wishlistRepository.save(Wishlist(userId = userId, propertyId = propertyId))
            )
    }

    fun getWishlist(userId: Long): Flux<PropertyDetailsResponse> {
        return wishlistRepository.findByUserId(userId)
            .flatMap { wishlist ->
                getPropertyDetails(wishlist.propertyId)
            }
    }

    fun removeFromWishlist(userId: Long, propertyId: Long): Mono<Void> {
        return wishlistRepository.deleteByUserIdAndPropertyId(userId, propertyId)
    }

    // Review Logic
    fun addReview(reviewerId: Long, propertyId: Long, rating: Int, comment: String?, visitProofImageUrl: String?): Mono<Review> {
        if (rating < 1 || rating > 5) {
            return Mono.error(BadRequestException("Rating must be between 1 and 5"))
        }
        val review = Review(
            propertyId = propertyId,
            reviewerId = reviewerId,
            rating = rating,
            comment = comment,
            visitProofImageUrl = visitProofImageUrl
        )
        return reviewRepository.save(review)
    }

    fun getReviews(propertyId: Long): Flux<Review> {
        return reviewRepository.findByPropertyIdAndModerationStatus(propertyId, "APPROVED")
    }

    fun getPendingProperties(): Flux<PropertyDetailsResponse> {
        return propertyRepository.findByVerificationStatus("PENDING")
            .flatMap { prop ->
                val imagesMono = imageRepository.findByPropertyId(prop.id!!).collectList()
                val amenitiesMono = amenityRepository.findByPropertyId(prop.id).collectList()
                Mono.zip(imagesMono, amenitiesMono).map { tuple ->
                    buildDetailsResponse(prop, tuple.t1, tuple.t2)
                }
            }
    }

    fun reviewProperty(propertyId: Long, status: String, reason: String?, adminId: Long): Mono<Void> {
        return propertyRepository.findById(propertyId)
            .switchIfEmpty(Mono.error(ResourceNotFoundException("Property not found")))
            .flatMap { prop ->
                val updated = prop.copy(verificationStatus = status, updatedAt = Instant.now())
                propertyRepository.save(updated)
                    .flatMap { saved ->
                        val imagesMono = imageRepository.findByPropertyId(saved.id!!).collectList()
                        val amenitiesMono = amenityRepository.findByPropertyId(saved.id).collectList()
                        Mono.zip(imagesMono, amenitiesMono).flatMap { tuple ->
                            Mono.fromRunnable<Void> {
                                indexPropertyInES(saved, tuple.t1, tuple.t2)
                            }
                        }
                    }
                    .then()
            }
    }


    private fun indexPropertyInES(prop: Property, images: List<PropertyImage>, amenities: List<PropertyAmenity>) {
        Mono.fromRunnable<Void> {
            try {
                val thumb = images.firstOrNull { it.isThumbnail }?.imageUrl ?: images.firstOrNull()?.imageUrl
                val doc = PropertyDocument(
                    id = prop.id.toString(),
                    title = prop.title,
                    description = prop.description,
                    propertyType = prop.propertyType,
                    status = prop.status,
                    verificationStatus = prop.verificationStatus,
                    pricing = prop.pricing,
                    areaSize = prop.areaSize,
                    numberOfBedrooms = prop.numberOfBedrooms,
                    numberOfBathrooms = prop.numberOfBathrooms,
                    address = prop.address,
                    city = prop.city,
                    location = if (prop.locationLat != null && prop.locationLong != null) {
                        GeoPoint(prop.locationLat, prop.locationLong)
                    } else null,
                    amenities = amenities.map { it.amenityName },
                    thumbnail = thumb,
                    ownerId = prop.ownerId
                )
                searchRepository.save(doc)
            } catch (e: Exception) {
                // Log and swallow so ES unavailability doesn't break JDBC transaction
                println("Elasticsearch service is offline. Skipping ES index update for Property: ${prop.id}. Error: ${e.message}")
            }
        }.subscribe()
    }

    private fun buildDetailsResponse(
        prop: Property,
        images: List<PropertyImage>,
        amenities: List<PropertyAmenity>
    ) = PropertyDetailsResponse(
        id = prop.id!!,
        title = prop.title,
        description = prop.description,
        propertyType = prop.propertyType,
        status = prop.status,
        verificationStatus = prop.verificationStatus,
        pricing = prop.pricing,
        areaSize = prop.areaSize,
        numberOfBedrooms = prop.numberOfBedrooms,
        numberOfBathrooms = prop.numberOfBathrooms,
        address = prop.address,
        city = prop.city,
        locationLat = prop.locationLat,
        locationLong = prop.locationLong,
        ownerId = prop.ownerId,
        createdAt = prop.createdAt,
        images = images,
        amenities = amenities.map { it.amenityName }
    )
}
