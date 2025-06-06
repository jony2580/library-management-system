<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${book == null ? '添加新书' : '编辑图书'}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-4">
        <h1>${book == null ? '添加新书' : '编辑图书'}</h1>
        
        <form action="${pageContext.request.contextPath}/books${book == null ? '' : '/update/' + book.id}" method="post" class="mt-4">
            <div class="mb-3">
                <label for="title" class="form-label">书名</label>
                <input type="text" class="form-control" id="title" name="title" value="${book.title}" required>
            </div>
            
            <div class="mb-3">
                <label for="author" class="form-label">作者</label>
                <input type="text" class="form-control" id="author" name="author" value="${book.author}" required>
            </div>
            
            <div class="mb-3">
                <label for="isbn" class="form-label">ISBN</label>
                <input type="text" class="form-control" id="isbn" name="isbn" value="${book.isbn}" required>
            </div>
            
            <c:if test="${book != null}">
                <div class="mb-3">
                    <label for="available" class="form-label">状态</label>
                    <select class="form-select" id="available" name="available">
                        <option value="true" ${book.available ? 'selected' : ''}>可借</option>
                        <option value="false" ${!book.available ? 'selected' : ''}>已借出</option>
                    </select>
                </div>
            </c:if>
            
            <div class="mb-3">
                <label for="description" class="form-label">描述</label>
                <textarea class="form-control" id="description" name="description" rows="3">${book.description}</textarea>
            </div>
            
            <div class="mt-3">
                <button type="submit" class="btn btn-primary">保存</button>
                <a href="${pageContext.request.contextPath}/books" class="btn btn-secondary">取消</a>
            </div>
        </form>
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html> 