// 初始化图书数据
let books = JSON.parse(localStorage.getItem('books')) || [
    {
        id: 1,
        title: 'Java编程思想',
        author: 'Bruce Eckel',
        isbn: '978-7-111-21352-8',
        category: '计算机',
        available: true,
        description: 'Java编程的经典著作'
    },
    {
        id: 2,
        title: '三体',
        author: '刘慈欣',
        isbn: '978-7-5366-9293-0',
        category: '科学',
        available: true,
        description: '中国科幻文学代表作'
    },
    {
        id: 3,
        title: '红楼梦',
        author: '曹雪芹',
        isbn: '978-7-02-000220-7',
        category: '文学',
        available: true,
        description: '中国古典四大名著之一'
    }
];

// 保存图书数据到localStorage
function saveBooks() {
    localStorage.setItem('books', JSON.stringify(books));
}

// 显示加载动画
function showLoading() {
    document.getElementById('loading').style.display = 'flex';
}

// 隐藏加载动画
function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

// 显示图书列表
function showBookList() {
    showLoading();
    setTimeout(() => {
        document.getElementById('bookList').style.display = 'block';
        document.getElementById('addBookForm').style.display = 'none';
        document.getElementById('bookDetail').style.display = 'none';
        displayBooks(books);
        hideLoading();
    }, 500);
}

// 显示添加图书表单
function showAddBookForm() {
    document.getElementById('bookList').style.display = 'none';
    document.getElementById('addBookForm').style.display = 'block';
    document.getElementById('bookDetail').style.display = 'none';
    document.getElementById('bookForm').reset();
}

// 显示图书详情
function showBookDetail(id) {
    showLoading();
    setTimeout(() => {
        const book = books.find(b => b.id === id);
        if (book) {
            document.getElementById('detailTitle').textContent = book.title;
            document.getElementById('detailAuthor').textContent = book.author;
            document.getElementById('detailIsbn').textContent = book.isbn;
            document.getElementById('detailCategory').textContent = book.category;
            document.getElementById('detailStatus').textContent = book.available ? '可借阅' : '已借出';
            document.getElementById('detailDescription').textContent = book.description;
            
            document.getElementById('bookList').style.display = 'none';
            document.getElementById('addBookForm').style.display = 'none';
            document.getElementById('bookDetail').style.display = 'block';
        }
        hideLoading();
    }, 500);
}

// 显示编辑表单
function showEditForm() {
    const book = books.find(b => b.id === currentBookId);
    if (book) {
        document.getElementById('title').value = book.title;
        document.getElementById('author').value = book.author;
        document.getElementById('isbn').value = book.isbn;
        document.getElementById('category').value = book.category;
        document.getElementById('description').value = book.description;
        
        document.getElementById('bookList').style.display = 'none';
        document.getElementById('addBookForm').style.display = 'block';
        document.getElementById('bookDetail').style.display = 'none';
    }
}

// 删除图书
function deleteBook(id) {
    if (confirm('确定要删除这本书吗？')) {
        showLoading();
        setTimeout(() => {
            books = books.filter(book => book.id !== id);
            saveBooks();
            showBookList();
            hideLoading();
        }, 500);
    }
}

// 处理表单提交
document.getElementById('bookForm').addEventListener('submit', function(e) {
    e.preventDefault();
    showLoading();
    
    setTimeout(() => {
        const bookData = {
            id: currentBookId || books.length + 1,
            title: document.getElementById('title').value,
            author: document.getElementById('author').value,
            isbn: document.getElementById('isbn').value,
            category: document.getElementById('category').value,
            available: true,
            description: document.getElementById('description').value
        };

        if (currentBookId) {
            // 更新现有图书
            const index = books.findIndex(b => b.id === currentBookId);
            if (index !== -1) {
                books[index] = { ...books[index], ...bookData };
            }
        } else {
            // 添加新图书
            books.push(bookData);
        }

        saveBooks();
        currentBookId = null;
        showBookList();
        hideLoading();
    }, 500);
});

// 搜索图书
function searchBooks() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredBooks = books.filter(book => 
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        book.isbn.toLowerCase().includes(searchTerm) ||
        book.description.toLowerCase().includes(searchTerm)
    );
    displayBooks(filteredBooks);
}

// 按分类筛选
function filterByCategory() {
    const category = document.getElementById('categoryFilter').value;
    const filteredBooks = category ? 
        books.filter(book => book.category === category) : 
        books;
    displayBooks(filteredBooks);
}

// 导出数据
function exportData() {
    const dataStr = JSON.stringify(books, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'library-data.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// 导入数据
function importData() {
    const importModal = new bootstrap.Modal(document.getElementById('importModal'));
    importModal.show();
}

// 处理导入
function handleImport() {
    const fileInput = document.getElementById('importFile');
    const file = fileInput.files[0];
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedBooks = JSON.parse(e.target.result);
                if (Array.isArray(importedBooks)) {
                    books = importedBooks;
                    saveBooks();
                    showBookList();
                    bootstrap.Modal.getInstance(document.getElementById('importModal')).hide();
                } else {
                    alert('导入的数据格式不正确');
                }
            } catch (error) {
                alert('导入失败：' + error.message);
            }
        };
        reader.readAsText(file);
    }
}

// 显示图书列表
function displayBooks(booksToDisplay) {
    const bookListContent = document.getElementById('bookListContent');
    bookListContent.innerHTML = '';
    
    booksToDisplay.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'col-md-4 mb-4';
        bookCard.innerHTML = `
            <div class="card book-card">
                <div class="card-body">
                    <h5 class="card-title">${book.title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${book.author}</h6>
                    <p class="card-text">
                        <span class="badge bg-primary category-badge">${book.category}</span>
                        <span class="badge ${book.available ? 'bg-success' : 'bg-danger'}">${book.available ? '可借阅' : '已借出'}</span>
                    </p>
                    <button class="btn btn-primary btn-sm" onclick="showBookDetail(${book.id})">查看详情</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteBook(${book.id})">删除</button>
                </div>
            </div>
        `;
        bookListContent.appendChild(bookCard);
    });
}

// 初始化显示
let currentBookId = null;
showBookList(); 