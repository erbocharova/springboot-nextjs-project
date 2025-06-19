package ru.book_on_hook.backend_service.services

import org.springframework.security.access.AccessDeniedException
import org.springframework.stereotype.Service
import ru.book_on_hook.backend_service.dao.BookOrder
import ru.book_on_hook.backend_service.dto.BookInOrderDto
import ru.book_on_hook.backend_service.dto.CreateOrderRequest
import ru.book_on_hook.backend_service.dto.OrderDto
import ru.book_on_hook.backend_service.repository.BookRepository
import ru.book_on_hook.backend_service.repository.OrderRepository
import java.time.LocalDate
import java.time.LocalDateTime
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
            val book = bookRepository.findById(item.bookId).orElseThrow { NoSuchElementException ("Книга с ID ${item.bookId} не найдена") }

            if (book.quantity < item.quantity) {
                throw IllegalStateException("Недостаточно экземпляров книги (${book.id}). Доступно: ${book.quantity}, Запрашивается: ${item.quantity}")
            }
        }

        for (item in request.books) {
            val book = bookRepository.findById(item.bookId).orElseThrow { NoSuchElementException("Книга с ID ${item.bookId} не найдена") }

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
            if (book.quantity == 0) {
                book.available = false
            }
            bookRepository.save(book)
        }

        val expirationDate = request.deliveryDate.atTime(23, 59, 59).plusWeeks(2)

        val newOrder = BookOrder(
            id = UUID.randomUUID().toString(),
            username = request.username,
            firstName = request.firstName,
            lastName = request.lastName,
            mail = request.email,
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

    fun updateStatusById(id: String, status: BookOrder.OrderStatus): BookOrder {
        val order = orderRepository.findById(id).orElseThrow { NoSuchElementException ("Заказ с ID $id не найден") }

        if (status == BookOrder.OrderStatus.ON_RENT) {
            order.deliveryDate = LocalDate.now()
            order.expirationDate = order.deliveryDate.atTime(23, 59, 59).plusWeeks(2)
        }

        if (status == BookOrder.OrderStatus.COMPLETED || status == BookOrder.OrderStatus.CANCELLED) {
            for (item in order.books) {
                val book = bookRepository.findById(item.bookId).orElseThrow { NoSuchElementException("Книга с ID ${item.bookId} не найдена") }

                book.quantity += item.quantity
                book.available = true

                bookRepository.save(book)
            }
        }
        order.status = status
        orderRepository.save(order)
        return order
    }

    fun cancelOrderById(id: String, username: String): BookOrder {
        val order = orderRepository.findById(id).orElseThrow { NoSuchElementException ("Заказ с ID $id не найден") }

        if (order.username != username) {
            throw AccessDeniedException("Вы можете отменять только свои заказы")
        }

        if (order.status != BookOrder.OrderStatus.NEW) {
            throw IllegalStateException("Заказ можно отменить только в статусе NEW")
        }

        for (item in order.books) {
            val book = bookRepository.findById(item.bookId).orElseThrow { NoSuchElementException("Книга с ID ${item.bookId} не найдена") }

            book.quantity += item.quantity
            book.available = true

            bookRepository.save(book)
        }
        order.status = BookOrder.OrderStatus.CANCELLED
        orderRepository.save(order)

        return order
    }

    fun getOrdersByUsername(username: String): List<OrderDto> {
        val orders = orderRepository.findByUsername(username)
        return orders.map(::mapOrderToDto)
    }

    fun getAllOrders(): List<OrderDto> {
        val orders = orderRepository.findAll()
        return orders.map(::mapOrderToDto)
    }

    fun mapOrderToDto(order: BookOrder): OrderDto {
        return OrderDto(
            id = order.id,
            username = order.username,
            firstName = order.firstName,
            lastName = order.lastName,
            mail = order.mail,
            telNumber = order.telNumber,
            address = order.address,
            books = order.books,
            price = order.price,
            paymentType = order.paymentType,
            status = order.status,
            createdAt = order.createdAt,
            deliveryDate = order.deliveryDate,
            expirationDate = order.expirationDate
        )
    }
}