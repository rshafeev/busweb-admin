<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<%@ page import="java.util.Map"%>
<%@ page import="java.util.*"%>
<%@ page session="true"%>

<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<html>

<head>
<title>Admin sign-up</title>
<script src="media/js/login-form.js"></script>
<script
	src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js">	
</script>
<link rel="stylesheet" href="media/css/login-form.css" media="screen">

<meta name="robots" content="noindex,follow" />
</head>

<body OnLoad="document.loginform.j_username.focus();">
	<img src="media/img/login/title2.png" alt="title">
	<div class="login-form">
		<h1>Admin sign-up</h1>
		<c:if test="${model.isAuthFailed()==true}">
			<font size="1" face="arial" color="red"> 
				Error! Login or password were failed
			</font>
		</c:if>
		<form name="loginform" action="j_spring_security_check" method="POST">
			<input type="text" name="j_username" placeholder="Login"
				> <input type="password"
				name="j_password" placeholder="Password"> <span> <input
				type="checkbox" name="_spring_security_remember_me"> <label
				for="checkbox">Remember</label>
			</span> <input type="submit" value="Submit">
		</form>
	</div>

	<div class="footer">
		<p>
			Come back to <a href="http://test.premiumgis.com/busWeb">the site</a>.
		</p>
	</div>



</body>

</html>