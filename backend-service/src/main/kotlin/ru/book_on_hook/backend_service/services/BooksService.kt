package ru.book_on_hook.backend_service.services

import org.springframework.data.domain.Sort
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.data.mongodb.core.query.Criteria
import org.springframework.data.mongodb.core.query.Query
import org.springframework.stereotype.Service
import ru.book_on_hook.backend_service.dao.Book
import ru.book_on_hook.backend_service.dto.BookDto
import ru.book_on_hook.backend_service.dto.SearchBookRequest
import ru.book_on_hook.backend_service.dto.UpdateBookRequest
import ru.book_on_hook.backend_service.repository.BookRepository
import java.util.regex.Pattern

@Service
class BooksService(

    private val bookRepository: BookRepository,
    private val mongoTemplate: MongoTemplate
) {

    fun createBook(id: String, name: String, author: String, description: String, imageUrl: String, price: Double,
                   quantity: Int, available: Boolean, popular: Boolean, category: Book.Category): Book {
        return bookRepository.save(Book(
            id = id,
            name = name,
            author = author,
            description = description,
            imageUrl = imageUrl,
            price = price,
            maxQuantity = quantity,
            quantity = quantity,
            available = available,
            popular = popular,
            category = category))
    }

    fun existsById(id: String): Boolean {
        return bookRepository.existsById(id)
    }

    fun getAllBooks(): MutableList<BookDto> {
        return bookRepository.findAll().map(::mapBookToDto).toMutableList()
    }

    fun getBookById(id: String): BookDto? {
        val result = bookRepository.findById(id).orElse(null)
        return result?.let { mapBookToDto(it) }
    }

    fun mapBookToDto(book: Book): BookDto {
        return BookDto(
            book.id,
            book.name,
            book.author,
            book.description,
            book.imageUrl,
            book.price,
            book.quantity,
            book.available,
            book.popular,
            book.category
        )
    }

    fun updateBookById(id: String, request: UpdateBookRequest): BookDto {
        val existingBook = bookRepository.findById(id).orElseThrow { NoSuchElementException("Книга с данным ID не найдена") }
        applyUpdates(existingBook, request)
        val savedBook = bookRepository.save(existingBook)
        return mapBookToDto(savedBook)
    }

    private fun applyUpdates(existingBook: Book, updates: UpdateBookRequest) {
        updates.name?.takeIf { it.isNotBlank() }?.let { existingBook.name = it }
        updates.author?.takeIf { it.isNotBlank() }?.let { existingBook.author = it }
        updates.description?.takeIf { it.isNotBlank() }?.let { existingBook.description = it }
        updates.imageUrl?.takeIf { it.isNotBlank() }?.let { existingBook.imageUrl = it }
        updates.price?.let { existingBook.price = it }
        updates.quantity?.let { existingBook.quantity = it }
        updates.available?.let { existingBook.available = it }
        updates.popular?.let { existingBook.popular = it }
        updates.category?.let { existingBook.category = it }
    }

    fun deleteBookById(id: String) {
        bookRepository.deleteById(id)
    }

    fun searchBooks(searchRequest: SearchBookRequest): List<BookDto> {
        val criteria = buildCriteria(searchRequest)
        val books = mongoTemplate.find(criteria, Book::class.java)
        return books.map(::mapBookToDto)
    }

    private fun buildCriteria(searchRequest: SearchBookRequest): Query {
        val query = Query()

        // Добавляем критерий по названию книги (если указано)
        searchRequest.name?.let {
            query.addCriteria(Criteria.where("name").regex(Pattern.compile(it, Pattern.CASE_INSENSITIVE)))
        }

        // Критерий по авторам (возможно несколько авторов)
        searchRequest.authors?.let {
            query.addCriteria(Criteria.where("author").`in`(it.toList()))
        }

        // Критерий по категориям (возможно несколько категорий)
        searchRequest.categories?.let {
            query.addCriteria(Criteria.where("category").`in`(it.toList()))
        }

        // Диапазон цен (minPrice/maxPrice)
        searchRequest.minPrice?.let {
            query.addCriteria(Criteria.where("price").gte(it))
        }
        searchRequest.maxPrice?.let {
            query.addCriteria(Criteria.where("price").lte(it))
        }

        // Сортировка (например, по возрастанию или убыванию цены)
        searchRequest.sortOrder?.let {
            query.with(Sort.by(it))
        }

        return query
    }
}