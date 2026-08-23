package com.nestora.booking.service

import com.nestora.common.exception.BadRequestException
import com.nestora.common.exception.ResourceNotFoundException
import com.nestora.booking.client.PropertyServiceClient
import com.nestora.booking.entity.Booking
import com.nestora.booking.entity.BookingHistory
import com.nestora.booking.repository.BookingHistoryRepository
import com.nestora.booking.repository.BookingRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.time.Instant
import java.time.LocalDate

@Service
class BookingService(
    private val bookingRepository: BookingRepository,
    private val historyRepository: BookingHistoryRepository,
    private val propertyServiceClient: PropertyServiceClient
) {

    data class CreateBookingRequest(
        val propertyId: Long,
        val visitDate: LocalDate,
        val visitTimeSlot: String,
        val remarks: String?
    )

    data class RescheduleRequest(
        val visitDate: LocalDate,
        val visitTimeSlot: String,
        val reason: String
    )

    @Transactional
    fun createBooking(buyerId: Long, request: CreateBookingRequest): Mono<Booking> {
        // Validate property existence
        return propertyServiceClient.getProperty(request.propertyId)
            .switchIfEmpty(Mono.error(ResourceNotFoundException("Property not found")))
            .flatMap { property ->
                val booking = Booking(
                    propertyId = request.propertyId,
                    buyerId = buyerId,
                    visitDate = request.visitDate,
                    visitTimeSlot = request.visitTimeSlot,
                    remarks = request.remarks
                )
                bookingRepository.save(booking)
                    .flatMap { saved ->
                        val history = BookingHistory(
                            bookingId = saved.id!!,
                            status = "PENDING",
                            updateReason = "Booking request submitted",
                            updatedBy = buyerId
                        )
                        historyRepository.save(history).map { saved }
                    }
            }
    }

    @Transactional
    fun rescheduleBooking(bookingId: Long, userId: Long, request: RescheduleRequest): Mono<Booking> {
        return bookingRepository.findById(bookingId)
            .switchIfEmpty(Mono.error(ResourceNotFoundException("Booking not found")))
            .flatMap { booking ->
                // Check if requester is buyer or owner
                propertyServiceClient.getProperty(booking.propertyId)
                    .flatMap { prop ->
                        if (booking.buyerId != userId && prop.ownerId != userId) {
                            Mono.error(BadRequestException("Unauthorized operation"))
                        } else {
                            val updated = booking.copy(
                                visitDate = request.visitDate,
                                visitTimeSlot = request.visitTimeSlot,
                                status = "RESCHEDULED",
                                updatedAt = Instant.now()
                            )
                            bookingRepository.save(updated)
                                .flatMap { saved ->
                                    val history = BookingHistory(
                                        bookingId = saved.id!!,
                                        status = "RESCHEDULED",
                                        updateReason = request.reason,
                                        updatedBy = userId
                                    )
                                    historyRepository.save(history).map { saved }
                                }
                        }
                    }
            }
    }

    @Transactional
    fun updateStatus(bookingId: Long, userId: Long, status: String, reason: String?): Mono<Booking> {
        return bookingRepository.findById(bookingId)
            .switchIfEmpty(Mono.error(ResourceNotFoundException("Booking not found")))
            .flatMap { booking ->
                propertyServiceClient.getProperty(booking.propertyId)
                    .flatMap { prop ->
                        if (booking.buyerId != userId && prop.ownerId != userId) {
                            Mono.error(BadRequestException("Unauthorized status modification"))
                        } else {
                            val updated = booking.copy(status = status, updatedAt = Instant.now())
                            bookingRepository.save(updated)
                                .flatMap { saved ->
                                    val history = BookingHistory(
                                        bookingId = saved.id!!,
                                        status = status,
                                        updateReason = reason ?: "Status updated to $status",
                                        updatedBy = userId
                                    )
                                    historyRepository.save(history).map { saved }
                                }
                        }
                    }
            }
    }

    fun getBookingDetails(bookingId: Long, userId: Long): Mono<Booking> {
        return bookingRepository.findById(bookingId)
            .switchIfEmpty(Mono.error(ResourceNotFoundException("Booking not found")))
            .flatMap { booking ->
                propertyServiceClient.getProperty(booking.propertyId)
                    .flatMap { prop ->
                        if (booking.buyerId != userId && prop.ownerId != userId) {
                            Mono.error(BadRequestException("Unauthorized view"))
                        } else {
                            Mono.just(booking)
                        }
                    }
            }
    }

    fun getBookingHistory(bookingId: Long): Flux<BookingHistory> {
        return historyRepository.findByBookingId(bookingId)
    }

    fun getBuyerBookings(buyerId: Long): Flux<Booking> {
        return bookingRepository.findByBuyerId(buyerId)
    }

    fun getAllBookings(): Flux<Booking> {
        return bookingRepository.findAll()
    }

    @Transactional
    fun adminUpdateStatus(bookingId: Long, status: String, reason: String?): Mono<Booking> {
        return bookingRepository.findById(bookingId)
            .switchIfEmpty(Mono.error(ResourceNotFoundException("Booking not found")))
            .flatMap { booking ->
                val updated = booking.copy(status = status, updatedAt = Instant.now())
                bookingRepository.save(updated)
                    .flatMap { saved ->
                        val history = BookingHistory(
                            bookingId = saved.id!!,
                            status = status,
                            updateReason = reason ?: "Status updated by Admin to $status",
                            updatedBy = 1L
                        )
                        historyRepository.save(history).map { saved }
                    }
            }
    }
}
