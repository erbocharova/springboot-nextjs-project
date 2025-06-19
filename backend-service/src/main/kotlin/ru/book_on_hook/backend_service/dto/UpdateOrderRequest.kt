package ru.book_on_hook.backend_service.dto

import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.NotBlank

data class UpdateOrderRequest(

    @field:NotBlank(message = "Необходимо указать ID заказа")
    @Schema(description = "ID заказа", required = true, example = "6acbd3b2-5262-435d-9b62-055dd2fd14b9")
    val id: String
)
