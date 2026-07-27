package com.nestora.user.controller

import com.nestora.user.entity.KycVerification
import com.nestora.user.service.UserService
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@RestController
@RequestMapping("/api/v1/admin")
class AdminUserController(private val userService: UserService) {

    @PostMapping("/kyc/{userId}/review")
    fun reviewKyc(
        @PathVariable userId: Long,
        @RequestParam status: String,
        @RequestParam(required = false) reason: String?,
        @RequestParam adminId: Long
    ): Mono<Void> {
        return userService.reviewKyc(userId, status, reason, adminId)
    }

    @GetMapping("/kyc/pending")
    fun getPendingKyc(): Flux<KycVerification> {
        return userService.getPendingKyc()
    }
}
