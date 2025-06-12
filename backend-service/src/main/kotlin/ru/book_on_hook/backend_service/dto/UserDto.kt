package ru.book_on_hook.backend_service.dto

import io.swagger.v3.oas.annotations.media.Schema
import ru.book_on_hook.backend_service.dao.User.Role

@Schema(description = "Представление пользователя, передаваемое фронтенду. Содержит информацию о пользователе, предназначенную для визуализации на стороне клиента.")
data class UserDto(

    /**
     * Логин пользователя.
     */
    @field:Schema(description = "Логин пользователя", readOnly = true, example = "johndoe")
    val username: String,

    /**
     * Имя пользователя.
     */
    @field:Schema(description = "Имя пользователя", readOnly = true, example = "Джон")
    val firstName: String,

    /**
     * Фамилия пользователя.
     */
    @field:Schema(description = "Фамилия пользователя", readOnly = true, example = "Доу")
    val lastName: String,

    /**
     * Дата рождения пользователя.
     */
    @field:Schema(description = "Дата рождения пользователя", readOnly = true, example = "1990-01-01")
    val birthDate: String,

    /**
     * Номер телефона пользователя.
     */
    @field:Schema(description = "Телефон пользователя", readOnly = true, example = "79611616161")
    val telNumber: String,

    /**
     * Электронная почта пользователя.
     */
    @field:Schema(description = "Адрес электронной почты пользователя", readOnly = true, example = "john.doe@example.com")
    val mail: String,

    /**
     * Роль пользователя в системе.
     */
    @field:Schema(description = "Роль пользователя в системе", readOnly = true, implementation = Role::class)
    val role: Role
)