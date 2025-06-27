package ru.book_on_hook.backend_service.repository

import ru.book_on_hook.backend_service.dao.Book
import org.springframework.data.mongodb.repository.MongoRepository
import java.util.Optional

interface BookRepository: MongoRepository<Book, String> {

    fun findByName(username: String): Optional<Book>
}