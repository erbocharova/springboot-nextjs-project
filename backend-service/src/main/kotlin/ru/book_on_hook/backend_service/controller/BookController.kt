package ru.book_on_hook.backend_service.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.ArraySchema
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.ExampleObject
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.access.AccessDeniedException
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.ModelAttribute
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
        description = "Список книг возвращён успешно.",
        content = [Content(
            mediaType = "application/json",
            array = (
                    ArraySchema(
                        schema = Schema(
                            implementation = BookDto::class
                        )
                    )))]
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
        description = "Книга возвращена успешно.",
        content = [Content(
            mediaType = "application/json",
            schema = Schema(
                type = "object",
                implementation = BookDto::class
            ))]
    )
    @ApiResponse(
        responseCode = "404",
        description = "Книга не найдена.",
        content = [Content(
            mediaType = "text/plain",
            examples = [ExampleObject(value = """
                    {"error": "Книга с ID b001 не найдена"}
                    """)]
        )]
    )
    @GetMapping("/{id}")
    fun getBookById(@PathVariable id: String): ResponseEntity<*> {
        val book = booksService.getBookById(id)
        if (book == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(mapOf("error" to "Книга с ID $id не найдена"))
        }
        return ResponseEntity.ok(book)
    }


    @Operation(
        description = "Создание новой записи книги.",
        summary = "Администратор добавляет новую книгу."
    )
    @ApiResponse(
        responseCode = "201",
        description = "Новая книга создана успешно.",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {"message": "Книга с ID b001 успешно добавлена"}
                    """)]
        )]
    )
    @ApiResponse(
        responseCode = "400",
        description = "Ошибка валидации.",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {"error": "Невалидные данные книги"}
                    """)]
        )]
    )
    @ApiResponse(
        responseCode = "403",
        description = "Доступ запрещен",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {"error": "Недостаточно прав"}
                    """)]
        )]
    )
    @ApiResponse(
        responseCode = "409",
        description = "Книгу невозможно создать, так как такая книга уже существует.",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {"error": "Книга с ID b001 уже существует."}
                    """)]
        )]
    )
    @ApiResponse(
        responseCode = "500",
        description = "Внутренняя ошибка",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {"error": "Внутренняя ошибка сервера"}
                    """)]
        )]
    )
    @PostMapping("/admin/add")
    fun createBook(@Valid @RequestBody request: CreateBookRequest): ResponseEntity<*> {
        if (booksService.existsById(request.id)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(mapOf("error" to "Книга с ID ${request.id} уже существует"))
        }
        try {
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
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(mapOf("message" to "Книга с ID ${request.id} успешно добавлена"))
        } catch (ex: IllegalStateException) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(mapOf("error" to (ex.message ?: "Невалидные данные книги")))
        } catch (ex: AccessDeniedException) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(mapOf("error" to (ex.message ?: "Недостаточно прав")))
        } catch (ex: Exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(mapOf("error" to "Внутренняя ошибка сервера"))
        }
    }


    @Operation(
        description = "Обновление данных книги по ID.",
        summary = "Администратор обновляет данные о книге."
    )
    @ApiResponse(
        responseCode = "200",
        description = "Информация о книге успешно обновлена.",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {"message": "Книга с ID b001 успешно обновлена"}
                    """)]
        )]
    )
    @ApiResponse(
        responseCode = "400",
        description = "Невалидные данные запроса",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {"error": "Невалидные данные для обновления"}
                    """)]
        )]
    )
    @ApiResponse(
        responseCode = "403",
        description = "Доступ запрещен",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {"error": "Недостаточно прав"}
                    """)]
        )]
    )
    @ApiResponse(
        responseCode = "404",
        description = "Книга с указанным ID не найдена.",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {"error": "Книга не найдена"}
                    """)]
        )]
    )
    @ApiResponse(
        responseCode = "500",
        description = "Ошибка при обновлении книги.",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {"error": "Произошла ошибка при обновлении книги"}
                    """)]
        )]
    )
    @PatchMapping("/admin/update/{id}")
    fun updateBook(@PathVariable id: String, @RequestBody request: UpdateBookRequest): ResponseEntity<*> {
        try {
            booksService.updateBookById(id, request)
            return ResponseEntity.ok(mapOf("message" to "Книга с ID $id успешно обновлена"))
        } catch (ex: AccessDeniedException) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(mapOf("error" to (ex.message ?: "Недостаточно прав")))
        } catch (e: NoSuchElementException) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(mapOf("error" to (e.message ?: "Книга не найдена")))
        } catch (e: IllegalArgumentException) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(mapOf("error" to (e.message ?: "Невалидные данные для обновления")))
        } catch (e: Exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("error" to (e.message ?: "Произошла ошибка при обновлении книги"))
        }
        }


    @Operation(
        summary = "Администратор удаляет книгу.",
        description = "Удаляет книгу из базы данных по указанному ID."
    )
    @ApiResponse(
        responseCode = "200",
        description = "Информация о книге успешно удалена.",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {"message": "Книга с ID b001 успешно удалена"}
                    """)]
        )]
    )
    @ApiResponse(
        responseCode = "400",
        description = "Невалидные данные запроса",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {"error": "Невалидные данные для удаления"}
                    """)]
        )]
    )
    @ApiResponse(
        responseCode = "403",
        description = "Доступ запрещен",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {"error": "Недостаточно прав"}
                    """)]
        )]
    )
    @ApiResponse(
        responseCode = "404",
        description = "Книга с указанным ID не найдена.",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {"error": "Книга не найдена"}
                    """)]
        )]
    )
    @ApiResponse(
        responseCode = "500",
        description = "Ошибка при удалении книги.",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {"error": "Произошла ошибка при удалении книги"}
                    """)]
        )]
    )
    @DeleteMapping("/admin/delete/{id}")
    fun deleteBook(@PathVariable id: String): ResponseEntity<*> {
        try {
            booksService.deleteBookById(id)
            return ResponseEntity.ok(mapOf("message" to "Книга с ID $id успешно удалена"))
        } catch (ex: AccessDeniedException) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(mapOf("error" to (ex.message ?: "Недостаточно прав")))
        } catch (e: NoSuchElementException) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(mapOf("error" to (e.message ?: "Книга не найдена")))
        } catch (e: IllegalArgumentException) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(mapOf("error" to (e.message ?: "Невалидные данные для удаления")))
        } catch (e: Exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("error" to (e.message ?: "Произошла ошибка при удалении книги"))
        }
    }


    @Operation(
        summary = "Поиск книг по критериям",
        description = "Выполняет поиск книг по различным критериям: названию, авторам, категориям, ценам и другим параметрам."
    )
    @ApiResponse(
        responseCode = "200",
        description = "Список книг, удовлетворяющих критериями поиска. Если ничего не найдено - возвращается пустой список.",
        content = [Content(
            mediaType = "application/json",
            array = ArraySchema(schema = Schema(implementation = BookDto::class)),
            examples = [ExampleObject(value = "[]")]
            )]
    )
    @ApiResponse(
        responseCode = "400",
        description = "Некорректный запрос.",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {"error": "Невалидные данные для поиска"}
                    """)]
        )]
    )
    @ApiResponse(
        responseCode = "500",
        description = "Внутренняя ошибка сервера",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {"error": "Ошибка при поиске книг"}
                    """)]
        )]
    )
    @GetMapping("/search")
    fun searchBooks(@ModelAttribute searchRequest: SearchBookRequest): ResponseEntity<*>  {
        return try {
            val books = booksService.searchBooks(searchRequest)
            ResponseEntity.ok(books)
        } catch (e: IllegalArgumentException) {
            ResponseEntity.badRequest().body(mapOf("error" to "Невалидные данные для поиска"))
        } catch (e: Exception) {
            ResponseEntity.internalServerError().body(mapOf("error" to "Ошибка при поиске книг"))
        }
    }
}