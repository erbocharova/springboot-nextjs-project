package ru.book_on_hook.backend_service.controller

import jakarta.servlet.http.Cookie
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import ru.book_on_hook.backend_service.dto.UserDto
import ru.book_on_hook.backend_service.security.CustomUserDetails
import ru.book_on_hook.backend_service.security.JwtUtil
import ru.book_on_hook.backend_service.services.BooksService
import ru.book_on_hook.backend_service.services.UserService

// - Контроллер приложения, который обрабатывает входящие с фронта запросы.
//1. Функции обработки начинаются с     @GetMapping("/api/путь-как-в-функции-фронта-которая-отправляет-запрос").
//Все роуты здесь начинаются с "/api".
//2. Функции здесь сами ничего из базы не достают, не записывают и т.д., они вызывают функции соответствующие методы сервисов (например, UserService)
@RestController
class UserController(

    private val userService: UserService,
    private val jwtUtil: JwtUtil
) {

    @GetMapping("/api/my-profile")
        fun getUser(@AuthenticationPrincipal currentUser: CustomUserDetails): ResponseEntity<UserDto> {
            val userDto = userService.mapUserToDto(currentUser)
            return ResponseEntity.ok(userDto)
        }


        @PostMapping("api/auth/signup")
    fun signupUser(@RequestBody request: SignupRequest): ResponseEntity<*> {
        if (userService.existsByUsername(request.username)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Такой пользователь уже существует")
        }
        val createdUser = userService.createUser(
            request.username,
            request.password,
            request.firstName,
            request.lastName,
            request.birthDate
        )
        val token = jwtUtil.generateToken(createdUser.username)
        return ResponseEntity.status(HttpStatus.CREATED).body(mapOf("token" to token))
    }

    @PostMapping("/api/auth/signin")
    fun authenticateUser(@RequestBody request: LoginRequest): ResponseEntity<String> {
        val user = userService.getUserByUsername(request.username)
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Пользователь с таким логином не найден")
        }

        if (!userService.validatePassword(request.password, user.passwordHash)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Неверный пароль")
        }

        val token = jwtUtil.generateToken(user.username)
        return ResponseEntity.ok(token)
    }

    @PostMapping("/api/auth/logout")
    fun logout(response: HttpServletResponse): ResponseEntity<Unit> {
        // Устанавливаем максимальный возраст куки равным 0, чтобы немедленно удалить её
        val cookie = Cookie("token", "")
        cookie.maxAge = 0
        cookie.path = "/" // важный параметр, чтобы cookie работала на всех путях
        response.addCookie(cookie)

        return ResponseEntity.noContent().build()
    }

    /*
    * 1. пользователь
    * 2. товары
    * 3. корзина
     */
}

data class LoginRequest(val username: String, val password: String)
data class SignupRequest(val username: String, val password: String, val firstName: String, val lastName: String, val birthDate: String)