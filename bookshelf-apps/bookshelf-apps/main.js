document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      addBook();
    });
  
    const searchForm = document.getElementById('searchBook');
    searchForm.addEventListener('submit', function (event) {
      event.preventDefault();
      searchBook();
    });
  
    if (isStorageExist()) {
      loadDataFromStorage();
    }
  });
  
  let books = [];
  const RENDER_EVENT = 'render-book';
  
  document.addEventListener(RENDER_EVENT, function () {
    renderBooks();
  });
  
  function addBook() {
    const title = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const year = parseInt(document.getElementById('inputBookYear').value);
    const isComplete = document.getElementById('inputBookIsComplete').checked;
  
    const id = generateId();
    const book = generateBookObject(id, title, author, year, isComplete);
    books.push(book);
  
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    document.getElementById('inputBook').reset();
  
    const submitButton = document.getElementById('bookSubmit');
    submitButton.textContent = 'Masukkan Buku ke rak';
  }
  
  function generateId() {
    return +new Date();
  }
  
  function generateBookObject(id, title, author, year, isComplete) {
    return {
      id,
      title,
      author,
      year,
      isComplete
    };
  }
  
  function makeBookElement(book) {
    const bookElement = document.createElement('article');
    bookElement.classList.add('book_item');
    bookElement.id = `book-${book.id}`;
  
    const bookTitle = document.createElement('h3');
    bookTitle.textContent = book.title;
  
    const bookAuthor = document.createElement('p');
    bookAuthor.textContent = `Penulis: ${book.author}`;
  
    const bookYear = document.createElement('p');
    bookYear.textContent = `Tahun: ${book.year}`;
  
    const actionDiv = document.createElement('div');
    actionDiv.classList.add('action');
  
    const actionButton = document.createElement('button');
    actionButton.textContent = book.isComplete ? 'Belum selesai di Baca' : 'Selesai dibaca';
    actionButton.classList.add(book.isComplete ? 'green' : 'green');
    actionButton.addEventListener('click', function () {
      toggleBookStatus(book);
    });
  
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Hapus buku';
    deleteButton.classList.add('red');
    deleteButton.addEventListener('click', function () {
      confirmDeleteBook(book);
    });
  
    actionDiv.appendChild(actionButton);
    actionDiv.appendChild(deleteButton);
  
    bookElement.appendChild(bookTitle);
    bookElement.appendChild(bookAuthor);
    bookElement.appendChild(bookYear);
    bookElement.appendChild(actionDiv);
  
    return bookElement;
  }
  
  function toggleBookStatus(book) {
    book.isComplete = !book.isComplete;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
  
  function deleteBook(book) {
    const index = books.findIndex(b => b.id === book.id);
    if (index !== -1) {
      books.splice(index, 1);
      saveData();
      renderBooks();
    }
  }
  
  function saveData() {
    if (isStorageExist()) {
      localStorage.setItem('books', JSON.stringify(books));
    }
  }
  
  function isStorageExist() {
    return typeof Storage !== 'undefined';
  }
  
  function renderBooks() {
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    const completeBookshelfList = document.getElementById('completeBookshelfList');
  
    incompleteBookshelfList.innerHTML = '';
    completeBookshelfList.innerHTML = '';
  
    for (const book of books) {
      const bookElement = makeBookElement(book);
      if (book.isComplete) {
        completeBookshelfList.appendChild(bookElement);
      } else {
        incompleteBookshelfList.appendChild(bookElement);
      }
    }
  }
  
  function loadDataFromStorage() {
    const serializedData = localStorage.getItem('books');
    if (serializedData !== null) {
      const data = JSON.parse(serializedData);
      books = data;
      renderBooks();
    }
  }
  
  function searchBook() {
    const searchQuery = document.getElementById('searchBookTitle').value.toLowerCase();
    const bookItems = document.querySelectorAll('.book_item');
  
    bookItems.forEach(function(bookItem) {
      const title = bookItem.querySelector('h3').textContent.toLowerCase();
      if (title.includes(searchQuery)) {
        bookItem.style.display = 'block';
      } else {
        bookItem.style.display = 'none';
      }
    });
  }
  
  function confirmDeleteBook(book) {
    const isConfirmed = confirm(`Apakah Anda yakin ingin menghapus buku "${book.title}"?`);
    if (isConfirmed) {
      deleteBook(book);
    }
  }