package com.nestora.booking.client

import com.nestora.common.dto.UserDto
import org.springframework.stereotype.Component
import org.springframework.web.reactive.function.client.WebClient
import reactor.core.publisher.Mono

@Component
class UserServiceClient {
    private val webClient = WebClient.builder().baseUrl("http://localhost:8081").build()

    fun getUserProfile(email: String): Mono<UserDto> {
        return webClient.get()
            .uri("/api/v1/profile")
            .header("X-User-Email", email)
            .retrieve()
            .bodyToMono(UserDto::class.java)
    }
}
