package ru.book_on_hook.backend_service.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.responses.ApiResponse
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ru.book_on_hook.backend_service.dto.BookDto
import ru.book_on_hook.backend_service.dto.CreateBookRequest
import ru.book_on_hook.backend_service.dto.SearchBookRequest
import ru.book_on_hook.backend_service.dto.UpdateBookRequest
import ru.book_on_hook.backend_service.services.BooksService

@RestController
@RequestMapping("/api/books")
class BookController(

    private val booksService: BooksService
) {

    @Operation(
        description = "Получение списка всех книг.",
        summary = "Возвращает полный список всех книг."
    )
    @ApiResponse(
        responseCode = "200",
        description = "Список книг возвращён успешно."
    )
    @GetMapping("/all")
    fun getAllBooks(): MutableList<BookDto> {
        val result = booksService.getAllBooks()
        return result
    }


    @Operation(
        description = "Получение конкретной книги по её ID.",
        summary = "Возвращает книгу по её идентификатору."
    )
    @ApiResponse(
        responseCode = "200",
        description = "Книга возвращена успешно."
    )
    @ApiResponse(
        responseCode = "404",
        description = "Книга не найдена."
    )
    @GetMapping("/{id}")
    fun getBookById(@PathVariable id: String): ResponseEntity<*> {
        val book = booksService.getBookById(id)
        if (book == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Книга не найдена.")
        }
        return ResponseEntity.ok(book)
    }


    @Operation(
        description = "Создание новой записи книги.",
        summary = "Администратор добавляет новую книгу."
    )
    @ApiResponse(
        responseCode = "201",
        description = "Новая книга создана успешно."
    )
    @ApiResponse(
        responseCode = "409",
        description = "Книгу невозможно создать, так как такая книга уже существует."
    )
    @PostMapping("/admin/add")
    fun createBook(@Valid @RequestBody request: CreateBookRequest): ResponseEntity<*> {
        if (booksService.existsById(request.id)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Книга с id ${request.id} уже существует.")
        }
        booksService.createBook(
            request.id,
            request.name,
            request.author,
            request.description,
            request.imageUrl,
            request.price,
            request.quantity,
            request.available,
            request.popular,
            request.category
        )
        return ResponseEntity.status(HttpStatus.CREATED).body("Книга успешно добавлена.")
    }


    @Operation(
        description = "Обновление данных книги по ID.",
        summary = "Администратор обновляет данные о книге."
    )
    @ApiResponse(
        responseCode = "200",
        description = "Информация о книге успешно обновлена."
    )
    @ApiResponse(
        responseCode = "404",
        description = "Книга с указанным ID не найдена.",
        content = [Content()]
    )
    @PatchMapping("/admin/update/{id}")
    fun updateBook(@PathVariable id: String, @RequestBody request: UpdateBookRequest): ResponseEntity<BookDto> {
        try {
            val updatedBook = booksService.updateBookById(id, request)
            return ResponseEntity.ok(updatedBook)
        } catch (ex: Exception) {
            return ResponseEntity.badRequest().body(null)
        }
    }


    @Operation(
        summary = "Администратор удаляет книгу.",
        description = "Удаляет книгу из базы данных по указанному ID."
    )
    @ApiResponse(
        responseCode = "204",
        description = "Книга успешно удалена",
        content = []
    )
    @ApiResponse(
        responseCode = "404",
        description = "Книга с указанным идентификатором не найдена",
        content = []
    )
    @DeleteMapping("/admin/delete/{id}")
    fun deleteBook(@PathVariable id: String): ResponseEntity<Void> {
        booksService.deleteBookById(id)
        return ResponseEntity.noContent().build()
    }

    @Operation(
        summary = "Поиск книг по критериям",
        description = "Выполняет поиск книг по различным критериям: названию, авторам, категориям, ценам и другим параметрам."
    )
    @ApiResponse(
        responseCode = "200",
        description = "Список книг, удовлетворяющих критериями поиска.",
    )
    @ApiResponse(
        responseCode = "400",
        description = "Некорректный запрос.",
        content = []
    )
    @GetMapping("/search")
    fun searchBooks(@RequestBody searchRequest: SearchBookRequest): List<BookDto> {
        return booksService.searchBooks(searchRequest)
    }
}