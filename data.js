// Book data management
const DataManager = {
    // Sample books for initial data
    sampleBooks: [
        {
            id: '1',
            title: 'The Psychology of Money',
            author: 'Morgan Housel',
            description: 'Timeless lessons on wealth, greed, and happiness. The book explores how money—something so critical to our lives—is understood by so few.',
            coverUrl: 'https://m.media-amazon.com/images/I/71TRUbzcvaL._AC_UF1000,1000_QL80_.jpg',
            kindleLink: 'https://www.amazon.com/Psychology-Money-Timeless-lessons-happiness-ebook/dp/B084HJSJJ2/',
            hardcoverLink: 'https://www.amazon.com/Psychology-Money-Morgan-Housel/dp/0857197681/',
            paperbackLink: 'https://www.amazon.com/Psychology-Money-Morgan-Housel/dp/0857197681/'
        },
        {
            id: '2',
            title: 'Atomic Habits',
            author: 'James Clear',
            description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones. Tiny Changes, Remarkable Results.',
            coverUrl: 'https://m.media-amazon.com/images/I/81wgcld4wxL._AC_UF1000,1000_QL80_.jpg',
            kindleLink: 'https://www.amazon.com/Atomic-Habits-Proven-Build-Break-ebook/dp/B07D23CFGR/',
            hardcoverLink: 'https://www.amazon.com/Atomic-Habits-Proven-Build-Break/dp/0735211299/',
            paperbackLink: 'https://www.amazon.com/Atomic-Habits-Proven-Build-Break/dp/0735211299/'
        }
    ],

    // Get books from local storage or initialize with sample data
    getBooks: function() {
        const books = localStorage.getItem('books');
        if (books) {
            return JSON.parse(books);
        } else {
            this.saveBooks(this.sampleBooks);
            return this.sampleBooks;
        }
    },

    // Save books to local storage
    saveBooks: function(books) {
        localStorage.setItem('books', JSON.stringify(books));
    },

    // Add a new book
    addBook: function(book) {
        const books = this.getBooks();
        // Generate a unique ID using timestamp
        book.id = Date.now().toString();
        books.push(book);
        this.saveBooks(books);
        return book;
    },

    // Get a book by ID
    getBookById: function(id) {
        const books = this.getBooks();
        return books.find(book => book.id === id);
    },

    // Update an existing book
    updateBook: function(updatedBook) {
        const books = this.getBooks();
        const index = books.findIndex(book => book.id === updatedBook.id);
        if (index !== -1) {
            books[index] = updatedBook;
            this.saveBooks(books);
            return true;
        }
        return false;
    },

    // Delete a book
    deleteBook: function(id) {
        let books = this.getBooks();
        books = books.filter(book => book.id !== id);
        this.saveBooks(books);
    },

    // Search books by title or author
    searchBooks: function(query) {
        if (!query) return this.getBooks();
        
        const books = this.getBooks();
        query = query.toLowerCase();
        
        return books.filter(book => 
            book.title.toLowerCase().includes(query) || 
            book.author.toLowerCase().includes(query) ||
            book.description.toLowerCase().includes(query)
        );
    },

    // Filter books by format availability
    filterBooks: function(filter) {
        if (filter === 'all') return this.getBooks();
        
        const books = this.getBooks();
        
        return books.filter(book => {
            switch(filter) {
                case 'kindle':
                    return book.kindleLink && book.kindleLink.trim() !== '';
                case 'hardcover':
                    return book.hardcoverLink && book.hardcoverLink.trim() !== '';
                case 'paperback':
                    return book.paperbackLink && book.paperbackLink.trim() !== '';
                default:
                    return true;
            }
        });
    }
}; 