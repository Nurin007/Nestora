package com.nestora.user.controller

import com.nestora.common.dto.UserDto
import com.nestora.user.service.UserService
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono

@RestController
@RequestMapping("/api/v1/auth")
class AuthController(private val userService: UserService) {

    data class RegisterRequest(
        val email: String,
        val phoneNumber: String?,
        val password: String,
        val fullName: String,
        val role: String
    )

    data class LoginRequest(
        val emailOrPhone: String,
        val password: String
    )

    data class SendOtpRequest(val phoneNumber: String)
    data class VerifyOtpRequest(val phoneNumber: String, val code: String)

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    fun register(@RequestBody request: RegisterRequest): Mono<UserDto> {
        return userService.register(
            email = request.email,
            phoneNumber = request.phoneNumber,
            passwordHash = request.password,
            fullName = request.fullName,
            role = request.role
        )
    }

    @PostMapping("/login")
    fun login(@RequestBody request: LoginRequest): Mono<Map<String, Any>> {
        return userService.login(request.emailOrPhone, request.password)
    }

    @PostMapping("/otp/send")
    fun sendOtp(@RequestBody request: SendOtpRequest): Mono<Map<String, String>> {
        return userService.sendOtp(request.phoneNumber)
            .map { mapOf("status" to "SENT", "otp_debug" to it) }
    }

    @PostMapping("/otp/verify")
    fun verifyOtp(@RequestBody request: VerifyOtpRequest): Mono<Map<String, Any>> {
        return userService.verifyOtp(request.phoneNumber, request.code)
    }
}
