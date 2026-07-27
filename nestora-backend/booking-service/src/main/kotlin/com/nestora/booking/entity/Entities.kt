package com.nestora.booking.entity

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table
import java.time.Instant
import java.time.LocalDate

@Table("bookings")
data class Booking(
    @Id val id: Long? = null,
    val propertyId: Long,
    val buyerId: Long,
    val visitDate: LocalDate,
    val visitTimeSlot: String,
    val status: String = "PENDING", // PENDING, CONFIRMED, RESCHEDULED, CANCELLED
    val remarks: String? = null,
    val createdAt: Instant = Instant.now(),
    val updatedAt: Instant = Instant.now()
)

@Table("booking_history")
data class BookingHistory(
    @Id val id: Long? = null,
    val bookingId: Long,
    val status: String,
    val updateReason: String?,
    val updatedBy: Long,
    val updatedAt: Instant = Instant.now()
)
