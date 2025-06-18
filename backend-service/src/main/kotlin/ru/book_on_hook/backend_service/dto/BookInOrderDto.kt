package ru.book_on_hook.backend_service.dto

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Объект книги в базе заказов.")
data class BookInOrderDto(

    @field:Schema(description = "ID книги", readOnly = true, example = "b001")
    val bookId: String,

    @field:Schema(description = "Название книги", readOnly = true, example = "Война и мир")
    val title: String,

    @field:Schema(description = "Автор произведения", readOnly = true, example = "Л. Н. Толстой")
    val author: String,

    @field:Schema(description = "Количество заказанных экземпляров книги", readOnly = true, minimum = "1", example = "10")
    val quantity: Int,

    @field:Schema(description = "Цена за 1 экземпляр книги", readOnly = true, type = "number", format = "double", minimum = "0.0", example = "599.99")
    val pricePerUnit: Double
)
