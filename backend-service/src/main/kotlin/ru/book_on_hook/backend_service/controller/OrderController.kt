package ru.book_on_hook.backend_service.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.media.ArraySchema
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.ExampleObject
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.AccessDeniedException
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ru.book_on_hook.backend_service.dao.BookOrder
import ru.book_on_hook.backend_service.dto.CreateOrderRequest
import ru.book_on_hook.backend_service.dto.OrderDto
import ru.book_on_hook.backend_service.dto.UpdateOrderRequest
import ru.book_on_hook.backend_service.security.CustomUserDetails
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
        description = "Заказ создан успешно.",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    { "orderId": "6acbd3b2-5262-435d-9b62-055dd2fd14b9" }
                    """)]
        )]
    )
    @ApiResponse(
        responseCode = "400",
        description = "Ошибка валидации.",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {"error": "Недостаточно экземпляров книги"}
                    """)]
        )]
    )
    @ApiResponse(
        responseCode = "401",
        description = "Неавторизованный доступ. Требуется аутентификация.",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {
                        "error": "Требуется авторизация"
                    }
                """)]
        )]
    )
    @ApiResponse(
        responseCode = "404",
        description = "Книга не найдена.",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {"error": "Книга b001 не найдена"}
                    """)]
        )]
    )
    @ApiResponse(
        responseCode = "500",
        description = "Внутренняя ошибка",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {"error": "Внутренняя ошибка сервера"}
                    """)]
        )]
    )
    @PostMapping("/new")
    fun createOrder(@Valid @RequestBody request: CreateOrderRequest): ResponseEntity<Map<String, String>> {
        return try {
            val orderId = orderService.processOrder(request)
            ResponseEntity.status(HttpStatus.CREATED)
                .body(mapOf("orderId" to orderId))
        } catch (ex: NoSuchElementException) {
            ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(mapOf("error" to (ex.message ?: "Книга не найдена")))
        } catch (ex: AuthenticationCredentialsNotFoundException) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(mapOf("error" to "Требуется авторизация"))
        } catch (ex: IllegalStateException) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(mapOf("error" to (ex.message ?: "Невалидные данные заказа")))
        } catch (ex: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(mapOf("error" to "Внутренняя ошибка сервера"))
        }
    }


    @Operation(
        description = "Перевод статуса заказа в CANCELLED пользователем",
        summary = "Возвращает сообщение об успешной отмене или ошибке и обновляет кол-во книги в наличии"
    )
    @ApiResponse(
        responseCode = "200",
        description = "Заказ отменен успешно.",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    { "message": "Заказ ID 6acbd3b2-5262-435d-9b62-055dd2fd14b9 успешно отменен" }
                    """)]
        )]
    )
    @ApiResponse(
        responseCode = "400",
        description = "Ошибка валидации.",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {"error": "Невалидные данные заказа"}
                    """)]
        )]
    )
    @ApiResponse(
        responseCode = "401",
        description = "Неавторизованный доступ. Требуется аутентификация.",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {
                        "error": "Требуется авторизация"
                    }
                """)]
        )]
    )
    @ApiResponse(
        responseCode = "403",
        description = "Доступ запрещен",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {"error": "Недостаточно прав"}
                    """)]
        )]
    )
    @ApiResponse(
        responseCode = "404",
        description = "Заказ не найден.",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {"error": "Заказ с ID 6acbd3b2-5262-435d-9b62-055dd2fd14b9 не найден"}
                    """)]
        )]
    )
    @ApiResponse(
        responseCode = "500",
        description = "Внутренняя ошибка",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {"error": "Внутренняя ошибка сервера"}
                    """)]
        )]
    )
    @PatchMapping("/cancel")
    fun cancelOrderById(@Valid @RequestBody request: UpdateOrderRequest,
                        @Parameter(hidden = true) @AuthenticationPrincipal currentUser: CustomUserDetails)
    : ResponseEntity<Map<String, String>> {
        return try {
            val cancelledOrder = orderService.cancelOrderById(request.id, currentUser.username)
            ResponseEntity.ok(mapOf("message" to "Заказ ID ${request.id} успешно отменен"))
        } catch (ex: NoSuchElementException) {
            ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(mapOf("error" to (ex.message ?: "Заказ не найден")))
        } catch (ex: IllegalStateException) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(mapOf("error" to (ex.message ?: "Невалидные данные заказа")))
        } catch (ex: AuthenticationCredentialsNotFoundException) {
            ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(mapOf("error" to "Требуется авторизация"))
        } catch (ex: AccessDeniedException) {
            ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(mapOf("error" to (ex.message ?: "Недостаточно прав")))
        } catch (ex: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(mapOf("error" to "Внутренняя ошибка сервера"))
        }
    }


    @Operation(
        description = "Обновление статуса заказа на PROCESSING администратором",
        summary = "Возвращает сообщение об успешном обновлении или ошибке"
    )
    @ApiResponse(
        responseCode = "200",
        description = "Заказ обновлен успешно.",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    { "message": "Статус заказа 6acbd3b2-5262-435d-9b62-055dd2fd14b9 обновлен на PROCESSING" }
                    """)]
        )]
    )
    @ApiResponse(
        responseCode = "400",
        description = "Ошибка валидации.",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {"error": "Невалидные данные заказа"}
                    """)]
        )]
    )
    @ApiResponse(
        responseCode = "403",
        description = "Доступ запрещен",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {"error": "Недостаточно прав"}
                    """)]
        )]
    )
    @ApiResponse(
        responseCode = "404",
        description = "Заказ не найден.",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {"error": "Заказ с ID 6acbd3b2-5262-435d-9b62-055dd2fd14b9 не найден"}
                    """)]
        )]
    )
    @ApiResponse(
        responseCode = "500",
        description = "Внутренняя ошибка",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {"error": "Внутренняя ошибка сервера"}
                    """)]
        )]
    )
    @PatchMapping("/admin/update-to-processing")
    fun updateOrderStatusToProcessing(@Valid @RequestBody request: UpdateOrderRequest): ResponseEntity<Map<String, String>> {
        val newStatus = BookOrder.OrderStatus.PROCESSING

        return try {
            val updatedOrder = orderService.updateStatusById(request.id, newStatus)
            ResponseEntity.ok(mapOf("message" to "Статус заказа ${updatedOrder.id} обновлен на $newStatus"))
        } catch (ex: NoSuchElementException) {
            ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(mapOf("error" to (ex.message ?: "Заказ не найден")))
        } catch (ex: IllegalStateException) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(mapOf("error" to (ex.message ?: "Невалидные данные заказа")))
        } catch (ex: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(mapOf("error" to "Внутренняя ошибка сервера"))
        }
    }

    @Operation(
        description = "Обновление статуса заказа на DELIVERY администратором",
        summary = "Возвращает сообщение об успешном обновлении или ошибке"
    )
    @ApiResponse(
        responseCode = "200",
        description = "Заказ обновлен успешно.",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    { "message": "Статус заказа 6acbd3b2-5262-435d-9b62-055dd2fd14b9 обновлен на DELIVERY" }
                    """)]
        )]
    )
    @ApiResponse(
        responseCode = "400",
        description = "Ошибка валидации.",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {"error": "Невалидные данные заказа"}
                    """)]
        )]
    )
    @ApiResponse(
        responseCode = "403",
        description = "Доступ запрещен",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {"error": "Недостаточно прав"}
                    """)]
        )]
    )
    @ApiResponse(
        responseCode = "404",
        description = "Заказ не найден.",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {"error": "Заказ с ID 6acbd3b2-5262-435d-9b62-055dd2fd14b9 не найден"}
                    """)]
        )]
    )
    @ApiResponse(
        responseCode = "500",
        description = "Внутренняя ошибка",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {"error": "Внутренняя ошибка сервера"}
                    """)]
        )]
    )
    @PatchMapping("/admin/update-to-delivery")
    fun updateOrderStatusToDelivery(@Valid @RequestBody request: UpdateOrderRequest): ResponseEntity<Map<String, String>> {
        val newStatus = BookOrder.OrderStatus.DELIVERY

        return try {
            val updatedOrder = orderService.updateStatusById(request.id, newStatus)
            ResponseEntity.ok(mapOf("message" to "Статус заказа ${updatedOrder.id} обновлен на $newStatus"))
        } catch (ex: NoSuchElementException) {
            ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(mapOf("error" to (ex.message ?: "Заказ не найден")))
        } catch (ex: IllegalStateException) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(mapOf("error" to (ex.message ?: "Невалидные данные заказа")))
        } catch (ex: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(mapOf("error" to "Внутренняя ошибка сервера"))
        }
    }


    @Operation(
        description = "Обновление статуса заказа на ON_RENT администратором",
        summary = "Возвращает сообщение об успешном обновлении или ошибке"
    )
    @ApiResponse(
        responseCode = "200",
        description = "Заказ обновлен успешно.",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    { "message": "Статус заказа 6acbd3b2-5262-435d-9b62-055dd2fd14b9 обновлен на ON_RENT" }
                    """)]
        )]
    )
    @ApiResponse(
        responseCode = "400",
        description = "Ошибка валидации.",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {"error": "Невалидные данные заказа"}
                    """)]
        )]
    )
    @ApiResponse(
        responseCode = "403",
        description = "Доступ запрещен",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {"error": "Недостаточно прав"}
                    """)]
        )]
    )
    @ApiResponse(
        responseCode = "404",
        description = "Заказ не найден.",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {"error": "Заказ с ID 6acbd3b2-5262-435d-9b62-055dd2fd14b9 не найден"}
                    """)]
        )]
    )
    @ApiResponse(
        responseCode = "500",
        description = "Внутренняя ошибка",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {"error": "Внутренняя ошибка сервера"}
                    """)]
        )]
    )
    @PatchMapping("/admin/update-to-on-rent")
    fun updateOrderStatusToOnRent(@Valid @RequestBody request: UpdateOrderRequest): ResponseEntity<Map<String, String>> {
        val newStatus = BookOrder.OrderStatus.ON_RENT

        return try {
            val updatedOrder = orderService.updateStatusById(request.id, newStatus)
            ResponseEntity.ok(mapOf("message" to "Статус заказа ${updatedOrder.id} обновлен на $newStatus"))
        } catch (ex: NoSuchElementException) {
            ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(mapOf("error" to (ex.message ?: "Заказ не найден")))
        } catch (ex: IllegalStateException) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(mapOf("error" to (ex.message ?: "Невалидные данные заказа")))
        } catch (ex: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(mapOf("error" to "Внутренняя ошибка сервера"))
        }
    }


    @Operation(
        description = "Обновление статуса заказа на EXPIRED администратором",
        summary = "Возвращает сообщение об успешном обновлении или ошибке"
    )
    @ApiResponse(
        responseCode = "200",
        description = "Заказ обновлен успешно.",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    { "message": "Статус заказа 6acbd3b2-5262-435d-9b62-055dd2fd14b9 обновлен на EXPIRED" }
                    """)]
        )]
    )
    @ApiResponse(
        responseCode = "400",
        description = "Ошибка валидации.",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {"error": "Невалидные данные заказа"}
                    """)]
        )]
    )
    @ApiResponse(
        responseCode = "403",
        description = "Доступ запрещен",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {"error": "Недостаточно прав"}
                    """)]
        )]
    )
    @ApiResponse(
        responseCode = "404",
        description = "Заказ не найден.",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {"error": "Заказ с ID 6acbd3b2-5262-435d-9b62-055dd2fd14b9 не найден"}
                    """)]
        )]
    )
    @ApiResponse(
        responseCode = "500",
        description = "Внутренняя ошибка",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {"error": "Внутренняя ошибка сервера"}
                    """)]
        )]
    )
    @PatchMapping("/admin/update-to-expired")
    fun updateOrderStatusToExpired(@Valid @RequestBody request: UpdateOrderRequest): ResponseEntity<Map<String, String>> {
        val newStatus = BookOrder.OrderStatus.EXPIRED

        return try {
            val updatedOrder = orderService.updateStatusById(request.id, newStatus)
            ResponseEntity.ok(mapOf("message" to "Статус заказа ${updatedOrder.id} обновлен на $newStatus"))
        } catch (ex: NoSuchElementException) {
            ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(mapOf("error" to (ex.message ?: "Заказ не найден")))
        } catch (ex: IllegalStateException) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(mapOf("error" to (ex.message ?: "Невалидные данные заказа")))
        } catch (ex: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(mapOf("error" to "Внутренняя ошибка сервера"))
        }
    }


    @Operation(
        description = "Обновление статуса заказа на COMPLETED администратором",
        summary = "Возвращает сообщение об успешном обновлении или ошибке и обновляет кол-во доступных книг"
    )
    @ApiResponse(
        responseCode = "200",
        description = "Заказ обновлен успешно.",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    { "message": "Статус заказа 6acbd3b2-5262-435d-9b62-055dd2fd14b9 обновлен на COMPLETED" }
                    """)]
        )]
    )
    @ApiResponse(
        responseCode = "400",
        description = "Ошибка валидации.",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {"error": "Невалидные данные заказа"}
                    """)]
        )]
    )
    @ApiResponse(
        responseCode = "403",
        description = "Доступ запрещен",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {"error": "Недостаточно прав"}
                    """)]
        )]
    )
    @ApiResponse(
        responseCode = "404",
        description = "Заказ или книга из заказа не найдены.",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {"error": "Заказ с ID 6acbd3b2-5262-435d-9b62-055dd2fd14b9 не найден"}
                    """)]
        )]
    )
    @ApiResponse(
        responseCode = "500",
        description = "Внутренняя ошибка",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {"error": "Внутренняя ошибка сервера"}
                    """)]
        )]
    )
    @PatchMapping("/admin/update-to-completed")
    fun updateOrderStatusToCompleted(@Valid @RequestBody request: UpdateOrderRequest): ResponseEntity<Map<String, String>> {
        val newStatus = BookOrder.OrderStatus.COMPLETED

        return try {
            val updatedOrder = orderService.updateStatusById(request.id, newStatus)
            ResponseEntity.ok(mapOf("message" to "Статус заказа ${updatedOrder.id} обновлен на $newStatus"))
        } catch (ex: NoSuchElementException) {
            ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(mapOf("error" to (ex.message ?: "Заказ не найден")))
        } catch (ex: IllegalStateException) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(mapOf("error" to (ex.message ?: "Невалидные данные заказа")))
        } catch (ex: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(mapOf("error" to "Внутренняя ошибка сервера"))
        }
    }


    @Operation(
        description = "Обновление статуса заказа на CANCELLED администратором",
        summary = "Возвращает сообщение об успешном обновлении или ошибке и обновляет кол-во доступных книг"
    )
    @ApiResponse(
        responseCode = "200",
        description = "Заказ обновлен успешно.",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    { "message": "Статус заказа 6acbd3b2-5262-435d-9b62-055dd2fd14b9 обновлен на CANCELLED" }
                    """)]
        )]
    )
    @ApiResponse(
        responseCode = "400",
        description = "Ошибка валидации.",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {"error": "Невалидные данные заказа"}
                    """)]
        )]
    )
    @ApiResponse(
        responseCode = "403",
        description = "Доступ запрещен",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {"error": "Недостаточно прав"}
                    """)]
        )]
    )
    @ApiResponse(
        responseCode = "404",
        description = "Заказ или книга из заказа не найдены.",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {"error": "Заказ с ID 6acbd3b2-5262-435d-9b62-055dd2fd14b9 не найден"}
                    """)]
        )]
    )
    @ApiResponse(
        responseCode = "500",
        description = "Внутренняя ошибка",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {"error": "Внутренняя ошибка сервера"}
                    """)]
        )]
    )
    @PatchMapping("/admin/update-to-cancelled")
    fun updateOrderStatusToCancelled(@Valid @RequestBody request: UpdateOrderRequest): ResponseEntity<Map<String, String>> {
        val newStatus = BookOrder.OrderStatus.CANCELLED

        return try {
            val updatedOrder = orderService.updateStatusById(request.id, newStatus)
            ResponseEntity.ok(mapOf("message" to "Статус заказа ${updatedOrder.id} обновлен на $newStatus"))
        } catch (ex: NoSuchElementException) {
            ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(mapOf("error" to (ex.message ?: "Заказ не найден")))
        } catch (ex: IllegalStateException) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(mapOf("error" to (ex.message ?: "Невалидные данные заказа")))
        } catch (ex: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(mapOf("error" to "Внутренняя ошибка сервера"))
        }
    }


    @Operation(
        description = "Получить заказы",
        summary = "Возвращает список всех заказов. Доступно только для администратора."
    )
    @ApiResponse(
        responseCode = "200",
        description = "Успешный запрос. Возвращает список заказов.",
        content = [Content(
            mediaType = "application/json",
            array = ArraySchema(schema = Schema(implementation = OrderDto::class)),
            examples = [ExampleObject(value = """
                    [
                        {
                            "id": "6acbd3b2-5262-435d-9b62-055dd2fd14b9",
                            "username": "johndoe",
                            "firstName": "Джон",
                            "lastName": "Доу",
                            "mail": "john.doe@example.com",
                            "telNumber": "+79611616161",
                            "address": "г. Ростов-на-Дону, ул. Мильчакова, д. 8А",
                            "books": 
                            [
                                {
                                    "bookId": "b001",
                                    "title": "Война и мир",
                                    "author": "Л. Н. Толстой",
                                    "quantity": "2",
                                    "pricePerUnit": "599.99"
                                },
                                {
                                    "bookId": "b002",
                                    "title": "Мастер и Маргарита",
                                    "author": "М. А. Булгаков",
                                    "quantity": "1",
                                    "pricePerUnit": "200.00"
                                }
                            ],
                            "price": "1399.98",
                            "paymentType": "POSTPAY",
                            "status": "NEW",
                            "createdAt": "2023-05-10T10:30:00",
                            "deliveryDate": "2023-05-11",
                            "expirationDate": "2023-05-25T23:59:59"
                        }
                    ]
                """)]
        )]
    )
    @ApiResponse(
        responseCode = "401",
        description = "Неавторизованный доступ. Требуется аутентификация.",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {
                        "error": "Требуется авторизация"
                    }
                """)]
        )]
    )
    @ApiResponse(
        responseCode = "403",
        description = "Запрещено. Пользователь пытается получить не свои заказы.",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {
                        "error": "Доступ запрещен"
                    }
                """)]
        )]
    )
    @ApiResponse(
        responseCode = "500",
        description = "Внутренняя ошибка",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {"error": "Внутренняя ошибка сервера"}
                    """)]
        )]
    )
    @GetMapping("/admin/get-all")
    fun getAllOrders(): ResponseEntity<*> {
        return try {
            val orders = orderService.getAllOrders()
            ResponseEntity.ok(orders)
        } catch (ex: AccessDeniedException) {
            ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(mapOf("error" to "Доступ запрещен"))
        } catch (ex: AuthenticationCredentialsNotFoundException) {
            ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(mapOf("error" to "Требуется авторизация"))
        } catch (ex: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(mapOf("error" to "Внутренняя ошибка сервера"))
        }
    }


    @Operation(
        description = "Получить заказы пользователя",
        summary = "Возвращает список заказов для указанного пользователя. Доступно только для владельца аккаунта."
    )
    @ApiResponse(
        responseCode = "200",
        description = "Успешный запрос. Возвращает список заказов.",
        content = [Content(
            mediaType = "application/json",
            array = ArraySchema(schema = Schema(implementation = OrderDto::class)),
            examples = [ExampleObject(value = """
                    [
                        {
                            "id": "6acbd3b2-5262-435d-9b62-055dd2fd14b9",
                            "username": "johndoe",
                            "firstName": "Джон",
                            "lastName": "Доу",
                            "mail": "john.doe@example.com",
                            "telNumber": "+79611616161",
                            "address": "г. Ростов-на-Дону, ул. Мильчакова, д. 8А",
                            "books": 
                            [
                                {
                                    "bookId": "b001",
                                    "title": "Война и мир",
                                    "author": "Л. Н. Толстой",
                                    "quantity": "2",
                                    "pricePerUnit": "599.99"
                                },
                                {
                                    "bookId": "b002",
                                    "title": "Мастер и Маргарита",
                                    "author": "М. А. Булгаков",
                                    "quantity": "1",
                                    "pricePerUnit": "200.00"
                                }
                            ],
                            "price": "1399.98",
                            "paymentType": "POSTPAY",
                            "status": "NEW",
                            "createdAt": "2023-05-10T10:30:00",
                            "deliveryDate": "2023-05-11",
                            "expirationDate": "2023-05-25T23:59:59"
                        }
                    ]
                """)]
        )]
    )
    @ApiResponse(
        responseCode = "401",
        description = "Неавторизованный доступ. Требуется аутентификация.",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {
                        "error": "Требуется авторизация"
                    }
                """)]
        )]
    )
    @ApiResponse(
        responseCode = "403",
        description = "Запрещено. Пользователь пытается получить не свои заказы.",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {
                        "error": "Можно просматривать только свои заказы"
                    }
                """)]
        )]
    )
    @ApiResponse(
        responseCode = "500",
        description = "Внутренняя ошибка",
        content = [Content(
            mediaType = "application/json",
            examples = [ExampleObject(value = """
                    {"error": "Внутренняя ошибка сервера"}
                    """)]
        )]
    )
    @GetMapping("/username={username}")
    fun getOrdersByUsername(@Parameter(hidden = true) @AuthenticationPrincipal currentUser: CustomUserDetails,
                            @Valid @PathVariable username: String)
    : ResponseEntity<*> {
        if (currentUser.username != username) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(mapOf("error" to "Можно просматривать только свои заказы"))
        }
        try {
            return ResponseEntity.ok(orderService.getOrdersByUsername(username))
        } catch (ex: AuthenticationCredentialsNotFoundException) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(mapOf("error" to "Требуется авторизация"))
        } catch (ex: Exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(mapOf("error" to "Внутренняя ошибка сервера"))
        }
    }
}