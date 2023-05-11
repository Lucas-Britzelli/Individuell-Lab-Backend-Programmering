const bookModel = require('../models/bookModel')
const db_context = require('../db_context')

async function getAllBooks() {
    let books = []

    let data = await db_context.selectAllBooks()

    data.forEach((book) => {
        books.push({
            book_id: book.book_id,
            titel: book.titel,
            author_id: book.author_id,
            publication_date: book.publication_date,
            available: book.available,
            amountavailable: book.amountavailable
        })
    })

    return books
}

async function getBookByKeyword(keyword, authorName) {
    let books = []

    let data = await db_context.getBookByKeyword(keyword, authorName)

    data.forEach((book) => {
        books.push(
            new bookModel(
                book.book_id,
                book.titel,
                book.author_id,
                book.publication_date,
                book.available,
                book.amountavailable,
                book.amountborrowed
            )
        )
    })

    return books
}

async function addBook(book_id, titel, author_id, publication_date, available) {
    db_context.insertBook(
        book_id,
        titel,
        author_id,
        publication_date,
        available
    )
}

async function editBook(
    titel,
    publication_date,
    author_id,
    book_id,
    available
) {
    db_context.updateBook(titel, publication_date, author_id, book_id)
}

async function deleteBook(book_id) {
    db_context.deleteBook(book_id)
}

module.exports = {
    getAllBooks,
    getBookByKeyword,
    addBook,
    editBook,
    deleteBook
}
