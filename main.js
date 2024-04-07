const rakBuku = [];
const RENDER_EVENT = 'render-buku';

function generatedId() {
  return +new Date();
}

function generatedBuku(id, title, author, year, isComplete) {
  year = Number(year);
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('inputBook');
  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    tambahBukuKeRak();
    submitForm.reset();
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }

  const searchInput = document.getElementById('searchBook');
  searchInput.addEventListener('submit', function (event) {
    event.preventDefault();
    const rak = document.getElementById('rak');
    rak.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const titleSearchInput = document.getElementById('searchBookTitle');

    let query = document.querySelectorAll('.book_item');

    for (const searchBook of query) {
      if (searchBook.childNodes[0].innerText.includes(titleSearchInput.value)) {
        searchBook.style.display = '';
      } else {
        searchBook.style.display = 'none';
      }
    }
  });
});

function tambahBukuKeRak() {
  const judulBuku = document.getElementById('inputBookTitle').value;
  const tahunBuku = document.getElementById('inputBookYear').value;
  const penulisBuku = document.getElementById('inputBookAuthor').value;
  const isComplete = document.getElementById('inputBookIsComplete').checked;

  const Id = generatedId();
  const bukuObjek = generatedBuku(
    Id,
    judulBuku,
    penulisBuku,
    tahunBuku,
    isComplete,
  );

  rakBuku.push(bukuObjek);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();

  judulBuku.value = '';
  tahunBuku.value = '';
  penulisBuku.value = '';
}

document.addEventListener(RENDER_EVENT, function () {
  const completeBookShelf = document.getElementById('completeBookshelfList');

  const incompleteBookShelf = document.getElementById(
    'incompleteBookshelfList',
  );

  // clearing list item
  completeBookShelf.innerHTML = '';
  incompleteBookShelf.innerHTML = '';

  for (const buku of rakBuku) {
    const book = tambahCompletedBook(buku);
    if (buku.isComplete) {
      completeBookShelf.append(book);
    } else {
      incompleteBookShelf.append(book);
    }
  }
});

function tambahCompletedBook(bukuObjek) {
  const bookTitle = document.createElement('h3');
  bookTitle.classList.add('book_title');
  bookTitle.innerText = bukuObjek.title;

  const bookAuthor = document.createElement('p');
  bookAuthor.innerText = 'Penulis: ' + bukuObjek.author;

  const bookYear = document.createElement('p');
  bookYear.innerText = 'Tahun: ' + bukuObjek.year;

  const container = document.createElement('article');
  container.classList.add('book_item');
  container.append(bookTitle, bookAuthor, bookYear);

  const switchButton = document.createElement('button');
  switchButton.classList.add('green');

  if (bukuObjek.isComplete) {
    switchButton.innerHTML = `<span class="vertical-middle"></span>&nbsp;<span class="material-symbols-outlined vertical-middle">replay</span>`;
  } else {
    switchButton.innerHTML = `<span class="vertical-middle"></span>&nbsp;<span class="material-symbols-outlined vertical-middle">done</span>`;
  }

  switchButton.addEventListener('click', function () {
    switchCompleted(bukuObjek.id);
  });

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('red');
  deleteButton.innerHTML = `<span class="vertical-middle"></span>&nbsp;<span class="material-symbols-outlined vertical-middle">delete
</span>`;

  deleteButton.addEventListener('click', function () {
    deleteBook(bukuObjek.id);
  });

  const actionContainer = document.createElement('div');
  actionContainer.classList.add('action');
  actionContainer.append(switchButton, deleteButton);

  container.append(actionContainer);

  return container;
}

function switchCompleted(bookId) {
  const book = findBook(bookId);

  if (book == null) return;

  book.isComplete = !book.isComplete;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(bookId) {
  for (const book of rakBuku) {
    if (book.id == bookId) {
      return book;
    }
  }

  return null;
}

function deleteBook(bookId) {
  const bookIndex = findBookIndex(bookId);

  if (bookIndex === -1) return;

  rakBuku.splice(bookIndex, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookIndex(bookId) {
  for (const index in rakBuku) {
    if (rakBuku[index].id == bookId) {
      return index;
    }
  }

  return -1;
}

const STORAGE_KEY = 'BOOKSHELF_APPS';

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(rakBuku);

    localStorage.setItem(STORAGE_KEY, parsed);
  }
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert('Browser tidak mendukung local storage');
    return false;
  }
  return true;
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);

  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      rakBuku.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}
