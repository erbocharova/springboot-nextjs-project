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
            schema = Schema(type = "string"),
            examples = [ExampleObject(value = "Книга с ID b001 не найдена")]
        )]
    )
    @GetMapping("/{id}")
    fun getBookById(@PathVariable id: String): ResponseEntity<*> {
        val book = booksService.getBookById(id)
        if (book == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).contentType(MediaType.TEXT_PLAIN).body("Книга с ID $id не найдена.")
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
            mediaType = "text/plain",
            schema = Schema(type = "string"),
            examples = [ExampleObject(value = "Книга с ID b001 успешно добавлена.")]
        )]
    )
    @ApiResponse(
        responseCode = "409",
        description = "Книгу невозможно создать, так как такая книга уже существует.",
        content = [Content(
            mediaType = "text/plain",
            schema = Schema(type = "string"),
            examples = [ExampleObject(value = "Книга с ID b001 уже существует.")]
        )]
    )
    @PostMapping("/admin/add")
    fun createBook(@Valid @RequestBody request: CreateBookRequest): ResponseEntity<*> {
        if (booksService.existsById(request.id)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).contentType(MediaType.TEXT_PLAIN).body("Книга с ID ${request.id} уже существует.")
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
        return ResponseEntity.status(HttpStatus.CREATED).contentType(MediaType.TEXT_PLAIN).body("Книга с ID ${request.id} успешно добавлена.")
    }


    @Operation(
        description = "Обновление данных книги по ID.",
        summary = "Администратор обновляет данные о книге."
    )
    @ApiResponse(
        responseCode = "200",
        description = "Информация о книге успешно обновлена.",
        content = [Content(
            mediaType = "text/plain",
            schema = Schema(type = "string"),
            examples = [ExampleObject(value = "Книга с ID b001 успешно обновлена.")]
        )]
    )
    @ApiResponse(
        responseCode = "400",
        description = "Невалидные данные запроса",
        content = [Content(
            mediaType = "text/plain",
            schema = Schema(type = "string"),
            examples = [ExampleObject(value = "Невалидные данные для обновления")]
        )]
    )
    @ApiResponse(
        responseCode = "404",
        description = "Книга с указанным ID не найдена.",
        content = [Content(
            mediaType = "text/plain",
            schema = Schema(type = "string"),
            examples = [ExampleObject(value = "Книга с ID b001 не найдена.")]
        )]
    )
    @ApiResponse(
        responseCode = "500",
        description = "Ошибка при обновлении книги.",
        content = [Content(
            mediaType = "text/plain",
            schema = Schema(type = "string"),
            examples = [ExampleObject(value = "Произошла ошибка при обновлении книги.")]
        )]
    )
    @PatchMapping("/admin/update/{id}")
    fun updateBook(@PathVariable id: String, @RequestBody request: UpdateBookRequest): ResponseEntity<*> {
        try {
            booksService.updateBookById(id, request)
            return ResponseEntity.ok("Книга с ID $id успешно обновлена.")
        } catch (e: NoSuchElementException) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).contentType(MediaType.TEXT_PLAIN).body(e.message)
        } catch (e: IllegalArgumentException) {
            return ResponseEntity.badRequest().body(e.message ?: "Невалидные данные для обновления.")
        } catch (e: Exception) {
            return ResponseEntity.internalServerError().contentType(MediaType.TEXT_PLAIN).body("Произошла ошибка при обновлении книги.")
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
            mediaType = "text/plain",
            schema = Schema(type = "string"),
            examples = [ExampleObject(value = "Невалидные данные для поиска.")]
        )]
    )
    @ApiResponse(
        responseCode = "500",
        description = "Внутренняя ошибка сервера",
        content = [Content(
            mediaType = "text/plain",
            schema = Schema(type = "string"),
            examples = [ExampleObject(value = "Произошла ошибка при поиске книг.")]
        )]
    )
    @GetMapping("/search")
    fun searchBooks(@RequestBody searchRequest: SearchBookRequest): ResponseEntity<*>  {
        return try {
            val books = booksService.searchBooks(searchRequest)
            ResponseEntity.ok(books)
        } catch (e: IllegalArgumentException) {
            ResponseEntity.badRequest().contentType(MediaType.TEXT_PLAIN).body("Невалидные данные для поиска.")
        } catch (e: Exception) {
            ResponseEntity.internalServerError().contentType(MediaType.TEXT_PLAIN).body("Произошла ошибка при поиске книг.")
        }
    }
}