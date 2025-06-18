package ru.book_on_hook.backend_service.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.ExampleObject
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import jakarta.servlet.http.Cookie
import jakarta.servlet.http.HttpServletResponse
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.web.webauthn.api.AuthenticatorResponse
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
        description = "Профиль пользователя возвращён успешно.",
        content = [Content(
            mediaType = "application/json",
            schema = Schema(implementation = UserDto::class),
            examples = [ExampleObject(
                value = """
                    {
                        "username": "john_doe",
                        "firstName": "John",
                        "lastName": "Doe",
                        "birthDate": "1990-01-01",
                        "telNumber": "+1234567890",
                        "mail": "john.doe@example.com",
                        "role": "USER"
                    }
                """
            )]
        )]
    )
    @ApiResponse(
        responseCode = "401",
        description = "Пользователь не аутентифицирован",
        content = [Content(schema = Schema(implementation = Unit::class))]
    )
    @ApiResponse(
        responseCode = "403",
        description = "Доступ запрещен",
        content = [Content(schema = Schema(implementation = Unit::class))]
    )
    @GetMapping("/api/my-profile")
    fun getUser(@Parameter(hidden = true) @AuthenticationPrincipal currentUser: CustomUserDetails): ResponseEntity<UserDto> {
        val userDto = userService.mapUserToDto(currentUser)
        return ResponseEntity.ok(userDto)
    }


    @Operation(
        description = "Регистрация нового пользователя.",
        summary = "Создает новый аккаунт пользователя и возвращает JWT токен."
    )
    @ApiResponse(
        responseCode = "201",
        description = "Новый пользователь зарегистрирован успешно",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {
                        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    }
                """)]
        )]
    )
    @ApiResponse(
        responseCode = "400",
        description = "Некорректные данные запроса",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    { 
                        "error": "VALIDATION_ERROR",
                        "message": "Некорректные данные",
                        "details": ["Имя пользователя слишком короткое"]
                    }
                """)]
        )]
    )
    @ApiResponse(
        responseCode = "409",
        description = "Пользователь с таким именем уже существует",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    { "message": "Пользователь с таким именем уже существует" }
                """)]
        )]
    )
    @PostMapping("api/auth/signup")
    fun signupUser(@Valid @RequestBody request: SignupRequest): ResponseEntity<*> {
        if (userService.existsByUsername(request.username)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(mapOf("message" to "Пользователь с таким именем уже существует"))
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
        description = "Аутентифицирует пользователя и возвращает JWT-токен",
        summary = "Осуществляет вход пользователя в систему."
    )
    @ApiResponse(
        responseCode = "200",
        description = "Успешная аутентификация",
        content = [
            Content(
                mediaType = "text/plain",
                schema = Schema(type = "string"),
                examples = [ExampleObject(value = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")]
            )]
    )
    @ApiResponse(
        responseCode = "400",
        description = "Некорректные данные запроса",
        content = [
            Content(
                mediaType = "text/plain",
                schema = Schema(type = "string"),
                examples = [ExampleObject(value = "Неверный формат запроса")]
            )
        ]
    )
    @ApiResponse(
        responseCode = "401",
        description = "Ошибка аутентификации",
        content = [
            Content(
                mediaType = "text/plain",
                schema = Schema(type = "string"),
                examples = [ExampleObject(value = "Неверные учетные данные")]
            )
        ]
    )
    @PostMapping("/api/auth/signin")
    fun authenticateUser(@Valid @RequestBody request: LoginRequest): ResponseEntity<String> {
        val user = userService.getUserByUsername(request.username)
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).contentType(MediaType.TEXT_PLAIN).body("Пользователь не найден")
        }

        if (!userService.validatePassword(request.password, user.passwordHash)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).contentType(MediaType.TEXT_PLAIN).body("Неверный пароль")
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