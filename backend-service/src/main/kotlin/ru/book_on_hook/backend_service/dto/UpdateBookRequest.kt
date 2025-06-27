package ru.book_on_hook.backend_service.dto

import ru.book_on_hook.backend_service.dao.Book

data class UpdateBookRequest(
    val name: String? = null,
    val author: String? = null,
    val description: String? = null,
    val imageUrl: String? = null,
    val price: Double? = null,
    val quantity: Int? = null,
    val available: Boolean? = null,
    val popular: Boolean? = null,
    val category: Book.Category? = null
)
