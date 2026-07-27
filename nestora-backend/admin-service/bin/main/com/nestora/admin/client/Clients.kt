package com.nestora.admin.client

import com.nestora.common.dto.UserDto
import org.springframework.stereotype.Component
import org.springframework.web.reactive.function.client.WebClient
import reactor.core.publisher.Mono

@Component
class UserAdminClient {
    private val webClient = WebClient.builder().baseUrl("http://localhost:8081").build()

    fun getUserProfile(email: String): Mono<UserDto> {
        return webClient.get()
            .uri("/api/v1/profile")
            .header("X-User-Email", email)
            .retrieve()
            .bodyToMono(UserDto::class.java)
    }

    // Call User Service to update KYC verification state
    fun reviewKyc(userId: Long, adminId: Long, status: String, reason: String?): Mono<Void> {
        // Formulate internal admin review request
        return webClient.post()
            .uri { uriBuilder ->
                uriBuilder.path("/api/v1/admin/kyc/$userId/review")
                    .queryParam("adminId", adminId)
                    .queryParam("status", status)
                    .queryParam("reason", reason)
                    .build()
            }
            .retrieve()
            .bodyToMono(Void::class.java)
    }
}

@Component
class PropertyAdminClient {
    private val webClient = WebClient.builder().baseUrl("http://localhost:8082").build()

    // Call Property Service to update verification state
    fun reviewProperty(propertyId: Long, adminId: Long, status: String, reason: String?): Mono<Void> {
        return webClient.post()
            .uri { uriBuilder ->
                uriBuilder.path("/api/v1/admin/properties/$propertyId/review")
                    .queryParam("adminId", adminId)
                    .queryParam("status", status)
                    .queryParam("reason", reason)
                    .build()
            }
            .retrieve()
            .bodyToMono(Void::class.java)
    }
}
