package com.nestora.property.controller

import com.nestora.property.client.UserServiceClient
import com.nestora.property.entity.Review
import com.nestora.property.service.PropertyService
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@RestController
@RequestMapping("/api/v1/properties/{propertyId}/reviews")
class ReviewController(
    private val propertyService: PropertyService,
    private val userServiceClient: UserServiceClient
) {

    data class CreateReviewRequest(
        val rating: Int,
        val comment: String?,
        val visitProofImageUrl: String?
    )

    @PostMapping
    fun addReview(
        @RequestHeader("X-User-Email") email: String,
        @PathVariable propertyId: Long,
        @RequestBody request: CreateReviewRequest
    ): Mono<Review> {
        return userServiceClient.getUserProfile(email)
            .flatMap { user ->
                propertyService.addReview(
                    reviewerId = user.id!!,
                    propertyId = propertyId,
                    rating = request.rating,
                    comment = request.comment,
                    visitProofImageUrl = request.visitProofImageUrl
                )
            }
    }

    @GetMapping
    fun getReviews(@PathVariable propertyId: Long): Flux<Review> {
        return propertyService.getReviews(propertyId)
    }
}
