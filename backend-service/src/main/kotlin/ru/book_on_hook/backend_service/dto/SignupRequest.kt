package ru.book_on_hook.backend_service.dto

import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.NotBlank

@Schema(
    description = "Входящие данные, необходимые для регистрации нового пользователя."
)
data class SignupRequest(

    @field:NotBlank(message = "Необходимо указать логин")
    @Schema(description = "Имя пользователя (логин)", required = true, example = "johndoe")
    val username: String,

    @field:NotBlank(message = "Необходимо указать пароль")
    @Schema(description = "Пароль пользователя", required = true, example = "password123")
    val password: String,

    @field:NotBlank(message = "Необходимо указать имя")
    @Schema(description = "Имя пользователя", required = true, example = "John")
    val firstName: String,

    @field:NotBlank(message = "Необходимо указать фамилию")
    @Schema(description = "Фамилия пользователя", required = true, example = "Doe")
    val lastName: String,

    @field:NotBlank(message = "Необходимо указать дату рождения")
    @Schema(description = "Дата рождения пользователя", required = true, example = "1990-01-01")
    val birthDate: String,

    @field:NotBlank(message = "Необходимо указать номер телефона")
    @Schema(description = "Номер телефона пользователя", required = true, example = "79611616161")
    val telNumber: String,

    @field:NotBlank(message = "Необходимо указать эл. почту")
    @Schema(description = "Электронная почта пользователя", required = true, example = "johndoe@gmail.com")
    val mail: String,
)
