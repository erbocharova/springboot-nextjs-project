package ru.book_on_hook.backend_service.dao

import org.springframework.data.mongodb.core.mapping.Document

@Document(collection = "users")
data class User(
    val username: String,
    val passwordHash: String,
    var firstName: String,
    var lastName: String,
    var birthDate: String,
    var telNumber: String,
    var mail: String,
    val role: Role
) {
    enum class Role { USER, ADMIN }
}
