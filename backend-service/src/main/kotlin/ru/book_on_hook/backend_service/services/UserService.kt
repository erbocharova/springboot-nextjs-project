package ru.book_on_hook.backend_service.services

import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import ru.book_on_hook.backend_service.dao.User
import ru.book_on_hook.backend_service.dto.UserDto
import ru.book_on_hook.backend_service.repository.UserRepository

//Сервис пользователей, реализующий методы взаимводействия с базой
@Service
class UserService(

    private val userRepository: UserRepository,
    private val encoder: PasswordEncoder
) {

    fun existsByUsername(username: String): Boolean {
        return userRepository.existsByUsername(username)
    }

    fun getUserByUsername(username: String): User? {
    val result = userRepository.findByUsername(username).orElse(null)
    return result
    }

    fun findAllUsers(): List<User> {
        val result = userRepository.findAll()
        return result
    }

    fun createUser(username: String, rawPassword: String, firstName: String, lastName: String, birthDate: String): User {
        val encodedPassword = encoder.encode(rawPassword)
        return userRepository.save(User(
            username = username,
            passwordHash = encodedPassword,
            firstName = firstName,
            lastName = lastName,
            birthDate = birthDate,
            role = User.Role.ADMIN))
    }

     fun mapUserToDto(user: User): UserDto {
        return UserDto(
            username = user.username,
            firstName = user.firstName,
            lastName = user.lastName,
            birthDate = user.birthDate
        )
    }
}