// DOM Elements
const booksContainer = document.getElementById('booksContainer');
const addBookBtn = document.getElementById('addBookBtn');
const bookModal = document.getElementById('bookModal');
const deleteModal = document.getElementById('deleteModal');
const bookForm = document.getElementById('bookForm');
const modalTitle = document.getElementById('modalTitle');
const closeBtn = document.querySelector('.close');
const cancelBtn = document.getElementById('cancelBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const filterSelect = document.getElementById('filterSelect');
const bookShowcase = document.getElementById('bookShowcase');
const adminLoginBtn = document.getElementById('adminLoginBtn');
const adminLoginModal = document.getElementById('adminLoginModal');
const adminLoginForm = document.getElementById('adminLoginForm');
const adminLogoutBtn = document.getElementById('adminLogoutBtn');
const adminCloseBtn = document.querySelector('#adminLoginModal .close');

// Current book ID for editing/deleting
let currentBookId = null;
// Touch tracking variables
let touchStartX = 0;
let touchEndX = 0;
let isMobileDevice = false;
// Admin state
let isAdminMode = false;

// Initialize the application
function init() {
    // Check if we're on a mobile device
    isMobileDevice = window.matchMedia('(max-width: 768px)').matches || 
                     window.matchMedia('(hover: none)').matches;
    
    // Check if admin is already logged in (from session storage)
    checkAdminStatus();
    
    renderBooks();
    setupEventListeners();
    setup3DEffects();
    create3DBookShowcase();
    generateStructuredData();
    
    // Add a listener for orientation changes to update the layout
    window.addEventListener('orientationchange', function() {
        // Small delay to allow the browser to complete the orientation change
        setTimeout(() => {
            create3DBookShowcase();
            renderBooks(searchInput.value.trim());
            generateStructuredData();
        }, 300);
    });
}

// Check if admin is logged in
function checkAdminStatus() {
    isAdminMode = sessionStorage.getItem('isAdmin') === 'true';
    updateUIForAdminStatus();
}

// Update UI based on admin status
function updateUIForAdminStatus() {
    if (isAdminMode) {
        // Admin is logged in - show admin controls
        if (addBookBtn) addBookBtn.style.display = 'block';
        if (adminLoginBtn) adminLoginBtn.style.display = 'none';
        if (adminLogoutBtn) adminLogoutBtn.style.display = 'block';
        
        // Show edit/delete buttons on book cards
        document.querySelectorAll('.book-actions').forEach(actionsDiv => {
            actionsDiv.style.display = 'flex';
        });
        
        // Show admin mode indicator
        showAdminModeIndicator();
    } else {
        // Regular user - hide admin controls
        if (addBookBtn) addBookBtn.style.display = 'none';
        if (adminLoginBtn) adminLoginBtn.style.display = 'block';
        if (adminLogoutBtn) adminLogoutBtn.style.display = 'none';
        
        // Hide edit/delete buttons on book cards
        document.querySelectorAll('.book-actions').forEach(actionsDiv => {
            actionsDiv.style.display = 'none';
        });
        
        // Remove admin mode indicator
        removeAdminModeIndicator();
    }
}

// Show admin mode indicator
function showAdminModeIndicator() {
    // Remove existing indicator if any
    removeAdminModeIndicator();
    
    // Create and add indicator
    const indicator = document.createElement('div');
    indicator.className = 'admin-mode-indicator';
    indicator.id = 'adminModeIndicator';
    indicator.innerHTML = '<i class="fas fa-user-shield"></i> Admin Mode';
    document.body.appendChild(indicator);
}

// Remove admin mode indicator
function removeAdminModeIndicator() {
    const existingIndicator = document.getElementById('adminModeIndicator');
    if (existingIndicator) {
        existingIndicator.remove();
    }
}

// Set up 3D perspective effects
function setup3DEffects() {
    // Add perspective to the whole document for better 3D effects
    document.body.style.perspective = '1000px';
    
    // Add 3D effect to book cards on mouse movement
    booksContainer.addEventListener('mousemove', handleBookHover);
}

// Handle 3D hover effect on book cards
function handleBookHover(e) {
    // Skip 3D effects on touch devices
    if (window.matchMedia('(hover: none)').matches) {
        return;
    }
    
    const cards = document.querySelectorAll('.book-card');
    
    cards.forEach(card => {
        // Get the card's position and dimensions
        const rect = card.getBoundingClientRect();
        
        // Calculate mouse position relative to the card center
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        // Calculate distance from mouse to center (as percentage of card width/height)
        const distanceX = (mouseX - centerX) / (rect.width / 2);
        const distanceY = (mouseY - centerY) / (rect.height / 2);
        
        // Only apply the effect if mouse is close to the card
        const distance = Math.sqrt(Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2));
        const maxDistance = Math.sqrt(Math.pow(rect.width, 2) + Math.pow(rect.height, 2)) / 2;
        
        if (distance < maxDistance * 1.5) {
            // Calculate rotation amount based on mouse position - reduced intensity
            const rotateY = 5 * distanceX; // Reduced from 10 to 5
            const rotateX = -5 * distanceY; // Reduced from -10 to -5
            
            // Apply the transform
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(5px)`; // Reduced Z translation from 10px to 5px
        } else {
            // Reset transform when mouse is far away
            card.style.transform = 'perspective(1000px) rotateY(0) translateZ(0)';
        }
    });
}

// Set up all event listeners
function setupEventListeners() {
    // Add book button click
    if (addBookBtn) {
        addBookBtn.addEventListener('click', () => {
            if (isAdminMode) {
                openModal();
            } else {
                alert('You must be an admin to add books.');
            }
        });
    }
    
    // Admin login button
    if (adminLoginBtn) {
        adminLoginBtn.addEventListener('click', () => {
            adminLoginModal.style.display = 'block';
        });
    }
    
    // Admin logout button
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', () => {
            logoutAdmin();
        });
    }
    
    // Admin login form submission
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', handleAdminLogin);
    }
    
    // Admin modal close button
    if (adminCloseBtn) {
        adminCloseBtn.addEventListener('click', () => {
            adminLoginModal.style.display = 'none';
        });
    }
    
    // Admin modal cancel button
    const adminCancelBtn = document.querySelector('#adminLoginModal .close-admin-modal');
    if (adminCancelBtn) {
        adminCancelBtn.addEventListener('click', () => {
            adminLoginModal.style.display = 'none';
        });
    }
    
    // Close modal on X click
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // Close modal on cancel button click
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }
    
    // Form submission
    if (bookForm) {
        bookForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Cancel delete
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', () => {
            deleteModal.style.display = 'none';
        });
    }
    
    // Confirm delete
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', () => {
            if (currentBookId && isAdminMode) {
                DataManager.deleteBook(currentBookId);
                renderBooks();
                create3DBookShowcase();
                deleteModal.style.display = 'none';
            }
        });
    }
    
    // Search functionality
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const query = searchInput.value.trim();
            renderBooks(query);
        });
    }
    
    // Search on Enter key
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                renderBooks(query);
            }
        });
    }
    
    // Filter change
    if (filterSelect) {
        filterSelect.addEventListener('change', () => {
            renderBooks(searchInput.value.trim());
        });
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === bookModal) {
            closeModal();
        }
        if (e.target === deleteModal) {
            deleteModal.style.display = 'none';
        }
        if (e.target === adminLoginModal) {
            adminLoginModal.style.display = 'none';
        }
    });
    
    // Setup touch events for showcase
    setupTouchEvents();
}

// Setup touch events for swipe functionality
function setupTouchEvents() {
    // Touch start event
    bookShowcase.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    // Touch end event
    bookShowcase.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
}

// Handle swipe gestures
function handleSwipe() {
    const swipeThreshold = 50; // Minimum distance for a swipe
    const swipeDistance = touchEndX - touchStartX;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
        // Get all 3D books in the showcase
        const books = bookShowcase.querySelectorAll('.book-3d');
        if (books.length < 2) return; // Need at least 2 books for rotation
        
        // Determine swipe direction
        if (swipeDistance > 0) {
            // Swipe right: rotate books right (last book becomes first)
            bookShowcase.insertBefore(books[books.length - 1], books[0]);
        } else {
            // Swipe left: rotate books left (first book goes to end)
            bookShowcase.appendChild(books[0]);
        }
        
        // Add animation for smooth transition
        books.forEach(book => {
            book.style.transition = 'transform 0.3s ease-in-out';
            setTimeout(() => {
                book.style.transition = '';
            }, 300);
        });
    }
}

// Open the modal for adding or editing
function openModal(bookId = null) {
    bookForm.reset();
    currentBookId = bookId;
    
    if (bookId) {
        // Edit mode
        const book = DataManager.getBookById(bookId);
        if (book) {
            modalTitle.textContent = 'Edit Book';
            document.getElementById('bookId').value = book.id;
            document.getElementById('title').value = book.title;
            document.getElementById('author').value = book.author;
            document.getElementById('description').value = book.description;
            document.getElementById('coverUrl').value = book.coverUrl;
            document.getElementById('kindleLink').value = book.kindleLink || '';
            document.getElementById('hardcoverLink').value = book.hardcoverLink || '';
            document.getElementById('paperbackLink').value = book.paperbackLink || '';
        }
    } else {
        // Add mode
        modalTitle.textContent = 'Add New Book';
        document.getElementById('bookId').value = '';
    }
    
    bookModal.style.display = 'block';
}

// Close the modal
function closeModal() {
    bookModal.style.display = 'none';
    bookForm.reset();
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const bookId = document.getElementById('bookId').value;
    const book = {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        description: document.getElementById('description').value,
        coverUrl: document.getElementById('coverUrl').value,
        kindleLink: document.getElementById('kindleLink').value,
        hardcoverLink: document.getElementById('hardcoverLink').value,
        paperbackLink: document.getElementById('paperbackLink').value
    };
    
    if (bookId) {
        // Update existing book
        book.id = bookId;
        DataManager.updateBook(book);
    } else {
        // Add new book
        DataManager.addBook(book);
    }
    
    renderBooks();
    create3DBookShowcase();
    closeModal();
}

// Handle admin login
function handleAdminLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('adminUsername').value.trim();
    const password = document.getElementById('adminPassword').value.trim();
    
    // Simple authentication - replace with your preferred username/password
    if (username === 'admin' && password === 'bookadmin123') {
        // Login successful
        isAdminMode = true;
        sessionStorage.setItem('isAdmin', 'true');
        adminLoginModal.style.display = 'none';
        adminLoginForm.reset();
        updateUIForAdminStatus();
        
        // Show success message
        const successToast = document.createElement('div');
        successToast.className = 'toast success';
        successToast.textContent = 'Admin login successful';
        document.body.appendChild(successToast);
        
        // Remove toast after 3 seconds
        setTimeout(() => {
            successToast.style.opacity = '0';
            setTimeout(() => {
                successToast.remove();
            }, 500);
        }, 3000);
    } else {
        // Login failed
        alert('Incorrect username or password.');
    }
}

// Logout admin
function logoutAdmin() {
    isAdminMode = false;
    sessionStorage.removeItem('isAdmin');
    updateUIForAdminStatus();
    
    // Show logout message
    const logoutToast = document.createElement('div');
    logoutToast.className = 'toast info';
    logoutToast.textContent = 'Admin logged out';
    document.body.appendChild(logoutToast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        logoutToast.style.opacity = '0';
        setTimeout(() => {
            logoutToast.remove();
        }, 500);
    }, 3000);
}

// Render books to the DOM
function renderBooks(searchQuery = '') {
    let books;
    
    // First apply search if there's a query
    if (searchQuery) {
        books = DataManager.searchBooks(searchQuery);
    } else {
        books = DataManager.getBooks();
    }
    
    // Then apply filter
    const filter = filterSelect.value;
    if (filter !== 'all') {
        books = books.filter(book => {
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
    
    // Clear the container
    booksContainer.innerHTML = '';
    
    if (books.length === 0) {
        booksContainer.innerHTML = '<p class="no-books">No books found. Add some books or try a different search.</p>';
        return;
    }
    
    // Create book cards
    books.forEach(book => {
        const bookCard = createBookCard(book);
        booksContainer.appendChild(bookCard);
    });
}

// Create a book card element
function createBookCard(book) {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.id = `book-${book.id}`; // Add ID for structured data reference and direct linking
    
    // Add proper semantic markup for SEO
    card.setAttribute('itemscope', '');
    card.setAttribute('itemtype', 'https://schema.org/Book');
    
    // Assign a random color class for the book spine
    const colorIndex = Math.floor(Math.random() * 5) + 1;
    card.classList.add(`book-color-${colorIndex}`);
    
    // Create cover image
    const coverImg = document.createElement('img');
    coverImg.className = 'book-cover loading'; // Add loading class
    coverImg.alt = `Cover of ${book.title}`;
    coverImg.setAttribute('itemprop', 'image');
    
    // Add load event to remove loading animation
    coverImg.onload = function() {
        this.classList.remove('loading');
    };
    
    // Set placeholder in case of error
    coverImg.onerror = function() {
        this.src = 'https://via.placeholder.com/300x450?text=No+Cover+Available';
        this.classList.remove('loading');
    };
    
    // Set the src after defining events for better loading handling
    coverImg.src = book.coverUrl;
    
    // Create info container
    const infoDiv = document.createElement('div');
    infoDiv.className = 'book-info';
    
    // Title
    const title = document.createElement('h3');
    title.className = 'book-title';
    title.textContent = book.title;
    title.setAttribute('itemprop', 'name');
    
    // Author
    const author = document.createElement('p');
    author.className = 'book-author';
    author.textContent = book.author;
    author.setAttribute('itemprop', 'author');
    
    // Description
    const description = document.createElement('p');
    description.className = 'book-description';
    description.textContent = book.description;
    description.setAttribute('itemprop', 'description');
    
    // Links
    const linksDiv = document.createElement('div');
    linksDiv.className = 'book-links';
    
    // Add affiliate links if available
    if (book.kindleLink && book.kindleLink.trim() !== '') {
        const kindleLink = document.createElement('a');
        kindleLink.className = 'link-btn';
        kindleLink.href = book.kindleLink;
        kindleLink.target = '_blank';
        kindleLink.rel = 'noopener'; // Security best practice for external links
        kindleLink.textContent = 'Kindle';
        kindleLink.setAttribute('itemprop', 'offers');
        kindleLink.setAttribute('itemscope', '');
        kindleLink.setAttribute('itemtype', 'https://schema.org/Offer');
        
        const linkMetaUrl = document.createElement('meta');
        linkMetaUrl.setAttribute('itemprop', 'url');
        linkMetaUrl.setAttribute('content', book.kindleLink);
        kindleLink.appendChild(linkMetaUrl);
        
        linksDiv.appendChild(kindleLink);
    }
    
    if (book.hardcoverLink && book.hardcoverLink.trim() !== '') {
        const hardcoverLink = document.createElement('a');
        hardcoverLink.className = 'link-btn';
        hardcoverLink.href = book.hardcoverLink;
        hardcoverLink.target = '_blank';
        hardcoverLink.rel = 'noopener';
        hardcoverLink.textContent = 'Hardcover';
        hardcoverLink.setAttribute('itemprop', 'offers');
        hardcoverLink.setAttribute('itemscope', '');
        hardcoverLink.setAttribute('itemtype', 'https://schema.org/Offer');
        
        const linkMetaUrl = document.createElement('meta');
        linkMetaUrl.setAttribute('itemprop', 'url');
        linkMetaUrl.setAttribute('content', book.hardcoverLink);
        hardcoverLink.appendChild(linkMetaUrl);
        
        linksDiv.appendChild(hardcoverLink);
    }
    
    if (book.paperbackLink && book.paperbackLink.trim() !== '') {
        const paperbackLink = document.createElement('a');
        paperbackLink.className = 'link-btn';
        paperbackLink.href = book.paperbackLink;
        paperbackLink.target = '_blank';
        paperbackLink.rel = 'noopener';
        paperbackLink.textContent = 'Paperback';
        paperbackLink.setAttribute('itemprop', 'offers');
        paperbackLink.setAttribute('itemscope', '');
        paperbackLink.setAttribute('itemtype', 'https://schema.org/Offer');
        
        const linkMetaUrl = document.createElement('meta');
        linkMetaUrl.setAttribute('itemprop', 'url');
        linkMetaUrl.setAttribute('content', book.paperbackLink);
        paperbackLink.appendChild(linkMetaUrl);
        
        linksDiv.appendChild(paperbackLink);
    }
    
    // Actions (only visible to admin)
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'book-actions';
    // Set initial display style based on admin status
    actionsDiv.style.display = isAdminMode ? 'flex' : 'none';
    
    // Edit button
    const editBtn = document.createElement('button');
    editBtn.className = 'action-btn edit-btn';
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editBtn.title = 'Edit Book';
    editBtn.setAttribute('aria-label', `Edit ${book.title}`);
    editBtn.addEventListener('click', () => {
        if (isAdminMode) {
            openModal(book.id);
        } else {
            alert('You must be an admin to edit books.');
        }
    });
    
    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'action-btn delete-btn';
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteBtn.title = 'Delete Book';
    deleteBtn.setAttribute('aria-label', `Delete ${book.title}`);
    deleteBtn.addEventListener('click', () => {
        if (isAdminMode) {
            currentBookId = book.id;
            deleteModal.style.display = 'block';
        } else {
            alert('You must be an admin to delete books.');
        }
    });
    
    // Append all elements
    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);
    
    infoDiv.appendChild(title);
    infoDiv.appendChild(author);
    infoDiv.appendChild(description);
    infoDiv.appendChild(linksDiv);
    infoDiv.appendChild(actionsDiv);
    
    card.appendChild(coverImg);
    card.appendChild(infoDiv);
    
    // Add mouseleave event to reset card transform
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateY(0) translateZ(0)';
    });
    
    // Add touch feedback for mobile devices
    if (isMobileDevice) {
        card.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        }, false);
        
        card.addEventListener('touchend', function() {
            this.classList.remove('touch-active');
            // Small delay to ensure the visual feedback is seen
            setTimeout(() => {
                this.classList.remove('touch-active');
            }, 100);
        }, false);
    }
    
    return card;
}

// Create 3D book showcase
function create3DBookShowcase() {
    // Get all books and select up to 3 for the showcase
    const allBooks = DataManager.getBooks();
    
    // Clear the showcase
    bookShowcase.innerHTML = '';
    
    // Choose up to 3 books for the showcase
    const showcaseBooks = allBooks.slice(0, Math.min(3, allBooks.length));
    
    // Adapt number of books for small screens
    const isMobile = window.innerWidth <= 768 || window.matchMedia('(max-aspect-ratio: 9/16)').matches;
    const displayCount = isMobile ? Math.min(2, showcaseBooks.length) : showcaseBooks.length;
    
    if (isMobile && displayCount > 0) {
        // Add swipe hint for mobile users
        const swipeHint = document.createElement('div');
        swipeHint.className = 'swipe-hint';
        swipeHint.textContent = 'Swipe to view more books';
        swipeHint.setAttribute('aria-hidden', 'true'); // Not necessary for screen readers
        bookShowcase.appendChild(swipeHint);
        
        // Auto-hide the hint after 3 seconds
        setTimeout(() => {
            swipeHint.style.opacity = '0';
            setTimeout(() => {
                swipeHint.remove();
            }, 500); // Remove after fade out
        }, 3000);
    }
    
    showcaseBooks.slice(0, displayCount).forEach(book => {
        const book3D = document.createElement('div');
        book3D.className = 'book-3d';
        
        // Front cover
        const frontSide = document.createElement('div');
        frontSide.className = 'book-side book-front loading'; // Add loading class
        frontSide.setAttribute('aria-label', `Cover of ${book.title}`);
        
        // Create a temporary image to load the cover
        const tempImg = new Image();
        tempImg.onload = function() {
            frontSide.style.backgroundImage = `url('${book.coverUrl}')`;
            frontSide.classList.remove('loading');
        };
        tempImg.onerror = function() {
            frontSide.style.backgroundImage = "url('https://via.placeholder.com/200x280?text=No+Cover')";
            frontSide.classList.remove('loading');
        };
        tempImg.src = book.coverUrl;
        
        // Back cover with description
        const backSide = document.createElement('div');
        backSide.className = 'book-side book-back';
        backSide.textContent = book.description;
        
        // Spine with title
        const spineSide = document.createElement('div');
        spineSide.className = 'book-side book-spine';
        const spineText = document.createElement('span');
        spineText.textContent = book.title;
        spineSide.appendChild(spineText);
        
        // Top and bottom sides
        const topSide = document.createElement('div');
        topSide.className = 'book-side book-top';
        
        const bottomSide = document.createElement('div');
        bottomSide.className = 'book-side book-bottom';
        
        // Add all sides to the 3D book
        book3D.appendChild(frontSide);
        book3D.appendChild(backSide);
        book3D.appendChild(spineSide);
        book3D.appendChild(topSide);
        book3D.appendChild(bottomSide);
        
        // Add click/touch handler to go to book details
        const navigateToBook = () => {
            // Scroll to the book in the grid
            const bookCards = document.querySelectorAll('.book-card');
            
            bookCards.forEach(card => {
                const title = card.querySelector('.book-title');
                if (title && title.textContent === book.title) {
                    // Use smooth scroll with fallback for Safari
                    if ('scrollBehavior' in document.documentElement.style) {
                        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    } else {
                        // Fallback for browsers that don't support smooth scrolling
                        const cardTop = card.getBoundingClientRect().top + window.pageYOffset;
                        window.scrollTo({
                            top: cardTop - window.innerHeight / 2,
                            left: 0
                        });
                    }
                    
                    // Highlight the card briefly
                    card.style.boxShadow = '0 0 20px rgba(74, 111, 165, 0.9)';
                    setTimeout(() => {
                        card.style.boxShadow = '';
                    }, 2000);
                }
            });
        };
        
        book3D.addEventListener('click', navigateToBook);
        
        // Add special touch effects for mobile
        if (isMobileDevice) {
            // Add touch feedback
            book3D.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            }, false);
            
            book3D.addEventListener('touchend', function() {
                this.classList.remove('touch-active');
                setTimeout(() => {
                    navigateToBook();
                }, 100); // Slight delay to ensure visual feedback
            }, false);
        }
        
        // Add keyboard accessibility
        book3D.tabIndex = 0;
        book3D.setAttribute('role', 'button');
        book3D.setAttribute('aria-label', `View ${book.title} details`);
        book3D.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                book3D.click();
            }
        });
        
        bookShowcase.appendChild(book3D);
    });
    
    // If no books, display a placeholder book
    if (showcaseBooks.length === 0) {
        const placeholderBook = document.createElement('div');
        placeholderBook.className = 'book-3d';
        
        // Front cover
        const frontSide = document.createElement('div');
        frontSide.className = 'book-side book-front';
        frontSide.style.backgroundImage = "url('https://via.placeholder.com/200x280?text=No+Books+Available')";
        
        // Back cover with description
        const backSide = document.createElement('div');
        backSide.className = 'book-side book-back';
        
        // Different messages based on admin status
        if (isAdminMode) {
            backSide.textContent = "Add your first book to see it showcased here in 3D! Click the 'Add New Book' button to get started.";
            frontSide.style.backgroundImage = "url('https://via.placeholder.com/200x280?text=Add+Your+Books')";
        } else {
            backSide.textContent = "No books are currently available in the library. Check back later!";
        }
        
        // Spine with title
        const spineSide = document.createElement('div');
        spineSide.className = 'book-side book-spine';
        const spineText = document.createElement('span');
        spineText.textContent = isAdminMode ? "Add Your Books" : "No Books Available";
        spineSide.appendChild(spineText);
        
        // Top and bottom sides
        const topSide = document.createElement('div');
        topSide.className = 'book-side book-top';
        
        const bottomSide = document.createElement('div');
        bottomSide.className = 'book-side book-bottom';
        
        // Add all sides to the 3D book
        placeholderBook.appendChild(frontSide);
        placeholderBook.appendChild(backSide);
        placeholderBook.appendChild(spineSide);
        placeholderBook.appendChild(topSide);
        placeholderBook.appendChild(bottomSide);
        
        // Make the placeholder clickable to add a new book (admin only)
        if (isAdminMode) {
            placeholderBook.addEventListener('click', () => {
                addBookBtn.click();
            });
            
            placeholderBook.tabIndex = 0;
            placeholderBook.setAttribute('role', 'button');
            placeholderBook.setAttribute('aria-label', 'Add your first book');
            placeholderBook.style.cursor = 'pointer';
        }
        
        bookShowcase.appendChild(placeholderBook);
    }
    
    // Add window resize listener to update showcase
    window.addEventListener('resize', debounce(() => {
        const currentIsMobile = window.innerWidth <= 768 || window.matchMedia('(max-aspect-ratio: 9/16)').matches;
        if (isMobile !== currentIsMobile) {
            isMobileDevice = currentIsMobile;
            create3DBookShowcase();
        }
    }, 250));
}

// Debounce function to limit resize events
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

// Generate structured data for SEO
function generateStructuredData() {
    const books = DataManager.getBooks();
    if (books.length === 0) return;
    
    // Generate book structured data
    const bookListJson = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": []
    };
    
    // Add up to 10 books for the structured data (to keep it reasonable)
    const maxBooks = Math.min(books.length, 10);
    for (let i = 0; i < maxBooks; i++) {
        const book = books[i];
        bookListJson.itemListElement.push({
            "@type": "ListItem",
            "position": i + 1,
            "item": {
                "@type": "Book",
                "name": book.title,
                "author": {
                    "@type": "Person",
                    "name": book.author
                },
                "description": book.description,
                "url": `https://yourdomain.com/#book-${book.id}`,
                "image": book.coverUrl,
                "offers": generateOffersStructuredData(book)
            }
        });
    }
    
    // Find or create a script element for the book list
    let scriptElement = document.getElementById('book-structured-data');
    if (!scriptElement) {
        scriptElement = document.createElement('script');
        scriptElement.id = 'book-structured-data';
        scriptElement.type = 'application/ld+json';
        document.head.appendChild(scriptElement);
    }
    
    // Update the script content
    scriptElement.textContent = JSON.stringify(bookListJson);
    
    // Create structured data for the showcase (featured books)
    updateFeaturedBooksStructuredData();
}

