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
 * Класс удаленного вызова функций работы со станциями.
 */
 qx.Class.define("bus.admin.net.impl.Stations", {
 	extend : qx.core.Object,

 	construct : function(sync) {
 		if (sync != undefined) {
 			this.__sync = sync;
 		}

 	},
 	members : {
 		__sync : false,

 		/**
 		 * Возвращает список остановок для определенного города. Язык названий остановок задается в аргументах функции.
 		 * @param  cityID {Integer}    ID города
 		 * @param  langID {String}     ID языка
		 * @param  callback {Function}  Функция вызывается после получения ответа сервера. Аргументом функции является объект типа {@link qx.io.remote.Response}.
		 * @param  self    {Object} Объект this для callback функции
		 * @return {qx.io.remote.Request}  Объект управления запросом.
		 */
		 getStationsList : function(cityID, langID, callback, self ){
		 	var contextPath = bus.admin.AppProperties.ContextPath;
		 	var request = new qx.io.remote.Request(contextPath + "stations/getStationsList", "POST", "application/json");
		 	request.setParseJson(true);
		 	request.setParameter("cityID", cityID, true);
		 	request.setParameter("langID", langID, true);
		 	request.addListener("completed", callback, self);
		 	request.addListener("failed", callback, self);
		 	request.send();
		 	return request;

		 },

 		/**
 		 * Возвращает набор остановок, местоположения которых попадает в заданный прямоугольник. 
 		 * @param  cityID {Integer}    ID города
 		 * @param  langID {String}     ID языка
 		 * @param  ltPoint {Object}    Координаты левого верхнего угла прямоугольника. Формат объекта: {x : Number, y : Number}
 		 * @param  rbPoint {Object}    Координаты правого нижнего угла прямоугольника. Формат объекта: {x : Number, y : Number}
		 * @param  callback {Function}  Функция вызывается после получения ответа сервера. Аргументом функции является объект типа {@link qx.io.remote.Response}.
		 * @param  self    {Object} Объект this для callback функции
		 * @return {qx.io.remote.Request}  Объект управления запросом.
		 */
		 getStationsFromBox : function(cityID, langID, ltPoint, rbPoint,  callback, self) {
		 	var contextPath = bus.admin.AppProperties.ContextPath;
		 	var data = {
		 		cityID : cityID,
		 		langID : langID,
		 		ltPoint : ltPoint,
		 		rbPoint : rbPoint
		 	};
		 	var data_json = qx.lang.Json.stringify(data);
		 	this.debug(data);
		 	var request = new qx.io.remote.Request(contextPath + "stations/getStationsFromBox", "POST",	"application/json");
		 	request.setAsynchronous(!this.__sync);
		 	request.setParseJson(true);
		 	request.setParameter("data", data_json, true);
		 	request.addListener("completed", callback, self);
		 	request.addListener("failed", callback, self);
		 	request.send();
		 	return request;
		 },

 		/**
 		 * Возвращает полную информацию о остановки. 
 		 * @param  stationID{Integer}   ID остановки
		 * @param  callback {Function}  Функция вызывается после получения ответа сервера. Аргументом функции является объект типа {@link qx.io.remote.Response}.
		 * @param  self    {Object} Объект this для callback функции
		 * @return {qx.io.remote.Request}  Объект управления запросом.
		 */
		 get : function(stationID, callback, self){
		 	var contextPath = bus.admin.AppProperties.ContextPath;
		 	var request = new qx.io.remote.Request(contextPath +  "stations/get", "POST", "application/json");
		 	request.setAsynchronous(!this.__sync);
		 	request.setParseJson(true);
		 	request.setParameter("stationID", stationID, true);
		 	request.addListener("completed", callback, self);
		 	request.addListener("failed", callback, self);
		 	request.send();
		 	return request;		
		 },

		/**
		 * Отправляет Обновленную модель станции на сервере. В ответе от сервера содержится также содержится обновленная модель.
		 * @param  stationModel {bus.admin.mvp.model.StationModel}  Модель станции.
		 * @param  callback {Function}  Функция вызывается после получения ответа сервера. Аргументом функции является объект типа {@link qx.io.remote.Response}.
		 * @param  self      {Object} Объект this для callback функции
		 * @return {qx.io.remote.Request}  Объект управления запросом.
		 */
		 update : function(stationModel, callback, self) {
		 	var contextPath = bus.admin.AppProperties.ContextPath;
		 	var stationJson = qx.lang.Json.stringify(stationModel.toDataModel());
		 	var request = new qx.io.remote.Request(contextPath + "stations/update","POST", "application/json");
		 	request.setAsynchronous(!this.__sync);
		 	request.setParseJson(true);

		 	request.setParameter("row_station", stationJson, true);
		 	request.addListener("completed", callback, self);
		 	request.addListener("failed", callback, self);
		 	request.send();
		 	return request;
		 },

		/**
		 * Отправляет Новую модель станции на сервер. В ответе от сервера содержится также содержится обновленная модель.
		 * @param  stationModel {bus.admin.mvp.model.StationModel}  Модель станции.
		 * @param  callback {Function}  Функция вызывается после получения ответа сервера. Аргументом функции является объект типа {@link qx.io.remote.Response}.
		 * @param  self      {Object} Объект this для callback функции
		 * @return {qx.io.remote.Request}  Объект управления запросом.
		 */
		 insert : function(stationModel, callback, self) {
		 	var contextPath = bus.admin.AppProperties.ContextPath;
		 	var stationJson = qx.lang.Json.stringify(stationModel.toDataModel());
		 	var request = new qx.io.remote.Request(contextPath + "stations/insert", "POST", "application/json");
		 	request.setAsynchronous(!this.__sync);
		 	request.setParseJson(true);
		 	request.setParameter("row_station", stationJson, true);
		 	request.addListener("completed", callback, self);
		 	request.addListener("failed", callback, self);
		 	request.send();
		 	return request;
		 },

		/**
		 * Удаляет станцию. В ответе от сервера содержится инфрмация об успешности операции.
		 * @param  stationModel {bus.admin.mvp.model.StationModel}  Модель станции.
		 * @param  callback {Function}  Функция вызывается после получения ответа сервера. Аргументом функции является объект типа {@link qx.io.remote.Response}.
		 * @param  self      {Object} Объект this для callback функции
		 * @return {qx.io.remote.Request}  Объект управления запросом.
		 */
		 remove : function(stationID, callback, self) {
		 	var contextPath = bus.admin.AppProperties.ContextPath;
		 	var request = new qx.io.remote.Request(contextPath + "stations/remove",	"POST", "application/json");
		 	request.setAsynchronous(!this.__sync);
		 	request.setParseJson(true);
		 	request.setParameter("stationID", stationID, true);
		 	request.addListener("completed", callback, self);
		 	request.addListener("failed", callback, self);
		 	request.send();
		 	return request;
		 }

		}
	});
