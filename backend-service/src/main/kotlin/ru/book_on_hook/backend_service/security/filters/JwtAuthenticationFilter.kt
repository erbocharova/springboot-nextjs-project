package ru.book_on_hook.backend_service.security.filters

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import ru.book_on_hook.backend_service.security.JwtUtil
import ru.book_on_hook.backend_service.services.CustomUserDetailsService

@Component
class JwtAuthenticationFilter(

    private val jwtUtil: JwtUtil,
    private val customUserDetailsService: CustomUserDetailsService
) : OncePerRequestFilter() {

    override fun doFilterInternal(request: HttpServletRequest, response: HttpServletResponse, chain: FilterChain) {
        try {
            val jwt = parseJwt(request)
            if (jwt != null && jwtUtil.validateToken(jwt)) {
                val username = jwtUtil.extractUsernameFromToken(jwt)
                val role = jwtUtil.extractRoleFromToken(jwt)

                // Загружаем UserDetails (опционально - можно извлекать из токена)
                val userDetails = customUserDetailsService.loadUserByUsername(username)

                // Создаем аутентификацию
                val authentication = UsernamePasswordAuthenticationToken(
                    userDetails,
                    null,
                    userDetails.authorities
                ).apply {
                    details = WebAuthenticationDetailsSource().buildDetails(request)
                }

                SecurityContextHolder.getContext().authentication = authentication
                logger.debug("Authenticated user: $username with roles: ${userDetails.authorities}")
            }
        } catch (e: Exception) {
            logger.error("Cannot set user authentication", e)
            // Не прерываем цепочку, чтобы Spring Security мог обработать ошибку
        }

        chain.doFilter(request, response)
    }

    private fun parseJwt(request: HttpServletRequest): String? {
        val headerAuth = request.getHeader("Authorization")
        return if (headerAuth != null && headerAuth.startsWith("Bearer ")) {
            headerAuth.substring(7)
        } else {
            null
        }
    }
}