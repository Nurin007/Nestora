package com.nestora.admin.service

import com.nestora.admin.client.UserAdminClient
import com.nestora.admin.client.PropertyAdminClient
import com.nestora.admin.entity.AuditLog
import com.nestora.admin.entity.Complaint
import com.nestora.admin.repository.AuditLogRepository
import com.nestora.admin.repository.ComplaintRepository
import com.nestora.common.exception.BadRequestException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.time.Instant

@Service
class AdminService(
    private val auditLogRepository: AuditLogRepository,
    private val complaintRepository: ComplaintRepository,
    private val userAdminClient: UserAdminClient,
    private val propertyAdminClient: PropertyAdminClient
) {

    data class ReviewKycRequest(
        val status: String, // APPROVED, REJECTED
        val reason: String?
    )

    data class ReviewPropertyRequest(
        val status: String, // APPROVED, REJECTED
        val reason: String?
    )

    data class FileComplaintRequest(
        val propertyId: Long,
        val description: String
    )

    data class ResolveComplaintRequest(
        val resolutionDetails: String
    )

    data class PlatformAnalytics(
        val totalUsers: Long,
        val totalProperties: Long,
        val totalBookings: Long,
        val activeComplaints: Long,
        val generatedAt: Instant
    )

    @Transactional
    fun reviewKyc(adminId: Long, userId: Long, request: ReviewKycRequest): Mono<Void> {
        return userAdminClient.reviewKyc(userId, adminId, request.status, request.reason)
            .then(
                auditLogRepository.save(
                    AuditLog(
                        adminId = adminId,
                        action = "REVIEW_KYC",
                        targetType = "USER",
                        targetId = userId,
                        remarks = "KYC Status updated to: ${request.status}. Reason: ${request.reason ?: 'N/A'}"
                    )
                )
            ).then()
    }

    @Transactional
    fun reviewProperty(adminId: Long, propertyId: Long, request: ReviewPropertyRequest): Mono<Void> {
        return propertyAdminClient.reviewProperty(propertyId, adminId, request.status, request.reason)
            .then(
                auditLogRepository.save(
                    AuditLog(
                        adminId = adminId,
                        action = "REVIEW_PROPERTY",
                        targetType = "PROPERTY",
                        targetId = propertyId,
                        remarks = "Property status updated to: ${request.status}. Reason: ${request.reason ?: 'N/A'}"
                    )
                )
            ).then()
    }

    fun fileComplaint(userId: Long, request: FileComplaintRequest): Mono<Complaint> {
        val complaint = Complaint(
            userId = userId,
            propertyId = request.propertyId,
            description = request.description
        )
        return complaintRepository.save(complaint)
    }

    fun resolveComplaint(complaintId: Long, adminId: Long, request: ResolveComplaintRequest): Mono<Complaint> {
        return complaintRepository.findById(complaintId)
            .flatMap { complaint ->
                val resolved = complaint.copy(
                    status = "RESOLVED",
                    resolutionDetails = request.resolutionDetails,
                    updatedAt = Instant.now()
                )
                complaintRepository.save(resolved)
                    .flatMap { saved ->
                        auditLogRepository.save(
                            AuditLog(
                                adminId = adminId,
                                action = "RESOLVE_COMPLAINT",
                                targetType = "COMPLAINT",
                                targetId = complaintId,
                                remarks = "Complaint marked resolved with resolution: ${request.resolutionDetails}"
                            )
                        ).map { saved }
                    }
            }
    }

    fun getComplaints(status: String?): Flux<Complaint> {
        return if (status != null) {
            complaintRepository.findByStatus(status)
        } else {
            complaintRepository.findAll()
        }
    }

    fun getAuditLogs(): Flux<AuditLog> {
        return auditLogRepository.findAll()
    }

    fun getAnalytics(adminId: Long): Mono<PlatformAnalytics> {
        // In a production environment, gather database queries across services
        // Mocking statistics for local execution environment
        return Mono.just(
            PlatformAnalytics(
                totalUsers = 154L,
                totalProperties = 342L,
                totalBookings = 78L,
                activeComplaints = 4L,
                generatedAt = Instant.now()
            )
        )
    }
}
