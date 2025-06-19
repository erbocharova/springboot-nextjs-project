package ru.book_on_hook.backend_service.repository

import org.springframework.data.mongodb.repository.MongoRepository
import ru.book_on_hook.backend_service.dao.BookOrder

interface OrderRepository: MongoRepository<BookOrder, String> {

    fun findByUsername(username: String): List<BookOrder>
}