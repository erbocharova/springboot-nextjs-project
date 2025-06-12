package ru.book_on_hook.backend_service.dto

import com.fasterxml.jackson.annotation.JsonProperty
import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.PositiveOrZero
import ru.book_on_hook.backend_service.dao.Book

@Schema(description = "Входящий запрос на добавление новой книги.")
data class CreateBookRequest(
    @field:NotBlank(message = "Необходимо указать название")
    @Schema(description = "Идентификатор книги", required = true, example = "b001")
    val id: String,

    @field:NotBlank(message = "Необходимо указать автора.")
    @Schema(description = "Название книги", required = true, example = "Война и мир")
    val name: String,

    @field:NotBlank(message = "Необходимо указать автора.")
    @Schema(description = "Автор произведения", required = true, example = "Л. Н. Толстой")
    val author: String,

    @field:NotBlank(message = "Описание книги не может быть пустым.")
    @Schema(description = "Описание книги", required = true, example = "Роман-эпопея Льва Толстого.")
    val description: String,

    @field:NotBlank(message = "Обложка книги должна присутствовать.")
    @Schema(description = "URL изображения обложки книги", required = true, example = "https://example.com/cover.jpg")
    val imageUrl: String,

    @field:PositiveOrZero(message = "Цена не должна быть отрицательной.")
    @Schema(description = "Цена книги", required = true, type = "number", format = "double", minimum = "0.0", maximum = "10000.0", example = "799.99")
    val price: Double,

    @field:PositiveOrZero(message = "Количество книг не может быть меньше нуля.")
    @Schema(description = "Количество экземпляров в наличии", required = true, minimum = "0", example = "10")
    val quantity: Int,

    @field:Schema(description = "Доступность книги для заказа", required = true, example = "true")
    var available: Boolean,

    @field:Schema(description = "Популярность книги среди читателей", required = true, example = "false")
    var popular: Boolean,

    @JsonProperty("category")
    @Schema(description = "Категория книги в системе", required = true, example = "FANTASY")
    var category: Book.Category
)
