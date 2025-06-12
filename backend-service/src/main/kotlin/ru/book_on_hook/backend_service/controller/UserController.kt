package ru.book_on_hook.backend_service.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import jakarta.servlet.http.Cookie
import jakarta.servlet.http.HttpServletResponse
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import ru.book_on_hook.backend_service.dto.LoginRequest
import ru.book_on_hook.backend_service.dto.SignupRequest
import ru.book_on_hook.backend_service.dto.UserDto
import ru.book_on_hook.backend_service.security.CustomUserDetails
import ru.book_on_hook.backend_service.security.JwtUtil
import ru.book_on_hook.backend_service.services.UserService

@RestController
class UserController(

    private val userService: UserService,
    private val jwtUtil: JwtUtil
) {


    @Operation(
        description = "Получение профиля пользователя.",
        summary = "Возвращает данные текущего пользователя."
    )
    @ApiResponse(
        responseCode = "200",
        description = "Профиль пользователя возвращён успешно."
    )
    @GetMapping("/api/my-profile")
    fun getUser(@AuthenticationPrincipal currentUser: CustomUserDetails): ResponseEntity<UserDto> {
        val userDto = userService.mapUserToDto(currentUser)
        return ResponseEntity.ok(userDto)
    }


    @Operation(
        description = "Регистрация нового пользователя.",
        summary = "Создает новый аккаунт пользователя."
    )
    @ApiResponse(
        responseCode = "201",
        description = "Новый пользователь зарегистрирован успешно."
    )
    @ApiResponse(
        responseCode = "409",
        description = "Пользователь с таким именем уже существует."
    )
    @PostMapping("api/auth/signup")
    fun signupUser(@Valid @RequestBody request: SignupRequest): ResponseEntity<*> {
        if (userService.existsByUsername(request.username)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Такой пользователь уже существует")
        }
        val createdUser = userService.createUser(
            request.username,
            request.password,
            request.firstName,
            request.lastName,
            request.birthDate,
            request.telNumber,
            request.mail
        )
        val token = jwtUtil.generateToken(createdUser.username)
        return ResponseEntity.status(HttpStatus.CREATED).body(mapOf("token" to token))
    }


    @Operation(
        description = "Авторизация пользователя.",
        summary = "Осуществляет вход пользователя в систему."
    )
    @ApiResponse(
        responseCode = "200",
        description = "Пользователь аутентифицирован успешно."
    )
    @ApiResponse(
        responseCode = "401",
        description = "Ошибка авторизации."
    )
    @PostMapping("/api/auth/signin")
    fun authenticateUser(@Valid @RequestBody request: LoginRequest): ResponseEntity<String> {
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


    @Operation(
        description = "Выход пользователя из системы.",
        summary = "Удаляет сессионный токен пользователя."
    )
    @ApiResponse(
        responseCode = "204",
        description = "Пользователь вышел из системы успешно."
    )
    @PostMapping("/api/auth/logout")
    fun logout(response: HttpServletResponse): ResponseEntity<Unit> {
        // Устанавливаем максимальный возраст куки равным 0, чтобы немедленно удалить её
        val cookie = Cookie("token", "")
        cookie.maxAge = 0
        cookie.path = "/" // важный параметр, чтобы cookie работала на всех путях
        response.addCookie(cookie)

        return ResponseEntity.noContent().build()
    }
}