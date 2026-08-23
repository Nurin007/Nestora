package com.nestora.booking.controller

import com.nestora.booking.client.UserServiceClient
import com.nestora.booking.entity.Booking
import com.nestora.booking.entity.BookingHistory
import com.nestora.booking.service.BookingService
import com.nestora.common.exception.BadRequestException
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@RestController
@RequestMapping("/api/v1/bookings")
class BookingController(
    private val bookingService: BookingService,
    private val userServiceClient: UserServiceClient
) {

    @PostMapping
    fun createBooking(
        @RequestHeader("X-User-Email") email: String,
        @RequestBody request: BookingService.CreateBookingRequest
    ): Mono<Booking> {
        return userServiceClient.getUserProfile(email)
            .flatMap { user ->
                bookingService.createBooking(user.id!!, request)
            }
    }

    @PutMapping("/{id}/reschedule")
    fun rescheduleBooking(
        @RequestHeader("X-User-Email") email: String,
        @PathVariable id: Long,
        @RequestBody request: BookingService.RescheduleRequest
    ): Mono<Booking> {
        return userServiceClient.getUserProfile(email)
            .flatMap { user ->
                bookingService.rescheduleBooking(id, user.id!!, request)
            }
    }

    @PatchMapping("/{id}/status")
    fun updateStatus(
        @RequestHeader("X-User-Email") email: String,
        @PathVariable id: Long,
        @RequestParam status: String,
        @RequestParam(required = false) reason: String?
    ): Mono<Booking> {
        return userServiceClient.getUserProfile(email)
            .flatMap { user ->
                bookingService.updateStatus(id, user.id!!, status, reason)
            }
    }

    @GetMapping("/{id}")
    fun getBookingDetails(
        @RequestHeader("X-User-Email") email: String,
        @PathVariable id: Long
    ): Mono<Booking> {
        return userServiceClient.getUserProfile(email)
            .flatMap { user ->
                bookingService.getBookingDetails(id, user.id!!)
            }
    }

    @GetMapping("/{id}/history")
    fun getBookingHistory(@PathVariable id: Long): Flux<BookingHistory> {
        return bookingService.getBookingHistory(id)
    }

    @GetMapping("/history")
    fun getBuyerBookings(@RequestHeader("X-User-Email") email: String): Flux<Booking> {
        return userServiceClient.getUserProfile(email)
            .flatMapMany { user ->
                bookingService.getBuyerBookings(user.id!!)
            }
    }

    @GetMapping("/admin/all")
    fun getAllBookings(@RequestHeader("X-User-Role") role: String): Flux<Booking> {
        if (role != "ADMIN") {
            return Flux.error(BadRequestException("Unauthorized access: ADMIN role required"))
        }
        return bookingService.getAllBookings()
    }

    @PatchMapping("/admin/{id}/status")
    fun adminUpdateStatus(
        @RequestHeader("X-User-Role") role: String,
        @PathVariable id: Long,
        @RequestParam status: String,
        @RequestParam(required = false) reason: String?
    ): Mono<Booking> {
        if (role != "ADMIN") {
            return Mono.error(BadRequestException("Unauthorized access: ADMIN role required"))
        }
        return bookingService.adminUpdateStatus(id, status, reason)
    }
}
