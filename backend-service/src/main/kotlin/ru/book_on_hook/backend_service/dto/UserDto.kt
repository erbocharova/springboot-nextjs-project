package ru.book_on_hook.backend_service.dto

//Класс объектов для фронта
data class UserDto(
    val username: String,
    val firstName: String,
    val lastName: String,
    val birthDate: String
)
