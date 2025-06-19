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
import org.springframework.security.access.AccessDeniedException
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException
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
        description = "Неавторизованный доступ. Требуется аутентификация.",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {
                        "error": "Требуется аутентификация"
                    }
                """)]
        )]
    )
    @ApiResponse(
        responseCode = "500",
        description = "Внутренняя ошибка",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {"error": "Внутренняя ошибка сервера"}
                    """)]
        )]
    )
    @GetMapping("/api/my-profile")
    fun getUser(@Parameter(hidden = true) @AuthenticationPrincipal currentUser: CustomUserDetails): ResponseEntity<*> {
        try {
            val userDto = userService.mapUserToDto(currentUser)
            return ResponseEntity.ok(userDto)
        } catch (ex: AuthenticationCredentialsNotFoundException) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(mapOf("error" to "Требуется аутентификация"))
        } catch (ex: Exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(mapOf("error" to "Внутренняя ошибка сервера"))
        }
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
        content =  [Content(
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
        responseCode = "401",
        description = "Ошибка аутентификации",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {
                        "error": "Неверный пароль"
                    }
                """)]
        )]

    )
    @PostMapping("/api/auth/signin")
    fun authenticateUser(@Valid @RequestBody request: LoginRequest): ResponseEntity<*> {
        val user = userService.getUserByUsername(request.username)
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(mapOf("error" to "Пользователь не найден"))
        }

        if (!userService.validatePassword(request.password, user.passwordHash)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(mapOf("error" to "Неверный пароль"))
        }

        val token = jwtUtil.generateToken(user.username)
        return ResponseEntity.ok(mapOf("token" to token))
    }


    @Operation(
        description = "Выход пользователя из системы.",
        summary = "Удаляет сессионный токен пользователя."
    )
    @ApiResponse(
        responseCode = "204",
        description = "Пользователь вышел из системы успешно."
    )
    @PostMapping("/api/my-profile/logout")
    fun logout(response: HttpServletResponse): ResponseEntity<Unit> {
        val cookie = Cookie("token", "")
        cookie.maxAge = 0
        cookie.path = "/"
        response.addCookie(cookie)

        return ResponseEntity.noContent().build()
    }


    @Operation(
        description = "Добавление нового администратора",
        summary = "Добавляет в базу нового пользователя с ролью ADMIN"
    )
    @ApiResponse(
        responseCode = "201",
        description = "Новый администратор добавлен успешно",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {
                        "message": "Администратор admin успешно добавлен"
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
        responseCode = "403",
        description = "Доступ запрещен",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {"error": "Недостаточно прав"}
                    """)]
        )]
    )
    @ApiResponse(
        responseCode = "409",
        description = "Пользователь с таким логином уже существует",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    { "message": "Пользователь с таким логином уже существует" }
                """)]
        )]
    )
    @ApiResponse(
        responseCode = "500",
        description = "Внутренняя ошибка",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {"error": "Внутренняя ошибка сервера"}
                    """)]
        )]
    )
    @PostMapping("api/users/admin/add")
    fun createAdmin(@Valid @RequestBody request: SignupRequest): ResponseEntity<*> {
        if (userService.existsByUsername(request.username)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(mapOf("message" to "Пользователь с таким логином уже существует"))
        }
        try {
            val createdUser = userService.createAdmin(
                request.username,
                request.password,
                request.firstName,
                request.lastName,
                request.birthDate,
                request.telNumber,
                request.mail
            )
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(mapOf("message" to "Администратор ${request.username} успешно добавлен"))
        }  catch (ex: AccessDeniedException) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(mapOf("error" to (ex.message ?: "Недостаточно прав")))
        } catch (ex: Exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(mapOf("error" to "Внутренняя ошибка сервера"))
        }
    }
}