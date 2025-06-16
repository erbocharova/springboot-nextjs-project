package ru.book_on_hook.backend_service.dao

import org.springframework.data.mongodb.core.mapping.Document
import ru.book_on_hook.backend_service.dao.Book.Category
import java.net.InetAddress

@Document(collection = "orders")
data class BookOrder(
    val id: String,
    var username: String,
    var address: String,
    var : String,
    var imageUrl: String,
    var price: Double,
    val maxQuantity: Int,
    var quantity: Int,
    var available: Boolean,
    var popular: Boolean,
    var category: Category
)