// Generate structured data for book offers (purchase options)
function generateOffersStructuredData(book) {
    const offers = [];
    
    if (book.kindleLink && book.kindleLink.trim() !== '') {
        offers.push({
            "@type": "Offer",
            "name": "Kindle Edition",
            "url": book.kindleLink,
            "availability": "https://schema.org/InStock"
        });
    }
    
    if (book.hardcoverLink && book.hardcoverLink.trim() !== '') {
        offers.push({
            "@type": "Offer",
            "name": "Hardcover",
            "url": book.hardcoverLink,
            "availability": "https://schema.org/InStock"
        });
    }
    
    if (book.paperbackLink && book.paperbackLink.trim() !== '') {
        offers.push({
            "@type": "Offer",
            "name": "Paperback",
            "url": book.paperbackLink,
            "availability": "https://schema.org/InStock"
        });
    }
    
    return offers;
}

// Update structured data for featured books in the showcase
function updateFeaturedBooksStructuredData() {
    const showcaseBooks = DataManager.getBooks().slice(0, 3); // Get up to 3 books for the showcase
    if (showcaseBooks.length === 0) return;
    
    // Find the existing ItemList structured data script
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    let featuredScript = null;
    
    for (const script of scripts) {
        try {
            const data = JSON.parse(script.textContent);
            if (data["@type"] === "ItemList" && 
                data.itemListElement && 
                data.itemListElement.length === 3 &&
                data.itemListElement[0].name === "Featured Book 1") {
                featuredScript = script;
                break;
            }
        } catch (e) {
            // Skip invalid JSON
            continue;
        }
    }
    
    if (!featuredScript) return;
    
    const featuredData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": []
    };
    
    for (let i = 0; i < showcaseBooks.length; i++) {
        const book = showcaseBooks[i];
        featuredData.itemListElement.push({
            "@type": "ListItem",
            "position": i + 1,
            "url": `https://yourdomain.com/#book-${book.id}`,
            "name": book.title
        });
    }
    
    // Fill remaining slots if we have fewer than 3 books
    for (let i = showcaseBooks.length; i < 3; i++) {
        featuredData.itemListElement.push({
            "@type": "ListItem",
            "position": i + 1,
            "url": "https://yourdomain.com/#",
            "name": `Featured Book ${i + 1}`
        });
    }
    
    featuredScript.textContent = JSON.stringify(featuredData);
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init); 