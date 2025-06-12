package ru.book_on_hook.backend_service.dto

import io.swagger.v3.oas.annotations.media.Schema
import ru.book_on_hook.backend_service.dao.Book.Category

@Schema(description = "Модель данных книги, передаваемая фронтенду. Содержит информацию о книге, предназначенную для визуализации на стороне клиента.")
data class BookDto(
    /**
     * Уникальный идентификатор книги.
     */
    @field:Schema(description = "Уникальный идентификатор книги", readOnly = true, example = "b001")
    val id: String,

    /**
     * Название книги.
     */
    @field:Schema(description = "Название книги", readOnly = true, example = "Мастер и Маргарита")
    val name: String,

    /**
     * Имя автора книги.
     */
    @field:Schema(description = "Имя автора книги", readOnly = true, example = "М. Булгаков")
    val author: String,

    /**
     * Краткое описание книги.
     */
    @field:Schema(description = "Краткое описание книги", readOnly = true, example = "Роман Михаила Булгакова...")
    val description: String,

    /**
     * URL изображения обложки книги.
     */
    @field:Schema(description = "URL изображения обложки книги", readOnly = true, example = "http://example.com/image.jpg")
    val imageUrl: String,

    /**
     * Цена книги.
     */
    @field:Schema(description = "Цена книги", readOnly = true, type = "number", format = "double", minimum = "0.0", example = "599.99")
    val price: Double,

    /**
     * Количество доступных экземпляров книги.
     */
    @field:Schema(description = "Количество доступных экземпляров книги", readOnly = true, minimum = "0", example = "10")
    val quantity: Int,

    /**
     * Доступность книги для приобретения.
     */
    @field:Schema(description = "Доступность книги для приобретения", readOnly = true, example = "true")
    val available: Boolean,

    /**
     * Признак популярности книги.
     */
    @field:Schema(description = "Признак популярности книги", readOnly = true, example = "false")
    val popular: Boolean,

    /**
     * Категория книги.
     */
    @field:Schema(description = "Категория книги", readOnly = true, example = "ROMANCE")
    val category: Category
)