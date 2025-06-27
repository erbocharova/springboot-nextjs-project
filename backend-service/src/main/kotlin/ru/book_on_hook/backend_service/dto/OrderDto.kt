package ru.book_on_hook.backend_service.dto

import io.swagger.v3.oas.annotations.media.Schema
import ru.book_on_hook.backend_service.dao.Book.Category
import ru.book_on_hook.backend_service.dao.BookInOrderRequest
import ru.book_on_hook.backend_service.dao.BookOrder.OrderStatus
import ru.book_on_hook.backend_service.dao.BookOrder.PaymentType
import java.time.LocalDate
import java.time.LocalDateTime

@Schema(description = "Модель данных заказа, передаваемая фронтенду. Содержит информацию о заказе, предназначенную для визуализации на стороне клиента.")
data class OrderDto(

    @field:Schema(description = "Уникальный идентификатор заказа", readOnly = true, example = "6acbd3b2-5262-435d-9b62-055dd2fd14b9")
    val id: String,

    @field:Schema(description = "Логин пользователя", readOnly = true, example = "johndoe")
    val username: String,

    @field:Schema(description = "Имя получателя", readOnly = true, example = "Джон")
    val firstName: String,

    @field:Schema(description = "Фамилия пользователя", readOnly = true, example = "Доу")
    val lastName: String,

    @field:Schema(description = "Адрес электронной почты получателя", readOnly = true, example = "john.doe@example.com")
    val mail: String,

    @field:Schema(description = "Телефон пользователя", pattern = "^\\+?[1-9]\\d{1,14}$", readOnly = true, example = "+79611616161")
    val telNumber: String,

    @field:Schema(description = "Полный адрес доставки заказа", readOnly = true, example = "г. Ростов-на-Дону, ул. Мильчакова, д. 8А")
    val address: String,

    @field:Schema(description = "Заказанные книги", readOnly = true, implementation = BookInOrderRequest::class)
    val books: List<BookInOrderDto>,

    @field:Schema(description = "Стоимость заказа", readOnly = true, type = "number", format = "double", minimum = "0.0", example = "599.99")
    val price: Double,

    @field:Schema(description = "Тип оплаты заказа", readOnly = true, example = "POSTPAY", enumAsRef = true)
    val paymentType: PaymentType,

    @field:Schema(description = "Статус заказа", readOnly = true, example = "NEW", enumAsRef = true)
    var status: OrderStatus,

    @field:Schema(description = "Дата и время оформления заказа", readOnly = true, implementation = LocalDateTime::class)
    val createdAt: LocalDateTime,

    @field:Schema(description = "Дата доставки заказа", readOnly = true, implementation = LocalDate::class)
    var deliveryDate: LocalDate,

    @field:Schema(description = "Дата и время истечения срока аренды", readOnly = true, implementation = LocalDateTime::class)
    var expirationDate: LocalDateTime
)
