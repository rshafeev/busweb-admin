<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<%@page import="java.util.Map"%>
<%@page import="java.util.*"%>
<%@page session="true"%>
<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>

<html lang="en">

<head>
	<title>Авторизация</title>
    <script src="media/js/jquery.min.js"></script>
    <script src="media/js/login-form.js"></script>

	<link rel="stylesheet" href="media/css/login-form.css" media="screen">
     
	<style>body{background:url(media/img/login/bg.png) center;margin: 0 auto;width: 960px;padding-top: 50px}.footer{margin-top:50px;text-align:center;color:#666;font:bold 14px Arial}.footer a{color:#999;text-decoration:none}.login-form{margin: 50px auto;}</style>
<meta name="robots" content="noindex,follow" />
</head>

<body OnLoad="document.loginform.j_username.focus();">

<img src="media/img/login/title2.png" alt="title">

<div class="login-form">

	<h1>Авторизация </h1>
<%String login_error = request.getAttribute("login_error")==null ? null : (String)request.getAttribute("login_error"); 
if (login_error!=null){
%>
	<font size="1" face="arial" color="red">
	Ошибка. Неверный логин или пароль!
	</font>
<%} %>

    <form name="loginform" action="<c:url value='j_spring_security_check'/>"
                method="POST" >
                <input type="text" name="j_username" placeholder="Логин">
				<input type="password" name="j_password" placeholder="Пароль">
				 <span>
					<input type="checkbox" name="_spring_security_remember_me">
					<label for="checkbox">Запомнить</label>
				</span>  
				<input type="submit" value="Войти">
     </form>
</div>

<div class="footer"><p>Вернуться на  <a href="http://premiumgis.com">сайт</a>.</p></div>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
<script src="js/login-form.js"></script>

</body>

</html>