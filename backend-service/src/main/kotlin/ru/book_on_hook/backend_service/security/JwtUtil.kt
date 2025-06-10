package ru.book_on_hook.backend_service.security

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.nio.charset.StandardCharsets
import java.security.Key
import java.util.Date
import javax.crypto.spec.SecretKeySpec

//Генерация токенов авторизации и методы с ней связанные
@Component
class JwtUtil(

    @Value("\${jwt.secret}") private val secret: String,
    @Value("\${jwt.expiration}") private val expirationTimeMs: Long
) {

    fun extractUsernameFromToken(token: String): String {
        val claims: Claims = parseClaimsFromToken(token)
        return claims.subject
    }

    private fun parseClaimsFromToken(token: String): Claims {
        return Jwts.parserBuilder()
            .setSigningKey(getSigningKey())
            .build()
            .parseClaimsJws(token)
            .body
    }

    private fun getSigningKey(): Key {
        val keyBytes = secret.toByteArray(StandardCharsets.UTF_8) // Прямо конвертируем строку в byte array
        return SecretKeySpec(keyBytes, SignatureAlgorithm.HS256.jcaName)
    }

    fun generateToken(subject: String): String {
        val nowMillis = System.currentTimeMillis()
        val expMillis = nowMillis + expirationTimeMs
        return Jwts.builder()
            .setSubject(subject)
            .setIssuedAt(Date(nowMillis))
            .setExpiration(Date(expMillis))
            .signWith(getSigningKey())
            .compact()
    }

    fun validateToken(token: String): Boolean {
        try {
            Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
            return true
        } catch (ex: Exception) {
            return false
        }
    }
}