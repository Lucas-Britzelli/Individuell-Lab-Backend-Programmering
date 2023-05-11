module.exports = class bookModel {
    constructor(
        book_id,
        titel,
        author_id,
        publication_date,
        available,
        amountavailable,
        amountborrowed
    ) {
        this.book_id = book_id
        this.titel = titel
        this.author_id = author_id
        this.publication_date = publication_date
        this.available = available
        this.amountavailable = amountavailable
        this.amountborrowed = amountborrowed
    }
}
