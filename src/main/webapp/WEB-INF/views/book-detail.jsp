<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>图书详情 - ${book.title}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-4">
        <h1>图书详情</h1>
        
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">${book.title}</h5>
                <h6 class="card-subtitle mb-2 text-muted">作者：${book.author}</h6>
                <p class="card-text">
                    <strong>ISBN：</strong> ${book.isbn}<br>
                    <strong>状态：</strong> ${book.available ? '可借' : '已借出'}<br>
                    <strong>描述：</strong> ${book.description}
                </p>
                
                <div class="mt-3">
                    <a href="${pageContext.request.contextPath}/books/edit/${book.id}" class="btn btn-warning">编辑</a>
                    <a href="${pageContext.request.contextPath}/books" class="btn btn-secondary">返回列表</a>
                </div>
            </div>
        </div>
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html> 