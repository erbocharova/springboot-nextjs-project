package ru.book_on_hook.backend_service.dto

import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty
import ru.book_on_hook.backend_service.dao.BookInOrderRequest
import ru.book_on_hook.backend_service.dao.BookOrder.PaymentType
import java.time.LocalDate
import java.util.Date

@Schema(description = "Входящий запрос на создание заказа.")
data class CreateOrderRequest(

    @field:NotBlank(message = "Необходимо указать логин получателя.")
    @Schema(description = "Логин пользователя", required = true, example = "username123")
    val username: String,

    @field:NotBlank(message = "Необходимо указать имя получателя.")
    @Schema(description = "Имя получателя заказа", required = true, example = "Иван")
    val firstName: String,

    @field:NotBlank(message = "Необходимо указать фамилию получателя.")
    @Schema(description = "Фамилия получателя заказа", required = true, example = "Иванов")
    val lastName: String,

    @field:NotBlank(message = "Необходимо указать электронную почту.")
    @Schema(description = "Электронная почта получателя", required = true, example = "iivanov@mail.ru")
    val email: String,

    @field:NotBlank(message = "Необходимо указать номер телефона.")
    @Schema(description = "Номер телефона получателя", pattern = "^\\+?[1-9]\\d{1,14}$", required = true, example = "+79611616161")
    val telNumber: String,

    @field:NotBlank(message = "Необходимо указать адрес доставки.")
    @Schema(description = "Полный адрес доставки заказа", required = true, example = "г. Ростов-на-Дону, ул. Мильчакова, д. 8А")
    val address: String,

    @field:NotEmpty(message = "Состав заказа не может быть пустым.")
    @Schema(description = "Заказанные книги", required = true, implementation = BookInOrderRequest::class)
    val books: List<BookInOrderRequest>,

    @Schema(description = "Тип оплаты заказа", required = true, example = "POSTPAY", enumAsRef = true)
    val paymentType: PaymentType,

    @Schema(description = "Дата доставки заказа", required = true, example = "2025-01-15")
    val deliveryDate: LocalDate
)