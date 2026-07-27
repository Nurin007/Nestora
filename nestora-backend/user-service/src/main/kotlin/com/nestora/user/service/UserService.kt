package com.nestora.user.service

import com.nestora.common.dto.UserDto
import com.nestora.common.exception.BadRequestException
import com.nestora.common.exception.ResourceNotFoundException
import com.nestora.common.security.JwtUtil
import com.nestora.user.entity.KycVerification
import com.nestora.user.entity.User
import com.nestora.user.repository.KycVerificationRepository
import com.nestora.user.repository.UserRepository
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono
import reactor.core.publisher.Flux
import java.time.Instant
import java.util.concurrent.ConcurrentHashMap

@Service
class UserService(
    private val userRepository: UserRepository,
    private val kycVerificationRepository: KycVerificationRepository,
    private val passwordEncoder: PasswordEncoder
) {
    // In-memory store for OTPs (simulating Redis/DB store for active OTP lifecycle)
    private val otpStore = ConcurrentHashMap<String, String>()

    fun register(email: String, phoneNumber: String?, passwordHash: String, fullName: String, role: String): Mono<UserDto> {
        return userRepository.findByEmail(email)
            .flatMap<UserDto> { Mono.error(BadRequestException("Email already registered")) }
            .switchIfEmpty(
                userRepository.save(
                    User(
                        email = email,
                        phone_number = phoneNumber,
                        password_hash = passwordEncoder.encode(passwordHash),
                        full_name = fullName,
                        role = role
                    )
                ).map { toDto(it) }
            )
    }

    fun login(emailOrPhone: String, passwordHash: String): Mono<Map<String, Any>> {
        val findUser = if (emailOrPhone.contains("@")) {
            userRepository.findByEmail(emailOrPhone)
        } else {
            userRepository.findByPhoneNumber(emailOrPhone)
        }

        return findUser
            .switchIfEmpty(Mono.error(ResourceNotFoundException("User not found")))
            .flatMap { user ->
                if (passwordEncoder.matches(passwordHash, user.password_hash)) {
                    val token = JwtUtil.generateToken(user.email, user.role)
                    Mono.just(mapOf(
                        "token" to token,
                        "email" to user.email,
                        "role" to user.role,
                        "fullName" to user.full_name,
                        "isVerified" to user.is_verified
                    ))
                } else {
                    Mono.error(BadRequestException("Invalid credentials"))
                }
            }
    }

    fun sendOtp(phoneNumber: String): Mono<String> {
        val otp = (100000..999999).random().toString()
        otpStore[phoneNumber] = otp
        // In a real application, call Twilio service here.
        println("---------- [SMS MOCK OTP] Sent OTP to $phoneNumber: $otp ----------")
        return Mono.just(otp)
    }

    fun verifyOtp(phoneNumber: String, code: String): Mono<Map<String, Any>> {
        val storedOtp = otpStore[phoneNumber]
        if (storedOtp == null || storedOtp != code) {
            return Mono.error(BadRequestException("Invalid or expired OTP"))
        }
        otpStore.remove(phoneNumber) // Consume OTP

        // Retrieve user, if not exists, create a default buyer profile
        return userRepository.findByPhoneNumber(phoneNumber)
            .switchIfEmpty(
                userRepository.save(
                    User(
                        email = "$phoneNumber@nestora.com",
                        phone_number = phoneNumber,
                        password_hash = passwordEncoder.encode("defaultOTPPassword123"),
                        full_name = "User $phoneNumber",
                        role = "BUYER"
                    )
                )
            )
            .map { user ->
                val token = JwtUtil.generateToken(user.email, user.role)
                mapOf(
                    "token" to token,
                    "email" to user.email,
                    "role" to user.role,
                    "fullName" to user.full_name,
                    "isVerified" to user.is_verified
                )
            }
    }

    fun getProfile(email: String): Mono<UserDto> {
        return userRepository.findByEmail(email)
            .switchIfEmpty(Mono.error(ResourceNotFoundException("User profile not found")))
            .map { toDto(it) }
    }

    fun updateProfile(email: String, fullName: String, phoneNumber: String?): Mono<UserDto> {
        return userRepository.findByEmail(email)
            .switchIfEmpty(Mono.error(ResourceNotFoundException("User not found")))
            .flatMap { user ->
                userRepository.save(user.copy(
                    full_name = fullName,
                    phone_number = phoneNumber ?: user.phone_number,
                    updated_at = Instant.now()
                ))
            }
            .map { toDto(it) }
    }

    fun submitKyc(email: String, documentType: String, documentNumber: String, documentImageUrl: String): Mono<KycVerification> {
        return userRepository.findByEmail(email)
            .switchIfEmpty(Mono.error(ResourceNotFoundException("User not found")))
            .flatMap { user ->
                kycVerificationRepository.findByUserId(user.id!!)
                    .flatMap { existing ->
                        kycVerificationRepository.save(existing.copy(
                            documentType = documentType,
                            documentNumber = documentNumber,
                            documentImageUrl = documentImageUrl,
                            status = "PENDING",
                            submittedAt = Instant.now()
                        ))
                    }
                    .switchIfEmpty(
                        kycVerificationRepository.save(
                            KycVerification(
                                userId = user.id,
                                documentType = documentType,
                                documentNumber = documentNumber,
                                documentImageUrl = documentImageUrl
                            )
                        )
                    )
            }
    }

    fun getKycStatus(email: String): Mono<KycVerification> {
        return userRepository.findByEmail(email)
            .switchIfEmpty(Mono.error(ResourceNotFoundException("User not found")))
            .flatMap { user ->
                kycVerificationRepository.findByUserId(user.id!!)
                    .switchIfEmpty(Mono.error(ResourceNotFoundException("No KYC request found")))
            }
    }

    fun reviewKyc(userId: Long, status: String, reason: String?, adminId: Long): Mono<Void> {
        return kycVerificationRepository.findByUserId(userId)
            .switchIfEmpty(Mono.error(ResourceNotFoundException("KYC request not found")))
            .flatMap { verification ->
                val updatedVerification = verification.copy(
                    status = status,
                    rejectionReason = reason,
                    reviewedAt = Instant.now(),
                    reviewedByAdminId = adminId
                )
                kycVerificationRepository.save(updatedVerification)
                    .flatMap {
                        if (status == "APPROVED") {
                            userRepository.findById(userId)
                                .flatMap { user ->
                                    userRepository.save(user.copy(is_verified = true, updated_at = Instant.now()))
                                }
                                .then()
                        } else {
                            Mono.empty<Void>()
                        }
                    }
            }
    }

    fun getPendingKyc(): Flux<KycVerification> {
        return kycVerificationRepository.findByStatus("PENDING")
    }

    fun changePassword(email: String, currentPassword: String, newPassword: String): Mono<Void> {
        if (newPassword.length < 8) {
            return Mono.error(BadRequestException("New password must be at least 8 characters"))
        }
        return userRepository.findByEmail(email)
            .switchIfEmpty(Mono.error(ResourceNotFoundException("User not found")))
            .flatMap { user ->
                if (!passwordEncoder.matches(currentPassword, user.password_hash)) {
                    Mono.error(BadRequestException("Current password is incorrect"))
                } else {
                    userRepository.save(
                        user.copy(
                            password_hash = passwordEncoder.encode(newPassword),
                            updated_at = Instant.now()
                        )
                    ).then()
                }
            }
    }
    fun updateProfilePicture(email: String, imageUrl: String): Mono<UserDto> {
        if (imageUrl.isBlank()) {
            return Mono.error(BadRequestException("Image URL must not be blank"))
        }
        return userRepository.findByEmail(email)
            .switchIfEmpty(Mono.error(ResourceNotFoundException("User not found")))
            .flatMap { user ->
                userRepository.save(
                    user.copy(
                        profile_picture_url = imageUrl,
                        updated_at = Instant.now()
                    )
                )
            }
            .map { toDto(it) }
    }

    private fun toDto(user: User) = UserDto(
        id = user.id,
        email = user.email,
        phone_number = user.phone_number,
        full_name = user.full_name,
        role = user.role,
        profile_picture_url = user.profile_picture_url,
        is_verified = user.is_verified,
        created_at = user.created_at,
        updated_at = user.updated_at
    )
}
