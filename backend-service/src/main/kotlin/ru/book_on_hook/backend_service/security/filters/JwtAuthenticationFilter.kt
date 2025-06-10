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
        val header = request.getHeader("Authorization")
        if (header.isNullOrBlank() || !header.startsWith("Bearer ")) {
            chain.doFilter(request, response)
            return
        }

        val jwtToken = header.substring(7) // "Bearer " длина 7 символов
        if (!jwtUtil.validateToken(jwtToken)) {
            chain.doFilter(request, response)
            return
        }

        val username = jwtUtil.extractUsernameFromToken(jwtToken)
        val userDetails = customUserDetailsService.loadUserByUsername(username)

        val authentication = UsernamePasswordAuthenticationToken(
            userDetails, null, userDetails.authorities
        ).apply {
            details = WebAuthenticationDetailsSource().buildDetails(request)
        }

        SecurityContextHolder.getContext().authentication = authentication
        chain.doFilter(request, response)
    }
}