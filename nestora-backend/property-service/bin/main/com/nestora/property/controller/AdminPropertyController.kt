package com.nestora.property.controller

import com.nestora.property.service.PropertyService
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@RestController
@RequestMapping("/api/v1/admin")
class AdminPropertyController(private val propertyService: PropertyService) {

    @PostMapping("/properties/{propertyId}/review")
    fun reviewProperty(
        @PathVariable propertyId: Long,
        @RequestParam status: String,
        @RequestParam(required = false) reason: String?,
        @RequestParam adminId: Long
    ): Mono<Void> {
        return propertyService.reviewProperty(propertyId, status, reason, adminId)
    }

    @GetMapping("/properties/pending")
    fun getPendingProperties(): Flux<PropertyService.PropertyDetailsResponse> {
        return propertyService.getPendingProperties()
    }
}
