package ru.book_on_hook.backend_service.controller

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RestController
import ru.book_on_hook.backend_service.dao.Book
import ru.book_on_hook.backend_service.security.JwtUtil
import ru.book_on_hook.backend_service.services.BooksService
import ru.book_on_hook.backend_service.services.UserService

// - Контроллер приложения, который обрабатывает входящие с фронта запросы.
//1. Функции обработки начинаются с     @GetMapping("/api/путь-как-в-функции-фронта-которая-отправляет-запрос").
//Все роуты здесь начинаются с "/api".
//2. Функции здесь сами ничего из базы не достают, не записывают и т.д., они вызывают функции соответствующие методы сервисов (например, UserService)
@RestController
class ShopController(
    private val booksService: BooksService,
    private val userService: UserService,
    private val jwtUtil: JwtUtil
) {

    private fun extractToken(header: String): String {
        return header.substringAfter("Bearer ").trim()
    }

    @GetMapping("/api")
    fun getApiVersion() = "1.0"

    @GetMapping("/products")
    fun getAllProducts(): List<Book> {
        val result = booksService.getAllListOfBooks()
        return result
    }

    @GetMapping("/api/my-profile")
    fun getUserByToken(@RequestHeader("Authorization") authorizationHeader: String): ResponseEntity<*> {
        val token = extractToken(authorizationHeader)
        val usernameFromToken = jwtUtil.getUsernameFromToken(token)
        val userFromDB = userService.getUserByUsername(usernameFromToken)
        if (userFromDB == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Пользователь не найден")
        }
        val userDto = userService.mapUserToDto(userFromDB)
        return ResponseEntity.ok(userDto)
    }

    @GetMapping("/api/users")
    fun getAllUsers(){
        val result = userService.findAllUsers()
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

        if (!jwtUtil.validatePassword(request.password, user.passwordHash)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Неверный пароль")
        }

        val token = jwtUtil.generateToken(user.username)
        return ResponseEntity.ok(token)
    }

    /*
    * 1. пользователь
    * 2. товары
    * 3. корзина
     */
}

data class LoginRequest(val username: String, val password: String)
data class SignupRequest(val username: String, val password: String, val firstName: String, val lastName: String, val birthDate: String)