package com.nestora.gateway.filter

import com.nestora.common.security.JwtUtil
import org.springframework.cloud.gateway.filter.GatewayFilterChain
import org.springframework.cloud.gateway.filter.GlobalFilter
import org.springframework.core.Ordered
import org.springframework.http.HttpStatus
import org.springframework.http.server.reactive.ServerHttpRequest
import org.springframework.stereotype.Component
import org.springframework.web.server.ServerWebExchange
import reactor.core.publisher.Mono

@Component
class JwtAuthFilter : GlobalFilter, Ordered {

    private val publicEndpoints = listOf(
        "/api/v1/auth/register",
        "/api/v1/auth/login",
        "/api/v1/auth/otp/send",
        "/api/v1/auth/otp/verify"
    )

    override fun filter(exchange: ServerWebExchange, chain: GatewayFilterChain): Mono<Void> {
        val request = exchange.request
        val path = request.uri.path
        val method = request.method.name()

        // Check if endpoint is public
        val isPublicAuth = publicEndpoints.any { path.startsWith(it) }
        val isPublicPropertyGet = (path.startsWith("/api/v1/properties") && method == "GET")

        if (isPublicAuth || isPublicPropertyGet) {
            // Check if token exists even for public paths to propagate user context if logged in
            val token = extractToken(request)
            return if (token != null && JwtUtil.validateToken(token)) {
                val username = JwtUtil.getUsername(token)
                val role = JwtUtil.getRole(token)
                val mutatedRequest = request.mutate()
                    .header("X-User-Email", username)
                    .header("X-User-Role", role)
                    .build()
                chain.filter(exchange.mutate().request(mutatedRequest).build())
            } else {
                chain.filter(exchange)
            }
        }

        // Protected Endpoint: Check JWT
        val token = extractToken(request)
        if (token == null || !JwtUtil.validateToken(token)) {
            val response = exchange.response
            response.statusCode = HttpStatus.UNAUTHORIZED
            return response.setComplete()
        }

        val username = JwtUtil.getUsername(token)
        val role = JwtUtil.getRole(token)

        val mutatedRequest = request.mutate()
            .header("X-User-Email", username)
            .header("X-User-Role", role)
            .build()

        return chain.filter(exchange.mutate().request(mutatedRequest).build())
    }

    private fun extractToken(request: ServerHttpRequest): String? {
        val authHeader = request.headers.getFirst("Authorization")
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7)
        }
        return null
    }

    override fun getOrder(): Int = -1
}
