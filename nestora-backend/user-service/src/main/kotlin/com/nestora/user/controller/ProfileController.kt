package com.nestora.user.controller

import com.nestora.common.dto.UserDto
import com.nestora.user.entity.KycVerification
import com.nestora.user.service.UserService
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono

@RestController
@RequestMapping("/api/v1")
class ProfileController(private val userService: UserService) {

    data class UpdateProfileRequest(
        val fullName: String,
        val phoneNumber: String?
    )

    data class SubmitKycRequest(
        val documentType: String, // NID, TRADE_LICENSE
        val documentNumber: String,
        val documentImageUrl: String
    )

    data class ChangePasswordRequest(
        val currentPassword: String,
        val newPassword: String
    )

    @GetMapping("/profile")
    fun getProfile(@RequestHeader("X-User-Email") email: String): Mono<UserDto> {
        return userService.getProfile(email)
    }

    @PutMapping("/profile")
    fun updateProfile(
        @RequestHeader("X-User-Email") email: String,
        @RequestBody request: UpdateProfileRequest
    ): Mono<UserDto> {
        return userService.updateProfile(email, request.fullName, request.phoneNumber)
    }

    @PostMapping("/kyc/submit")
    fun submitKyc(
        @RequestHeader("X-User-Email") email: String,
        @RequestBody request: SubmitKycRequest
    ): Mono<KycVerification> {
        return userService.submitKyc(
            email = email,
            documentType = request.documentType,
            documentNumber = request.documentNumber,
            documentImageUrl = request.documentImageUrl
        )
    }

    @GetMapping("/kyc/status")
    fun getKycStatus(@RequestHeader("X-User-Email") email: String): Mono<KycVerification> {
        return userService.getKycStatus(email)
    }

    @PutMapping("/profile/password")
    fun changePassword(
        @RequestHeader("X-User-Email") email: String,
        @RequestBody request: ChangePasswordRequest
    ): Mono<Void> {
        return userService.changePassword(email, request.currentPassword, request.newPassword)
    }

    @PatchMapping("/profile/picture")
    fun updateProfilePicture(
        @RequestHeader("X-User-Email") email: String,
        @RequestBody request: Map<String, String>
    ): Mono<UserDto> {
        val imageUrl = request["imageUrl"] ?: return Mono.error(
            com.nestora.common.exception.BadRequestException("imageUrl is required")
        )
        return userService.updateProfilePicture(email, imageUrl)
    }
}
