package ru.book_on_hook.backend_service.dao

data class Book(
    var id: Int,
    var name: String,
    var description: String,
    var price: Double,
    var quantity: Int
)

