// 初始化图书数据
let books = JSON.parse(localStorage.getItem('books')) || [
    {
        id: 1,
        title: 'Java编程思想',
        author: 'Bruce Eckel',
        isbn: '978-7-111-21352-8',
        category: '计算机',
        available: true,
        borrower: null,
        description: 'Java编程的经典著作'
    },
    {
        id: 2,
        title: '三体',
        author: '刘慈欣',
        isbn: '978-7-5366-9293-0',
        category: '科学',
        available: true,
        borrower: null,
        description: '中国科幻文学代表作'
    },
    {
        id: 3,
        title: '红楼梦',
        author: '曹雪芹',
        isbn: '978-7-02-000220-7',
        category: '文学',
        available: true,
        borrower: null,
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
            // 显示借阅人
            let borrowerHtml = '';
            if (!book.available && book.borrower) {
                borrowerHtml = `（借阅人：${book.borrower}）`;
            }
            document.getElementById('detailStatus').textContent += borrowerHtml;

            // 显示借阅历史
            const historyList = document.createElement('ul');
            historyList.className = 'list-group mt-3';
            const bookHistory = getBorrowHistory().filter(h => h.bookId === book.id);
            if (bookHistory.length > 0) {
                const historyTitle = document.createElement('li');
                historyTitle.className = 'list-group-item active';
                historyTitle.textContent = '借阅历史';
                historyList.appendChild(historyTitle);
                bookHistory.forEach(record => {
                    const listItem = document.createElement('li');
                    listItem.className = 'list-group-item';
                    const date = new Date(record.timestamp).toLocaleString();
                    listItem.textContent = `${date} - 用户 ${record.userId} ${record.action === 'borrow' ? '借阅' : '归还'} 了本书`;
                    historyList.appendChild(listItem);
                });
            } else {
                 const historyTitle = document.createElement('li');
                historyTitle.className = 'list-group-item';
                historyTitle.textContent = '暂无借阅历史';
                historyList.appendChild(historyTitle);
            }
            const cardBody = document.querySelector('#bookDetail .card-body');
            // 移除旧的历史列表（如果有）
            const oldHistoryList = cardBody.querySelector('.list-group');
            if (oldHistoryList) {
                cardBody.removeChild(oldHistoryList);
            }
            cardBody.appendChild(historyList);

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

// 导出数据为 Excel
function exportData() {
    // 字段顺序与表头
    const header = [
        '书名', '作者', 'ISBN', '分类', '状态', '借阅人', '描述'
    ];
    const data = books.map(book => [
        book.title,
        book.author,
        book.isbn,
        book.category,
        book.available ? '可借阅' : '已借出',
        book.borrower || '',
        book.description
    ]);
    data.unshift(header);
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '图书数据');
    XLSX.writeFile(wb, 'library-data.xlsx');
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
    if (!file) {
        alert('请选择要导入的 Excel 文件。');
        return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0]; // 读取第一个工作表
            const worksheet = workbook.Sheets[sheetName];
            // 将工作表数据转换为JSON数组
            const importedData = XLSX.utils.sheet_to_json(worksheet);

            // 将导入的数据映射到图书对象结构，并追加到现有数据
            const newBooks = importedData.map(row => ({
                id: books.length + 1 + Math.random(), // 生成唯一ID，简单处理
                title: row['书名'] || '',
                author: row['作者'] || '',
                isbn: row['ISBN'] || '',
                category: row['分类'] || '',
                available: row['状态'] === '可借阅', // 根据状态列判断
                borrower: row['借阅人'] || null,
                description: row['描述'] || '',
            }));

            // 过滤掉ID为空或无效的行，并追加到现有数据
             const validNewBooks = newBooks.filter(book => book.title || book.author || book.isbn);
             books = books.concat(validNewBooks);

            saveBooks();
            showBookList();
            bootstrap.Modal.getInstance(document.getElementById('importModal')).hide();
            alert(`成功导入 ${validNewBooks.length} 条图书数据！`);

        } catch (error) {
            alert('导入失败：' + error.message);
        }
    };
    reader.readAsArrayBuffer(file);
}

