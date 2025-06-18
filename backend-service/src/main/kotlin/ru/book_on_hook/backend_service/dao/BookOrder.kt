package ru.book_on_hook.backend_service.dao

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import ru.book_on_hook.backend_service.dto.BookInOrderDto
import java.time.LocalDate
import java.time.LocalDateTime

@Document(collection = "orders")
data class BookOrder(
    @Id val id: String,
    val username: String,
    val firstName: String,
    val lastName: String,
    val email: String,
    val telNumber: String,
    val address: String,
    val books: List<BookInOrderDto>,
    val price: Double,
    val paymentType: PaymentType,
    var status: OrderStatus,
    val createdAt: LocalDateTime,
    var deliveryDate: LocalDate,
    var expirationDate: LocalDateTime
) {
    enum class OrderStatus { NEW, PROCESSING, DELIVERY, ON_RENT, EXPIRED, COMPLETED, CANCELLED }

    enum class PaymentType { SBP, CARD, POSTPAY }
}
