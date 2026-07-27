package com.nestora.common.dto

import java.time.Instant

data class UserDto(
    val id: Long?,
    val email: String,
    val phone_number: String?,
    val full_name: String,
    val role: String,
    val profile_picture_url: String?,
    val is_verified: Boolean,
    val created_at: Instant?,
    val updated_at: Instant?
)
