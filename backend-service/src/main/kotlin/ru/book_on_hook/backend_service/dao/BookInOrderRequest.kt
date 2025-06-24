package ru.book_on_hook.backend_service.dao

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Объект книги в составе заказа, приходящий с фронтенда.")
data class BookInOrderRequest(

    @field:Schema(description = "ID книги", required = true, example = "b001")
    val bookId: String,

    @field:Schema(description = "Количество заказанных экземпляров книги", required = true, minimum = "1", example = "10")
    val quantity: Int
)

