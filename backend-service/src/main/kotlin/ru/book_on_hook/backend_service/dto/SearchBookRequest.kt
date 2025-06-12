package ru.book_on_hook.backend_service.dto

import io.swagger.v3.oas.annotations.media.Schema
import org.springframework.data.domain.Sort
import ru.book_on_hook.backend_service.dao.Book

@Schema(
    description = "Входящие данные для поиска и сортировки книг."
)
data class SearchBookRequest(

    @field:Schema(description = "Название книги (может быть пустым)", example = "Капитанская дочка")
    val name: String? = null,

    @field:Schema(description = "Автор произведения (может быть пустым или содержать несколько)", example = "\"[\"Толстой\", \"Достоевский\"]\"")
    val authors: Set<String>? = null,

    @field:Schema(description = "Категория книги (может быть пустым или содержать несколько)", example = "\"\"[\"KIDS\", \"HISTORICAL\"]\"\"")
    val categories: Set<Book.Category>? = null,

    @field:Schema(description = "Минимальная цена (может быть пустой)", example = "259.9")
    val minPrice: Double? = null,

    @field:Schema(description = "Максимальная цена (может быть пустой)", example = "1000.0")
    val maxPrice: Double? = null,

    @field:Schema(description = "Порядок сортировки", implementation = Sort.Order::class)
    val sortOrder: Sort.Order? = null
)
