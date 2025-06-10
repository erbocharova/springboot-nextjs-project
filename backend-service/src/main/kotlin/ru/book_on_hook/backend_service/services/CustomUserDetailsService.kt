package ru.book_on_hook.backend_service.services

import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service
import ru.book_on_hook.backend_service.repository.UserRepository
import ru.book_on_hook.backend_service.security.CustomUserDetails

@Service
class CustomUserDetailsService(

    private val userRepository: UserRepository
) : UserDetailsService {

    override fun loadUserByUsername(username: String): UserDetails {
        val user = userRepository.findByUsername(username)
            ?.orElseThrow { UsernameNotFoundException("Пользователь с именем '$username' не найден.") }
        return CustomUserDetails(requireNotNull(user))
    }
}