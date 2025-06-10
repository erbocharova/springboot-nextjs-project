package ru.book_on_hook.backend_service.controller

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ru.book_on_hook.backend_service.dao.Book
import ru.book_on_hook.backend_service.repository.BookRepository
import ru.book_on_hook.backend_service.security.JwtUtil
import ru.book_on_hook.backend_service.services.BooksService
import ru.book_on_hook.backend_service.services.UserService

@RestController
@RequestMapping("/api/books")
class BookController(

    @Autowired
    private val bookRepository: BookRepository,
    private val booksService: BooksService
) {

    @GetMapping("/all")
    fun getAllProducts(): List<Book> {
        val result = booksService.getAllListOfBooks()
        return result
    }

    @GetMapping("/{id}")
    fun getBookById(@PathVariable id: String): ResponseEntity<*> {
        val book = booksService.getBookById(id)
        if (book == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Книга не найдена.")
        }
        return ResponseEntity.ok(book)
    }

    @PostMapping("/admin/add")
    fun createBook(@RequestBody request: CreateBookRequest): ResponseEntity<*> {
        if (booksService.existsById(request.id)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Книга с id ${request.id} уже существует.")
        }
        booksService.createBook(request.id, request.name, request.description, request.price, request.quantity)
        return ResponseEntity.status(HttpStatus.CREATED).body("Книга успешно добавлена.")
    }
}

data class CreateBookRequest(
    var id: String,
    var name: String,
    var description: String,
    var price: Double,
    var quantity: Int)