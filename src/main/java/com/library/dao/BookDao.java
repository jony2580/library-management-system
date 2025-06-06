package com.library.dao;

import com.library.model.Book;
import com.library.util.DatabaseUtil;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class BookDao {
    
    public List<Book> getAllBooks() throws SQLException {
        List<Book> books = new ArrayList<>();
        String sql = "SELECT * FROM books";
        
        try (Connection conn = DatabaseUtil.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            
            while (rs.next()) {
                Book book = new Book();
                book.setId(rs.getLong("id"));
                book.setTitle(rs.getString("title"));
                book.setAuthor(rs.getString("author"));
                book.setIsbn(rs.getString("isbn"));
                book.setAvailable(rs.getBoolean("available"));
                book.setDescription(rs.getString("description"));
                books.add(book);
            }
        }
        return books;
    }
    
    public Book getBookById(Long id) throws SQLException {
        String sql = "SELECT * FROM books WHERE id = ?";
        
        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setLong(1, id);
            ResultSet rs = pstmt.executeQuery();
            
            if (rs.next()) {
                Book book = new Book();
                book.setId(rs.getLong("id"));
                book.setTitle(rs.getString("title"));
                book.setAuthor(rs.getString("author"));
                book.setIsbn(rs.getString("isbn"));
                book.setAvailable(rs.getBoolean("available"));
                book.setDescription(rs.getString("description"));
                return book;
            }
        }
        return null;
    }
    
    public void addBook(Book book) throws SQLException {
        String sql = "INSERT INTO books (title, author, isbn, available, description) VALUES (?, ?, ?, ?, ?)";
        
        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, book.getTitle());
            pstmt.setString(2, book.getAuthor());
            pstmt.setString(3, book.getIsbn());
            pstmt.setBoolean(4, book.isAvailable());
            pstmt.setString(5, book.getDescription());
            pstmt.executeUpdate();
        }
    }
    
    public void updateBook(Book book) throws SQLException {
        String sql = "UPDATE books SET title = ?, author = ?, isbn = ?, available = ?, description = ? WHERE id = ?";
        
        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, book.getTitle());
            pstmt.setString(2, book.getAuthor());
            pstmt.setString(3, book.getIsbn());
            pstmt.setBoolean(4, book.isAvailable());
            pstmt.setString(5, book.getDescription());
            pstmt.setLong(6, book.getId());
            pstmt.executeUpdate();
        }
    }
    
    public void deleteBook(Long id) throws SQLException {
        String sql = "DELETE FROM books WHERE id = ?";
        
        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setLong(1, id);
            pstmt.executeUpdate();
        }
    }
} 