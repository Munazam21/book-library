# Book Affiliate Library

A clean, responsive book library website that allows you to manage and display your book collection with affiliate links for Kindle, hardcover, and paperback versions. Features beautiful 3D book effects!

## Features

- **3D Book Effects**: Interactive 3D book cards and a stunning 3D book showcase
- **Mobile-Friendly Design**: Works great on all devices from desktops to smartphones
- **Book Management**: Easily add, edit, and delete books
- **Cover Images**: Display beautiful book covers
- **Affiliate Links**: Separate links for Kindle, hardcover, and paperback formats
- **Search Functionality**: Find books quickly with the search feature
- **Format Filtering**: Filter books based on available formats (Kindle, Hardcover, Paperback)
- **Local Storage**: Your book data is saved in your browser's local storage

## 3D Book Features

- **Interactive Book Cards**: Books tilt and rotate in response to mouse movement
- **Book Spine Effect**: Realistic 3D book spines with colorful gradients
- **Featured Books Showcase**: A 3D bookshelf showing your top books with full 3D rendering
- **Full 3D Modeling**: Books are created with front, back, spine, top, and bottom sides
- **Smooth Animations**: All interactions use smooth CSS transitions

## How to Use

1. **Open the website**: Simply open the `index.html` file in your web browser.

2. **Interact with the 3D books**:
   - Move your mouse over book cards to see them tilt in response
   - Hover over books in the showcase to see them rotate
   - Click a showcased book to jump to its details in the book grid

3. **Add a new book**:
   - Click the "Add New Book" button in the header
   - Fill in the book details:
     - Title (required)
     - Author (required)
     - Description (required)
     - Cover Image URL (required)
     - Kindle Affiliate Link (optional)
     - Hardcover Affiliate Link (optional)
     - Paperback Affiliate Link (optional)
   - Click "Save Book"

4. **Edit a book**:
   - Find the book you want to edit
   - Click the edit icon (pencil) in the bottom right of the book card
   - Update the details
   - Click "Save Book"

5. **Delete a book**:
   - Find the book you want to delete
   - Click the delete icon (trash) in the bottom right of the book card
   - Confirm deletion in the popup dialog

6. **Search for books**:
   - Type your search query in the search box in the header
   - Press Enter or click the search icon
   - Books matching the title, author, or description will be displayed

7. **Filter books by format**:
   - Use the dropdown menu at the top of the book list
   - Select "All Books", "Kindle Available", "Hardcover Available", or "Paperback Available"

## Getting Started with Book Covers

For the best experience, use direct links to book cover images. You can find these from:

1. Amazon product pages (right-click on book cover and select "Copy Image Address")
2. Publisher websites
3. Book cover databases
4. Your own uploaded images on image hosting services

## Customization

You can customize the look and feel by editing the `styles.css` file:

- Change the color scheme by modifying the CSS variables at the top
- Adjust the 3D effect intensity with the `--card-rotate-amount` variable
- Change the book thickness with the `--book-thickness` variable
- Modify the grid layout for different sized cards
- Customize the book spine colors by editing the gradient colors

## Technical Details

This project uses:
- HTML5 for structure
- CSS3 for styling (with advanced 3D transforms)
- Vanilla JavaScript for functionality
- Local Storage API for data persistence
- Font Awesome for icons

No server setup or database is required - everything runs in the browser!

## Backup Your Data

Since the data is stored in your browser's local storage, it's recommended to:

1. Export your book data periodically (You can copy the JSON data from localStorage)
2. If you clear your browser data, you'll lose your books unless you've made a backup

Enjoy your new 3D book affiliate library! 