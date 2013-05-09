/*************************************************************************
 *
 * Copyright:
 * Bus.Admin-lib is copyright (c) 2012, {@link http://ways.in.ua} Inc. All Rights Reserved. 
 *
 * License:
 * Bus.Admin-lib is free software, licensed under the MIT license. 
 * See the file {@link http://api.ways.in.ua/license.txt|license.txt} in this distribution for more details.
 *
 * Authors:
 * Roman Shafeyev (rs@premiumgis.com)
 *
 *************************************************************************/

/**
 * Класс удаленного вызова функций работы с маршрутами.
 */
 qx.Class.define("bus.admin.net.impl.Routes", {
 	extend : qx.core.Object,

 	construct : function(sync) {
 		if (sync != null) {
 			this.__sync = sync;
 		}

 	},
 	members : {
 		__sync : false,

 		/**
 		 * Возвращает список остановок для определенного города. Язык названий остановок задается в аргументах функции.
 		 * @param  cityID {Integer}    ID города
 		 * @param  routeTypeID {String} ID типа маршрутов
 		 * @param  langID {String}     ID языка
		 * @param  callback {Function}  Функция вызывается после получения ответа сервера. Аргументом функции является объект типа {@link qx.io.remote.Response}.
		 * @param  self    {Object} Объект this для callback функции
		 * @return {qx.io.remote.Request}  Объект управления запросом.
		 */
		 getRoutesList : function(cityID, routeTypeID, langID, callback, self) {
		 	var contextPath = bus.admin.AppProperties.ContextPath;
		 	var request = new qx.io.remote.Request(contextPath + "routes/getRoutesList", "POST", "application/json");
		 	request.setAsynchronous(!this.__sync);
		 	request.setParseJson(true);
		 	request.setParameter("cityID", cityID, true);
		 	request.setParameter("routeTypeID", routeTypeID, true);
		 	request.setParameter("langID", langID, true);
		 	request.addListener("completed", callback, self);
		 	request.addListener("failed", callback, self);
		 	request.send();
		 	return request;
		 },

 		/**
 		 * Возвращает полную информацию о маршруте. 
 		 * @param  routeID {Integer}   ID маршрута
		 * @param  callback  {Function}  Функция вызывается после получения ответа сервера. 
		 *                               Аргументом функции является объект типа {@link qx.io.remote.Response}.
		 * @param  self      {Object} Объект this для callback функции
		 * @return {qx.io.remote.Request}  Объект управления запросом.
		 */
		 get : function(routeID, callback, self){
		 	var contextPath = bus.admin.AppProperties.ContextPath;
		 	var request = new qx.io.remote.Request(contextPath +  "routes/get", "POST", "application/json");
		 	request.setAsynchronous(!this.__sync);
		 	request.setParseJson(true);
		 	request.setParameter("routeID", routeID, true);
		 	request.addListener("completed", callback, self);
		 	request.addListener("failed", callback, self);
		 	request.send();
		 	return request;		
		 },

 		/**
 		 * Изменяет маршрут на сервере. 
 		 * @param  routeModel {bus.admin.mvp.model.RouteModel}  Модель маршрута
		 * @param  callback  {Function}  Функция вызывается после получения ответа сервера. 
		 *                               Аргументом функции является объект типа {@link qx.io.remote.Response}.
		 * @param  self      {Object}    Объект this для callback функции
		 * @return {qx.io.remote.Request}  Объект управления запросом.
		 */
		 update : function(routeModel, callback,	self) {
		 	var contextPath = bus.admin.AppProperties.ContextPath;
		 	var routeJson = qx.lang.Json.stringify(routeModel.toDataModel()); 

		 	var req = new qx.io.request.Xhr(contextPath + "routes/update", "POST");
		 	this.debug(routeJson);
		 	req.setRequestHeader("Accept", "application/json");
		 	req.setRequestHeader("Content-Type", "application/json");
		 	req.setRequestData(routeJson);
		 	req.setUrl(contextPath + "routes/update");
		 	req.send();
		 	return req;
		 	/*
		 	var request = new qx.io.remote.Request(contextPath + "routes/update", "POST", "application/json");
			//request.setRequestHeader("Accept", "application/json");
			request.setRequestHeader("Content-Type", "application/json");
			
			request.setParseJson(true);
			request.setParameter("route",routeJson, true);
			request.addListener("completed", callback, self);
			request.addListener("failed", callback, self);
			request.send();
			return request;*/
		} 		 

		 /*
		 getRoute : function(data, completed_func, failed_func, self) {

		 	var data_json = qx.lang.Json.stringify(data);
		 	this.debug(data);
		 	var request = new qx.io.remote.Request(
		 		"/routes/get_route", "POST", "application/json");
		 	request.setAsynchronous(!this.__sync);
		 	request.setParseJson(true);
		 	request.setParameter("data", data_json, true);
		 	request.addListener("completed", completed_func, self);
		 	request.addListener("failed", failed_func, self);
		 	request.send();
		 	return request;
		 },
		 insertRoute : function(data, completed_func, failed_func, self) {

		 	var data_json = qx.lang.Json.stringify(data);
		 	this.debug(data);
		 	var request = new qx.io.remote.Request(
		 		"/routes/insert_route", "POST", "application/json");
		 	request.setAsynchronous(!this.__sync);
		 	request.setParseJson(true);
		 	request.setParameter("data", data_json, true);
		 	request.addListener("completed", completed_func, self);
		 	request.addListener("failed", failed_func, self);
		 	request.send();
		 	return request;

		 },

		 updateRoute : function(data, completed_func, failed_func, self) {

		 	var data_json = qx.lang.Json.stringify(data);
		 	this.debug(data);
		 	var request = new qx.io.remote.Request(
		 		"/routes/update", "POST", "application/json");
		 	request.setAsynchronous(!this.__sync);
		 	request.setParseJson(true);
		 	request.setParameter("data", data_json, true);
		 	request.addListener("completed", completed_func, self);
		 	request.addListener("failed", failed_func, self);
		 	request.send();
		 	return request;

		 },

		 removeRoute : function(route_id, completed_func, failed_func, self) {
		 	var request = new qx.io.remote.Request(
		 		"/routes/delete", "POST", "application/json");
		 	request.setAsynchronous(!this.__sync);
		 	request.setParseJson(true);
		 	request.setParameter("route_id", route_id.toString(), true);
		 	request.addListener("completed", completed_func, self);
		 	request.addListener("failed", failed_func, self);
		 	request.send();
		 	return request;

		 }
		 */

		}
	});
