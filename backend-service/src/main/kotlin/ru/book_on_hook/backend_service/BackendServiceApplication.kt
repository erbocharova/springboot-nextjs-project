package ru.book_on_hook.backend_service

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

//Главный файл приложения. Здесь ничего менять не надо
@SpringBootApplication
class BackendServiceApplication

fun main(args: Array<String>) {
	runApplication<BackendServiceApplication>(*args)
}