// 显示图书列表
function displayBooks(booksToDisplay) {
    const bookListContent = document.getElementById('bookListContent');
    bookListContent.innerHTML = '';
    const user = getCurrentUser();
    booksToDisplay.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'col-md-4 mb-4';
        let statusHtml = `<span class="badge ${book.available ? 'bg-success' : 'bg-danger'}">${book.available ? '可借阅' : '已借出'}</span>`;
        if (!book.available && book.borrower) {
            statusHtml += ` <span class="badge bg-secondary">借阅人：${book.borrower}</span>`;
        }
        let actionBtn = '';
        if (book.available) {
            actionBtn = `<button class="btn btn-primary btn-sm" onclick="borrowBook(${book.id})">借阅</button>`;
        } else if (user && book.borrower === user) {
            actionBtn = `<button class="btn btn-warning btn-sm" onclick="returnBook(${book.id})">归还</button>`;
        }
        bookCard.innerHTML = `
            <div class="card book-card">
                <div class="card-body">
                    <h5 class="card-title">${book.title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${book.author}</h6>
                    <p class="card-text">
                        <span class="badge bg-primary category-badge">${book.category}</span>
                        ${statusHtml}
                    </p>
                    ${actionBtn}
                    <button class="btn btn-info btn-sm" onclick="showBookDetail(${book.id})">查看详情</button>
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

// ========== 用户登录/注册/状态管理 ==========
// 内置管理员账号
function getUsers() {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    // 检查是否存在管理员，不存在则添加
    if (!users.find(u => u.username === 'admin')) {
        users.push({ username: 'admin', password: 'admin', isAdmin: true });
        saveUsers(users);
    }
    return users;
}
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}
function getCurrentUser() {
    return localStorage.getItem('currentUser') || null;
}
function setCurrentUser(username) {
    if (username) {
        localStorage.setItem('currentUser', username);
    } else {
        localStorage.removeItem('currentUser');
    }
}
function isAdmin() {
    const currentUser = getCurrentUser();
    if (!currentUser) return false;
    const users = getUsers();
    const user = users.find(u => u.username === currentUser);
    return user && user.isAdmin;
}
function updateUserStatus() {
    const user = getCurrentUser();
    const userStatus = document.getElementById('userStatus');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const userManageBtn = document.getElementById('userManageBtn');
    if (user) {
        userStatus.textContent = `欢迎，${user}`;
        loginBtn.classList.add('d-none');
        logoutBtn.classList.remove('d-none');
        if (isAdmin()) {
            userManageBtn.classList.remove('d-none');
        } else {
            userManageBtn.classList.add('d-none');
        }
    } else {
        userStatus.textContent = '';
        loginBtn.classList.remove('d-none');
        logoutBtn.classList.add('d-none');
        userManageBtn.classList.add('d-none');
    }
}
function showLoginModal() {
    document.getElementById('loginForm').style.display = '';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginModalLabel').textContent = '登录';
    new bootstrap.Modal(document.getElementById('loginModal')).show();
}
function switchToRegister(e) {
    e.preventDefault();
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = '';
     document.getElementById('loginModalLabel').textContent = '注册';
}
function switchToLogin(e) {
    e.preventDefault();
    document.getElementById('loginForm').style.display = '';
    document.getElementById('registerForm').style.display = 'none';
     document.getElementById('loginModalLabel').textContent = '登录';
}
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        setCurrentUser(username);
        updateUserStatus();
        bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
        alert('登录成功！');
    } else {
        alert('用户名或密码错误');
    }
});
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value.trim();
    const password = document.getElementById('registerPassword').value;
    let users = getUsers();
    if (users.find(u => u.username === username)) {
        alert('用户名已存在');
        return;
    }
    users.push({ username, password, isAdmin: false });
    saveUsers(users);
    setCurrentUser(username);
    updateUserStatus();
    bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
    alert('注册成功，已自动登录！');
});
function logout() {
    setCurrentUser(null);
    updateUserStatus();
    alert('已退出登录');
}
// ========== END 用户登录/注册/状态管理 ==========
// ========== 用户管理功能 ==========
function showUserManageModal() {
    if (!isAdmin()) {
        alert('只有管理员才能访问用户管理！');
        return;
    }
    updateUserManageTable();
    new bootstrap.Modal(document.getElementById('userManageModal')).show();
}
function updateUserManageTable() {
    const userManageTable = document.getElementById('userManageTable');
    userManageTable.innerHTML = '';
    const users = getUsers();
    users.forEach(user => {
        const row = userManageTable.insertRow();
        row.innerHTML = `
            <td>${user.username}</td>
            <td>
                ${user.username !== 'admin' ? 
                `<button class="btn btn-danger btn-sm" onclick="deleteUser('${user.username}')">删除</button>`
                : '管理员'}
            </td>
        `;
    });
}
function deleteUser(username) {
    if (!isAdmin()) return;
    if (confirm(`确定要删除用户 ${username} 吗？`)) {
        let users = getUsers().filter(u => u.username !== username);
        saveUsers(users);
        // 如果删除了当前登录用户
        if (getCurrentUser() === username) {
            logout();
        }
        updateUserManageTable();
        alert(`用户 ${username} 已删除`);
    }
}
// ========== END 用户管理功能 ==========

// 在页面加载时初始化用户状态
updateUserStatus();

// ========== 借阅/归还功能 ==========
// 获取借阅历史
function getBorrowHistory() {
    return JSON.parse(localStorage.getItem('borrowHistory')) || [];
}
// 保存借阅历史
function saveBorrowHistory(history) {
    localStorage.setItem('borrowHistory', JSON.stringify(history));
}
// 记录借阅操作
function recordBorrow(bookId, userId) {
    let history = getBorrowHistory();
    history.push({ bookId, userId, action: 'borrow', timestamp: new Date().toISOString() });
    saveBorrowHistory(history);
}
// 记录归还操作
function recordReturn(bookId, userId) {
    let history = getBorrowHistory();
    history.push({ bookId, userId, action: 'return', timestamp: new Date().toISOString() });
    saveBorrowHistory(history);
}
function borrowBook(id) {
    const user = getCurrentUser();
    if (!user) {
        showLoginModal();
        return;
    }
    const book = books.find(b => b.id === id);
    if (book && book.available) {
        book.available = false;
        book.borrower = user;
        saveBooks();
        recordBorrow(book.id, user); // 记录借阅历史
        showBookList();
        alert('借阅成功！');
    }
}
function returnBook(id) {
    const user = getCurrentUser();
    if (!user) {
        showLoginModal();
        return;
    }
    const book = books.find(b => b.id === id);
    if (book && !book.available && book.borrower === user) {
        book.available = true;
        book.borrower = null;
        saveBooks();
        recordReturn(book.id, user); // 记录归还历史
        showBookList();
        alert('归还成功！');
    } else {
        alert('只有借阅人本人才能归还！');
    }
}

// ========== 批量生成100本示例图书 ==========
function generateSampleBooks() {
    const categories = ['计算机', '文学', '历史', '科学', '艺术'];
    const books = [];
    let id = 1;
    categories.forEach(category => {
        for (let i = 1; i <= 20; i++) {
            books.push({
                id: id++,
                title: `${category}类图书${i}`,
                author: `${category}作者${i}`,
                isbn: `${category.substr(0,2).toUpperCase()}-${i.toString().padStart(4, '0')}`,
                category: category,
                available: true,
                borrower: null,
                description: `${category}类第${i}本示例图书`
            });
        }
    });
    localStorage.setItem('books', JSON.stringify(books));
    return books;
}
// 只在首次加载时生成（如需强制刷新可手动调用）
if (!localStorage.getItem('books') || JSON.parse(localStorage.getItem('books')).length !== 100) {
    books = generateSampleBooks();
} 