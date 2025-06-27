package ru.book_on_hook.backend_service.dto

import io.swagger.v3.oas.annotations.media.Schema
import org.springframework.data.domain.Sort
import org.springframework.web.bind.annotation.RequestParam
import ru.book_on_hook.backend_service.dao.Book

@Schema(
    description = "Входящие данные для поиска и сортировки книг."
)
data class SearchBookRequest(

    @field:Schema(description = "Название книги", example = "Капитанская дочка")
    @RequestParam(required = false)
    val name: String? = null,

    @field:Schema(description = "Авторы (через запятую)", example = "Толстой,Достоевский")
    @RequestParam(required = false)
    val authors: Set<String>? = null,

    @field:Schema(description = "Категории (через запятую)", example = "KIDS,HISTORICAL")
    @RequestParam(required = false)
    val categories: Set<Book.Category>? = null,

    @field:Schema(description = "Минимальная цена (может быть пустой)", example = "259.9")
    @RequestParam(required = false)
    val minPrice: Double? = null,

    @field:Schema(description = "Максимальная цена (может быть пустой)", example = "1000.0")
    @RequestParam(required = false)
    val maxPrice: Double? = null,

    @field:Schema(description = "Сортировка (формат: поле,направление)", example = "price,ASC")
    @RequestParam(required = false)
    val sortOrder: String? = null
)
