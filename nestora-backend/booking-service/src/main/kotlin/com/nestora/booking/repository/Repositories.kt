package com.nestora.booking.repository

import com.nestora.booking.entity.Booking
import com.nestora.booking.entity.BookingHistory
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

interface BookingRepository : ReactiveCrudRepository<Booking, Long> {
    fun findByBuyerId(buyerId: Long): Flux<Booking>
    fun findByPropertyId(propertyId: Long): Flux<Booking>
}

interface BookingHistoryRepository : ReactiveCrudRepository<BookingHistory, Long> {
    fun findByBookingId(bookingId: Long): Flux<BookingHistory>
}
