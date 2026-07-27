package com.nestora.common.security

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.security.Keys
import java.security.Key
import java.util.Date

object JwtUtil {
    private const val SECRET_STRING = "nestoraSuperSecretKeyThatIsAtLeast256BitsLongForHMACSHA256"
    private val KEY: Key = Keys.hmacShaKeyFor(SECRET_STRING.toByteArray())
    private const val EXPIRATION_TIME_MS = 86400000 // 24 hours

    fun generateToken(username: String, role: String): String {
        val claims = Jwts.claims().setSubject(username)
        claims["role"] = role
        
        val now = Date()
        val validity = Date(now.time + EXPIRATION_TIME_MS)

        return Jwts.builder()
            .setClaims(claims)
            .setIssuedAt(now)
            .setExpiration(validity)
            .signWith(KEY, SignatureAlgorithm.HS256)
            .compact()
    }

    fun validateToken(token: String): Boolean {
        return try {
            val claims = getClaims(token)
            !claims.expiration.before(Date())
        } catch (e: Exception) {
            false
        }
    }

    fun getUsername(token: String): String {
        return getClaims(token).subject
    }

    fun getRole(token: String): String {
        return getClaims(token)["role"] as String
    }

    private fun getClaims(token: String): Claims {
        return Jwts.parserBuilder()
            .setSigningKey(KEY)
            .build()
            .parseClaimsJws(token)
            .body
    }
}
