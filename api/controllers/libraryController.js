const {
    getAllBooks,
    getBookByKeyword,
    addBook,
    editBook,
    deleteBook
} = require('../repositories/libraryRepository')
const libraryRepository = require('../repositories/libraryRepository')

async function search(req, res) {
    let keyword = req.query.keyword
    let authorName = req.query.authorName || null

    let data = await getBookByKeyword(keyword, authorName)

    console.log(data)

    return res.json(data)
}

async function add(req, res) {
    console.log(req.body)

    await addBook(
        req.body.titel,
        req.body.author_id,
        req.body.publication_date,
        req.body.genre,
        req.body.available,
        req.body.book_id
    )
}

async function edit(req, res) {
    await editBook(
        req.body.titel,
        req.body.publication_date,
        req.body.author_id,
        req.body.book_id
    )
}

async function remove(req, res) {
    await deleteBook(req.body.book_id)
}

async function borrow(req, res) {
    const bookId = req.body.bookId
    const amountavailable = req.body.amountavailable
    const amountborrowed = req.body.amountborrowed

    await libraryRepository.borrowBook(bookId, amountavailable, amountborrowed)

    const updatedBook = await libraryRepository.getBookById(bookId)
    updatedBook.amountavailable = amountAvailable - 1
    updatedBook.amountborrowed = amountBorrowed + 1

    res.json(updatedBook)
}

module.exports = {
    search,
    add,
    edit,
    remove,
    borrow
}
