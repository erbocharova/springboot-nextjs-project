package ru.book_on_hook.backend_service.services

import org.springframework.stereotype.Service
import ru.book_on_hook.backend_service.dao.Book

@Service
class BooksService {

    fun getAllListOfBooks(): MutableList<Book> {
        return mutableListOf(
            Book(
                id = 1,
                name = "Название",
                description = "Описание",
                price = 20.0,
                quantity = 20
            ))
    }
}