package ru.book_on_hook.backend_service.dto

import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.NotBlank

@Schema(
    description = "Входящие данные, необходимые для авторизации в системе."
)
data class LoginRequest(

    @field:NotBlank(message = "Необходимо указать логин")
    @Schema(description = "Логин пользователя", required = true, example = "johndoe")
    val username: String,

    @field:NotBlank(message = "Необходимо указать пароль")
    @Schema(description = "Пароль пользователя", required = true, example = "password123")
    val password: String
)
