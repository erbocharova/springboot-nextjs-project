package ru.book_on_hook.backend_service.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ru.book_on_hook.backend_service.dto.CreateOrderRequest
import ru.book_on_hook.backend_service.services.OrderService

@RestController
@RequestMapping("/api/orders")
class OrderController(

    private val orderService: OrderService
) {

    @Operation(
        description = "Создание нового заказа авторизованным пользователем.",
        summary = "Возвращает ID нового заказа."
    )
    @ApiResponse(
        responseCode = "201",
        description = "Заказ создан успешно."
    )
    @ApiResponse(
        responseCode = "400",
        description = "Некорректный запрос или ошибка при создании заказа."
    )
    @ApiResponse(
        responseCode = "500",
        description = "Внутренняя ошибка сервера."
    )
    @PostMapping("/new")
    fun createOrder(@Valid @RequestBody request: CreateOrderRequest): ResponseEntity<*> {
        return try {
            val orderId = orderService.processOrder(request)
            ResponseEntity.status(HttpStatus.CREATED).body(mapOf("orderId" to orderId))
        } catch (ex: Exception) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST).body(mapOf("error" to ex.message))
        }
    }
}