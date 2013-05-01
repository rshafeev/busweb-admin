<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<%@ page import="java.util.Map"%>
<%@ page import="java.util.*"%>
<%@ page session="true"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="myContext" value="${pageContext.request.contextPath}"/>

<html>
<head>
<title>CityWays Admin Tool</title>
<script type="text/javascript">   
    function GlobalOptions(){
    	var options = {
    			lang  : "${model.getLanguage()}",
    			contextPath : "${myContext}/"
    	};
    	return options;
    }
</script>
<link rel="stylesheet" type="text/css"
	href="${myContext}/resource/bus/admin/css/app.css">
<link rel="stylesheet" type="text/css"
	href="${myContext}/resource/bus/admin/css/ContextMenu.css">

<!-- load the Google Maps API -->
<script type="text/javascript"
	src="http://maps.google.com/maps/api/js?sensor=false"></script>

<!--<script src="http://www.openlayers.org/api/OpenLayers.js"></script> -->
<script type="text/javascript"
	src="${myContext}/resource/bus/admin/js/ContextMenu.js"></script>
  <script type="text/javascript" src="${myContext}/resource/bus/admin/js/app.js"></script>

</head>
<body>

	<div id="loading">
		<div id="loading_image">
			<img src="${myContext}/resource/bus/admin/images/loading2.gif">
		</div>
	</div>



</body>
</html>


