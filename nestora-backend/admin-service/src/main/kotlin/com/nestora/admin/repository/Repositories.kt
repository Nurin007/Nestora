package com.nestora.admin.repository

import com.nestora.admin.entity.AuditLog
import com.nestora.admin.entity.Complaint
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Flux

interface AuditLogRepository : ReactiveCrudRepository<AuditLog, Long> {
    fun findByAdminId(adminId: Long): Flux<AuditLog>
}

interface ComplaintRepository : ReactiveCrudRepository<Complaint, Long> {
    fun findByStatus(status: String): Flux<Complaint>
    fun findByPropertyId(propertyId: Long): Flux<Complaint>
}
