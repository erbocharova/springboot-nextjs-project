package ru.book_on_hook.backend_service.dao

import org.springframework.data.mongodb.core.mapping.Document

@Document(collection = "books")
data class Book(
    val id: String,
    var name: String,
    var author: String,
    var description: String,
    var imageUrl: String,
    var price: Double,
    val maxQuantity: Int,
    var quantity: Int,
    var available: Boolean,
    var popular: Boolean,
    var category: Category
){
    enum class Category { ADVENTURE, DETECTIVE, HISTORICAL, FANTASY, ROMANCE, HORROR, KIDS, SCHOOL }
}

