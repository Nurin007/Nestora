package com.nestora.booking.client

import org.springframework.stereotype.Component
import org.springframework.web.reactive.function.client.WebClient
import reactor.core.publisher.Mono

@Component
class PropertyServiceClient {
    private val webClient = WebClient.builder().baseUrl("http://localhost:8082").build()

    data class PropertyResponse(
        val id: Long,
        val title: String,
        val ownerId: Long
    )

    fun getProperty(propertyId: Long): Mono<PropertyResponse> {
        return webClient.get()
            .uri("/api/v1/properties/$propertyId")
            .retrieve()
            .bodyToMono(PropertyResponse::class.java)
    }
}
