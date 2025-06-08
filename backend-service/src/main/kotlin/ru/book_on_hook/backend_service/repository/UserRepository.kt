package ru.book_on_hook.backend_service.repository

import org.springframework.data.mongodb.repository.MongoRepository
import ru.book_on_hook.backend_service.dao.User
import java.util.Optional

//Интерфейс, предоставляющий методы взаимодействия с базой, он инициализируется в сервисе UserService.
//Методы реализовывать не надо.
//Нестандартные методы, которых нет в MongoRepository, можно просто объявить здесь без реализации, они будут работать
interface UserRepository: MongoRepository<User, String> {
    fun existsByUsername(username: String): Boolean

    fun findByUsername(username: String): Optional<User>
}