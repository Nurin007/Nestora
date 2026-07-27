package com.nestora.property.controller

import com.nestora.property.client.UserServiceClient
import com.nestora.property.entity.Wishlist
import com.nestora.property.service.PropertyService
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@RestController
@RequestMapping("/api/v1/wishlist")
class WishlistController(
    private val propertyService: PropertyService,
    private val userServiceClient: UserServiceClient
) {

    @GetMapping
    fun getWishlist(@RequestHeader("X-User-Email") email: String): Flux<PropertyService.PropertyDetailsResponse> {
        return userServiceClient.getUserProfile(email)
            .flatMapMany { user ->
                propertyService.getWishlist(user.id!!)
            }
    }

    @PostMapping
    fun addToWishlist(
        @RequestHeader("X-User-Email") email: String,
        @RequestParam propertyId: Long
    ): Mono<Wishlist> {
        return userServiceClient.getUserProfile(email)
            .flatMap { user ->
                propertyService.addToWishlist(user.id!!, propertyId)
            }
    }

    @DeleteMapping("/{propertyId}")
    fun removeFromWishlist(
        @RequestHeader("X-User-Email") email: String,
        @PathVariable propertyId: Long
    ): Mono<Void> {
        return userServiceClient.getUserProfile(email)
            .flatMap { user ->
                propertyService.removeFromWishlist(user.id!!, propertyId)
            }
    }
}
