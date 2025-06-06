package com.library.servlet;

import com.library.dao.BookDao;
import com.library.model.Book;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

@WebServlet("/books/*")
public class BookServlet extends HttpServlet {
    private BookDao bookDao;

    @Override
    public void init() throws ServletException {
        bookDao = new BookDao();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        String pathInfo = request.getPathInfo();
        
        try {
            if (pathInfo == null || pathInfo.equals("/")) {
                // List all books
                List<Book> books = bookDao.getAllBooks();
                request.setAttribute("books", books);
                request.getRequestDispatcher("/WEB-INF/views/book-list.jsp").forward(request, response);
            } else if (pathInfo.equals("/new")) {
                // Show new book form
                request.getRequestDispatcher("/WEB-INF/views/book-form.jsp").forward(request, response);
            } else if (pathInfo.startsWith("/edit/")) {
                // Show edit book form
                String[] splits = pathInfo.split("/");
                if (splits.length == 3) {
                    Long id = Long.parseLong(splits[2]);
                    Book book = bookDao.getBookById(id);
                    if (book != null) {
                        request.setAttribute("book", book);
                        request.getRequestDispatcher("/WEB-INF/views/book-form.jsp").forward(request, response);
                    } else {
                        response.sendError(HttpServletResponse.SC_NOT_FOUND);
                    }
                }
            } else {
                // Get single book
                String[] splits = pathInfo.split("/");
                if (splits.length == 2) {
                    Long id = Long.parseLong(splits[1]);
                    Book book = bookDao.getBookById(id);
                    if (book != null) {
                        request.setAttribute("book", book);
                        request.getRequestDispatcher("/WEB-INF/views/book-detail.jsp").forward(request, response);
                    } else {
                        response.sendError(HttpServletResponse.SC_NOT_FOUND);
                    }
                }
            }
        } catch (SQLException e) {
            throw new ServletException("Database error", e);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        String pathInfo = request.getPathInfo();
        
        try {
            if (pathInfo == null || pathInfo.equals("/")) {
                // Create new book
                Book book = new Book();
                book.setTitle(request.getParameter("title"));
                book.setAuthor(request.getParameter("author"));
                book.setIsbn(request.getParameter("isbn"));
                book.setAvailable(true);
                book.setDescription(request.getParameter("description"));
                
                bookDao.addBook(book);
                response.sendRedirect(request.getContextPath() + "/books");
            } else if (pathInfo.startsWith("/update/")) {
                // Update book
                String[] splits = pathInfo.split("/");
                if (splits.length == 3) {
                    Long id = Long.parseLong(splits[2]);
                    Book book = new Book();
                    book.setId(id);
                    book.setTitle(request.getParameter("title"));
                    book.setAuthor(request.getParameter("author"));
                    book.setIsbn(request.getParameter("isbn"));
                    book.setAvailable(Boolean.parseBoolean(request.getParameter("available")));
                    book.setDescription(request.getParameter("description"));
                    
                    bookDao.updateBook(book);
                    response.sendRedirect(request.getContextPath() + "/books");
                }
            } else if (pathInfo.startsWith("/delete/")) {
                // Delete book
                String[] splits = pathInfo.split("/");
                if (splits.length == 3) {
                    Long id = Long.parseLong(splits[2]);
                    bookDao.deleteBook(id);
                    response.sendRedirect(request.getContextPath() + "/books");
                }
            }
        } catch (SQLException e) {
            throw new ServletException("Database error", e);
        }
    }
} 