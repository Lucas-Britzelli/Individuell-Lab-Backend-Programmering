const pgp = require('pg-promise')(/* options */)
const db = pgp('postgres://postgres:password@localhost:5432/postgres')

async function getBookByKeyword(keyword, authorName) {
    let books = []
    console.log('keyword:', keyword)
    console.log('authorName:', authorName)
    let query = `
    SELECT b.*
    FROM books b
    JOIN authors a ON b.author_id = a.author_number
  `

    let conditions = []
    let values = []

    if (keyword) {
        conditions.push(`b.titel ILIKE $${values.length + 1}`)
        values.push(`%${keyword}%`)
    }

    if (authorName) {
        conditions.push(`a.author_name ILIKE $${values.length + 1}`)
        values.push(`%${authorName}%`)
    }

    if (conditions.length > 0) query += ` WHERE ${conditions.join(' AND ')}`

    let data = await db.any(query, values)

    data.forEach((book) => {
        books.push({
            ...book
        })
    })
    return books
}

async function insertBook(
    titel,
    author_name,
    publication_date,
    genre,
    available
) {
    const exists = await db.query(
        `SELECT author_number FROM authors WHERE author_name = '${author_name}'`
    )

    let author_id = null
    if (exists[0]) {
        author_id = exists[0].author_number
        console.log(author_id)
    } else {
        let author = await db.one(
            `INSERT INTO authors (author_name)
            VALUES ( '${author_name}')
            RETURNING author_number`
        )
        author_id = author.author_number || null
        console.log(author_id)
    }
    if (!author_id) throw new Error('Author not found')
    db.none(
        `INSERT INTO books (titel, author_id, publication_date, genre, available)
        VALUES ( '${titel}', '${author_id}', '${publication_date}', '${genre}', true)`
    )
}

async function updateBook(titel, publication_date, author_id, book_id) {
    await db.none(
        `UPDATE books SET titel = '${titel}', publication_date = '${publication_date}', author_id = ${author_id} WHERE book_id = ${book_id}`
    )
}

async function deleteBook(book_id) {
    try {
        await db.none('DELETE FROM books WHERE book_id = $1', [book_id])
        console.log('Book deleted successfully.')
    } catch (error) {
        console.error('Error deleting book:', error)
    }
}

module.exports = {
    getBookByKeyword,
    insertBook,
    updateBook,
    deleteBook
}
