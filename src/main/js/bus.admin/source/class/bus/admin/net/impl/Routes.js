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

	/**
	 * @param  sync {Boolean}  Синхронное или ассинхронное выполнение запроса?
	 */
	 construct : function(sync) {
	 	if (sync != undefined) {
	 		this.__sync = sync;
	 	}
	 	this.__contextPath  = qx.core.Init.getApplication().getDataStorage().getContextPath();
	 },
	 members : {
	 	
		/**
		 * Синхронный запрос (блокирующий)  или асинхронный?
		 * @type {Boolean}
		 */
		 __sync : false,

		/**
		 * Папка web-приложения на сервере
		 * @type {String}
		 */
		 __contextPath : null, 

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
		 	var request = new qx.io.remote.Request(this.__contextPath  + "routes/getRoutesList.json", "POST", "application/json");
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
		 	var request = new qx.io.remote.Request(this.__contextPath  +  "routes/get.json", "POST", "application/json");
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
		 	var routeJson = qx.lang.Json.stringify(routeModel.toDataModel()); 
		 	var request = new qx.io.remote.Request(this.__contextPath + "routes/update.json", "POST", "application/json");
		 	request.setRequestHeader("Content-Type", "application/json");
		 	request.setAsynchronous(!this.__sync);
		 	request.setParseJson(true);
		 	request.setData(routeJson);
		 	request.addListener("completed", callback, self);
		 	request.addListener("failed", callback, self);
		 	request.send();
		 	return request;
		 },	 

 		/**
 		 * Добавляет маршрут в БД. 
 		 * @param  routeModel {bus.admin.mvp.model.RouteModel}  Модель маршрута
		 * @param  callback  {Function}  Функция вызывается после получения ответа сервера. 
		 *                               Аргументом функции является объект типа {@link qx.io.remote.Response}.
		 * @param  self      {Object}    Объект this для callback функции
		 * @return {qx.io.remote.Request}  Объект управления запросом.
		 */
		 insert : function(routeModel,callback, self) {
		 	var routeJson = qx.lang.Json.stringify(routeModel.toDataModel()); 
		 	var request = new qx.io.remote.Request(this.__contextPath + "routes/insert", "POST", "application/json");
		 	request.setRequestHeader("Content-Type", "application/json");
		 	request.setAsynchronous(!this.__sync);
		 	request.setParseJson(true);
		 	request.setData(routeJson);
		 	request.addListener("completed", callback, self);
		 	request.addListener("failed", callback, self);
		 	request.send();
		 	return request;

		 },

		/**
		 * Удаляет маршрут. В ответе от сервера содержится инфрмация об успешности операции.
		 * @param  routeID {Integer}  ID маршрута.
		 * @param  callback {Function}  Функция вызывается после получения ответа сервера. Аргументом функции является объект типа {@link qx.io.remote.Response}.
		 * @param  self      {Object} Объект this для callback функции
		 * @return {qx.io.remote.Request}  Объект управления запросом.
		 */
		 remove : function(routeID, callback, self) {
		 	var request = new qx.io.remote.Request(this.__contextPath  + "routes/remove.json",	"POST", "application/json");
		 	request.setAsynchronous(!this.__sync);
		 	request.setParseJson(true);
		 	request.setParameter("routeID", routeID, true);
		 	request.addListener("completed", callback, self);
		 	request.addListener("failed", callback, self);
		 	request.send();
		 	return request;
		 }

		}
	});
