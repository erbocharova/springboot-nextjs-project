package ru.book_on_hook.backend_service.repository

import ru.book_on_hook.backend_service.dao.Book
import org.springframework.data.mongodb.repository.MongoRepository
import java.util.Optional

//Интерфейс, предоставляющий методы взаимодействия с базой, он инициализируется в сервисе UserService.
//Методы реализовывать не надо.
//Нестандартные методы, которых нет в MongoRepository, можно просто объявить здесь без реализации, они будут работать
interface BookRepository: MongoRepository<Book, String> {

    fun findByName(username: String): Optional<Book>
}