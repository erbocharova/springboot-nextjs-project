package ru.book_on_hook.backend_service.dao

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.Document

//Схема пользователя для БД, в аннотации указано название коллекции, к которой она относится
//Щас по дефолту стоит роль ADMIN, заготовка на будущее
@Document(collection = "users")
data class User(
    val username: String,
    val passwordHash: String,
    var firstName: String,
    var lastName: String,
    var birthDate: String,
    val role: Role = Role.ADMIN
) {
    enum class Role { USER, ADMIN }
}
