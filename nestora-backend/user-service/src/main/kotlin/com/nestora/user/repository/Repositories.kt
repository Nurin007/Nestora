package com.nestora.user.repository

import com.nestora.user.entity.KycVerification
import com.nestora.user.entity.User
import com.nestora.user.entity.UserPreference
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

interface UserRepository : ReactiveCrudRepository<User, Long> {
    fun findByEmail(email: String): Mono<User>
    fun findByPhoneNumber(phoneNumber: String): Mono<User>
}

interface KycVerificationRepository : ReactiveCrudRepository<KycVerification, Long> {
    fun findByUserId(userId: Long): Mono<KycVerification>
    fun findByStatus(status: String): Flux<KycVerification>
}

interface UserPreferenceRepository : ReactiveCrudRepository<UserPreference, Long> {
    fun findByUserId(userId: Long): Flux<UserPreference>
}
