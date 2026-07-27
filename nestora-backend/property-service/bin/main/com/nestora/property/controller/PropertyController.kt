package com.nestora.property.controller

import com.nestora.property.client.UserServiceClient
import com.nestora.property.entity.Property
import com.nestora.property.service.PropertyService
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@RestController
@RequestMapping("/api/v1")
class PropertyController(
    private val propertyService: PropertyService,
    private val userServiceClient: UserServiceClient
) {

    @PostMapping("/properties")
    fun createProperty(
        @RequestHeader("X-User-Email") email: String,
        @RequestBody request: PropertyService.CreatePropertyRequest
    ): Mono<PropertyService.PropertyDetailsResponse> {
        return userServiceClient.getUserProfile(email)
            .flatMap { user ->
                propertyService.createProperty(user.id!!, request)
            }
    }

    @GetMapping("/properties/{id}")
    fun getPropertyDetails(@PathVariable id: Long): Mono<PropertyService.PropertyDetailsResponse> {
        return propertyService.getPropertyDetails(id)
    }

    @DeleteMapping("/properties/{id}")
    fun deleteProperty(
        @RequestHeader("X-User-Email") email: String,
        @RequestHeader("X-User-Role") role: String,
        @PathVariable id: Long
    ): Mono<Void> {
        return userServiceClient.getUserProfile(email)
            .flatMap { user ->
                propertyService.deleteProperty(id, user.id!!, role)
            }
    }

    @PatchMapping("/properties/{id}/status")
    fun updateStatus(
        @RequestHeader("X-User-Email") email: String,
        @PathVariable id: Long,
        @RequestParam status: String
    ): Mono<Property> {
        return userServiceClient.getUserProfile(email)
            .flatMap { user ->
                propertyService.updateStatus(id, status, user.id!!)
            }
    }

    @GetMapping("/properties")
    fun searchProperties(
        @RequestParam(required = false) city: String?,
        @RequestParam(required = false) minPrice: Double?,
        @RequestParam(required = false) maxPrice: Double?,
        @RequestParam(required = false) propertyType: String?
    ): Flux<PropertyService.PropertyDetailsResponse> {
        return propertyService.searchProperties(city, minPrice, maxPrice, propertyType)
    }
}
