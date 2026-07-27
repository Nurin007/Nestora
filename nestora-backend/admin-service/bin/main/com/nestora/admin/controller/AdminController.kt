package com.nestora.admin.controller

import com.nestora.admin.client.UserAdminClient
import com.nestora.admin.entity.AuditLog
import com.nestora.admin.entity.Complaint
import com.nestora.admin.service.AdminService
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@RestController
@RequestMapping("/api/v1/admin")
class AdminController(
    private val adminService: AdminService,
    private val userAdminClient: UserAdminClient
) {

    @PostMapping("/kyc/{userId}/review")
    fun reviewKyc(
        @RequestHeader("X-User-Email") email: String,
        @PathVariable userId: Long,
        @RequestBody request: AdminService.ReviewKycRequest
    ): Mono<Void> {
        return userAdminClient.getUserProfile(email)
            .flatMap { user ->
                adminService.reviewKyc(user.id!!, userId, request)
            }
    }

    @PostMapping("/properties/{propertyId}/review")
    fun reviewProperty(
        @RequestHeader("X-User-Email") email: String,
        @PathVariable propertyId: Long,
        @RequestBody request: AdminService.ReviewPropertyRequest
    ): Mono<Void> {
        return userAdminClient.getUserProfile(email)
            .flatMap { user ->
                adminService.reviewProperty(user.id!!, propertyId, request)
            }
    }

    @PostMapping("/complaints")
    fun fileComplaint(
        @RequestHeader("X-User-Email") email: String,
        @RequestBody request: AdminService.FileComplaintRequest
    ): Mono<Complaint> {
        return userAdminClient.getUserProfile(email)
            .flatMap { user ->
                adminService.fileComplaint(user.id!!, request)
            }
    }

    @PostMapping("/complaints/{id}/resolve")
    fun resolveComplaint(
        @RequestHeader("X-User-Email") email: String,
        @PathVariable id: Long,
        @RequestBody request: AdminService.ResolveComplaintRequest
    ): Mono<Complaint> {
        return userAdminClient.getUserProfile(email)
            .flatMap { user ->
                adminService.resolveComplaint(id, user.id!!, request)
            }
    }

    @GetMapping("/complaints")
    fun getComplaints(
        @RequestParam(required = false) status: String?
    ): Flux<Complaint> {
        return adminService.getComplaints(status)
    }

    @GetMapping("/logs")
    fun getAuditLogs(): Flux<AuditLog> {
        return adminService.getAuditLogs()
    }

    @GetMapping("/analytics")
    fun getAnalytics(@RequestHeader("X-User-Email") email: String): Mono<AdminService.PlatformAnalytics> {
        return userAdminClient.getUserProfile(email)
            .flatMap { user ->
                adminService.getAnalytics(user.id!!)
            }
    }
}
