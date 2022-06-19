// Custom event
const ADD_NEW_BOOK            = 'ADD_NEW_BOOK'
const SET_BOOK_COMPLETED      = 'SET_BOOK_COMPLETED'
const SET_BOOK_UNCOMPLETE     = 'SET_BOOK_UNCOMPLETE'
const RENDER_UNCOMPLETE_BOOK  = 'RENDER_UNCOMPLETE_BOOK'
const RENDER_COMPLETED_BOOK   = 'RENDER_COMPLETED_BOOK'
const BOOK_CHANGED            = 'BOOK_CHANGED'
// 

// DOM Target
let form            = document.getElementById('add-buku')
let tableUncomplete = document.getElementById('book-onread')
let tableComplete   = document.getElementById('book-read')
// 

// List of books
let books = [
]
// 

// Global functions
function toggleComplete(id) {
  books.map(book=> {
    if(book.id === id) {
      book.isCompleted = !book.isCompleted
    }
  })

  window.dispatchEvent(new Event(BOOK_CHANGED))
  renderBook()
}

function deleteBook(id) {
  books = books.filter(book=> book.id !== id)

  window.dispatchEvent(new Event(BOOK_CHANGED))
  renderBook()
}

function checkStorage() {
  return typeof Storage !== 'undefined'
}

function clearForm() {
  document.getElementById('nama-buku').value      = ''
  document.getElementById('penerbit-buku').value  = ''
  document.getElementById('tahun-buku').value     = ''
}

function generateId() {
  return Math.random().toString(16).slice(2)
}

function renderBook() {
  tableUncomplete.dispatchEvent(new Event(RENDER_UNCOMPLETE_BOOK))
  tableComplete.dispatchEvent(new Event(RENDER_COMPLETED_BOOK))
}
// 

window.addEventListener('DOMContentLoaded', ()=> {
  if(!checkStorage()) {
    alert('browser tidak mendukung web storage')
  } else {
    const parsedBooks = JSON.parse(localStorage.getItem('books'))
    if(!parsedBooks) {
      books = []
    } else {
      books = parsedBooks
    }
  }
})

window.onload = function() {
  form            = document.getElementById('add-buku')
  tableUncomplete = document.getElementById('book-onread')
  tableComplete   = document.getElementById('book-read')

  form.addEventListener('submit', (e)=> {
    e.preventDefault()
    form.dispatchEvent(new Event(ADD_NEW_BOOK))
    window.dispatchEvent(new Event(BOOK_CHANGED))
    clearForm()
    renderBook()
  })
  
  form.addEventListener(ADD_NEW_BOOK, ()=> {
    const inputNama     = document.getElementById('nama-buku').value
    const inputPenerbit = document.getElementById('penerbit-buku').value
    const inputTahun    = document.getElementById('tahun-buku').value

    const newBook = {
      id: generateId(),
      nama: inputNama,
      penerbit: inputPenerbit,
      tahun: inputTahun,
      isCompleted: false, // set not complete as default
    }
    
    books.unshift(newBook)
  })

  tableUncomplete.addEventListener(RENDER_UNCOMPLETE_BOOK, (e)=> {
    const uncompleteBook = books.filter(book=> book.isCompleted === false)
    let trBook = ''
    
    if(uncompleteBook.length > 0) {

      uncompleteBook.map((book, key)=> {
        trBook += '<tr>'
        trBook += `<th>${key+1}</th>`
        trBook += `<th>${book.nama}</th>`
        trBook += `<th>${book.penerbit}</th>`
        trBook += `<th>${book.tahun}</th>`
        trBook += '<th>'
        trBook += `<button class="btn btn-success" onClick="toggleComplete('${book.id}')">Sudah dibaca</button>`
        trBook += ' | '
        trBook += `<button class="btn btn-error" onClick="deleteBook('${book.id}')">Hapus Buku</button>`
        trBook += '</th>'
        trBook += '</tr>'
      })
    }  

    e.target.querySelector('tbody').innerHTML = trBook
  })

  tableComplete.addEventListener(RENDER_COMPLETED_BOOK, (e)=> {
    const completedBook = books.filter(book=> book.isCompleted === true)
    let trBook = ''
    
    if(completedBook.length > 0) {
      completedBook.map((book, key)=> {
        trBook += '<tr>'
        trBook += `<th>${key+1}</th>`
        trBook += `<th>${book.nama}</th>`
        trBook += `<th>${book.penerbit}</th>`
        trBook += `<th>${book.tahun}</th>`
        trBook += '<th>'
        trBook += `<button class="btn btn-warning" onClick="toggleComplete('${book.id}')">Belum dibaca</button>`
        trBook += ' | '
        trBook += `<button class="btn btn-error" onClick="deleteBook('${book.id}')">Hapus Buku</button>`
        trBook += '</th>'
        trBook += '</tr>'
      })
    }  

    e.target.querySelector('tbody').innerHTML = trBook
  })

  renderBook()
}

window.addEventListener(BOOK_CHANGED, ()=> {
  if (checkStorage) {
    const jsonBooks = JSON.stringify(books)
    localStorage.setItem('books', jsonBooks)
  }
})