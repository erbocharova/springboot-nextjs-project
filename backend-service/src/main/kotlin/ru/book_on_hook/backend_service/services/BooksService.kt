package ru.book_on_hook.backend_service.services

import org.springframework.stereotype.Service
import ru.book_on_hook.backend_service.dao.Book
import ru.book_on_hook.backend_service.repository.BookRepository

@Service
class BooksService(

    private val bookRepository: BookRepository
) {

    fun createBook(id: String, name: String, description: String, price: Double, quantity: Int): Book {
        return bookRepository.save(Book(
            id = id,
            name = name,
            description = description,
            price = price,
            quantity = quantity))
    }

    fun existsById(id: String): Boolean {
        return bookRepository.existsById(id)
    }

    fun getAllListOfBooks(): MutableList<Book> {
        return mutableListOf(
            Book(
                id = "1",
                name = "Название",
                description = "Описание",
                price = 20.0,
                quantity = 20
            ))
    }

    fun getBookById(id: String): Book? {
        val result = bookRepository.findById(id).orElse(null)
        return result
    }
}