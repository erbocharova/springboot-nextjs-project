package ru.book_on_hook.backend_service.services

import org.springframework.stereotype.Service
import ru.book_on_hook.backend_service.dao.BookOrder
import ru.book_on_hook.backend_service.dto.BookInOrderDto
import ru.book_on_hook.backend_service.dto.CreateOrderRequest
import ru.book_on_hook.backend_service.repository.BookRepository
import ru.book_on_hook.backend_service.repository.OrderRepository
import java.time.LocalDateTime
import java.time.ZoneId
import java.util.UUID

@Service
class OrderService(

    private val bookRepository: BookRepository,
    private val orderRepository: OrderRepository
) {

    fun processOrder(request: CreateOrderRequest): String {
        val orderBooks = mutableListOf<BookInOrderDto>()
        var totalPrice = 0.0

        for (item in request.books) {
            val book = bookRepository.findById(item.bookId).orElseThrow { RuntimeException("Книга не найдена.") }

            if (book.quantity < item.quantity) {
                throw IllegalStateException("Недостаточно экземпляров книги (${book.id}). Доступно: ${book.quantity}, Запрашивается: ${item.quantity}")
            }
        }

        for (item in request.books) {
            val book = bookRepository.findById(item.bookId).orElseThrow { RuntimeException("Книга не найдена.") }

            val fixedBookInfo = BookInOrderDto(
                bookId = book.id,
                title = book.name,
                author = book.author,
                pricePerUnit = book.price,
                quantity = item.quantity
            )
            orderBooks.add(fixedBookInfo)

            totalPrice += book.price * item.quantity

            book.quantity -= item.quantity
            bookRepository.save(book)
        }

        val expirationDate = request.deliveryDate.atTime(23, 59, 59).plusWeeks(2)

        val newOrder = BookOrder(
            id = UUID.randomUUID().toString(),
            username = request.username,
            firstName = request.firstName,
            lastName = request.lastName,
            email = request.email,
            telNumber = request.telNumber,
            address = request.address,
            books = orderBooks,
            price = totalPrice,
            paymentType = request.paymentType,
            status = BookOrder.OrderStatus.NEW,
            createdAt = LocalDateTime.now(),
            deliveryDate = request.deliveryDate,
            expirationDate = expirationDate
        )
        orderRepository.save(newOrder)

        return newOrder.id
    }
}