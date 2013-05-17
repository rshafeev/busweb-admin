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
 		 * @param  langID {String}     ID языка
		 * @param  callback {Function}  Функция вызывается после получения ответа сервера. Аргументом функции является объект типа {@link qx.io.remote.Response}.
		 * @param  self    {Object} Объект this для callback функции
		 * @return {qx.io.remote.Request}  Объект управления запросом.
		 */
		 getStationsList : function(cityID, langID, callback, self ){
		 	var request = new qx.io.remote.Request(this.__contextPath + "stations/getStationsList.json", "POST", "application/json");
		 	request.setParseJson(true);
		 	request.setAsynchronous(!this.__sync);
		 	request.setParameter("cityID", cityID, true);
		 	request.setParameter("langID", langID, true);
		 	request.addListener("completed", callback, self);
		 	request.addListener("failed", callback, self);
		 	request.send();
		 	return request;

		 },

 		/**
 		 * Возвращает набор остановок, местоположения которых попадает в заданный прямоугольник. 
 		 * @param  stationsBoxModel {bus.admin.mvp.model.StationsBoxModel} Модель с ID города, языка, координатами прямоугольника.
 		 * @param  callback {Function}  Функция вызывается после получения ответа сервера. Аргументом функции является объект типа {@link qx.io.remote.Response}.
		 * @param  self    {Object} Объект this для callback функции
		 * @return {qx.io.remote.Request}  Объект управления запросом.
		 */
		 getStationsFromBox : function(stationsBoxModel,  callback, self) {
		 	var requestBody = qx.lang.Json.stringify(stationsBoxModel.toDataModel());
		 	this.debug(requestBody);
		 	var request = new qx.io.remote.Request(this.__contextPath  + "stations/getStationsFromBox.json", "POST",	"application/json");
		 	request.setParseJson(true);
		 	request.setAsynchronous(!this.__sync);
		 	request.setRequestHeader("Content-Type", "application/json");
			request.setData(requestBody);
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
		 	var request = new qx.io.remote.Request(this.__contextPath  +  "stations/get.json", "POST", "application/json");
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
		 * @param  stationModel {bus.admin.mvp.model.StationModelEx}  Модель станции.
		 * @param  callback {Function}  Функция вызывается после получения ответа сервера. Аргументом функции является объект типа {@link qx.io.remote.Response}.
		 * @param  self      {Object} Объект this для callback функции
		 * @return {qx.io.remote.Request}  Объект управления запросом.
		 */
		 update : function(stationModel, callback, self) {
		 	var stationJson = qx.lang.Json.stringify(stationModel.toDataModel());
		 	var request = new qx.io.remote.Request(this.__contextPath  + "stations/update.json","POST", "application/json");
		 	request.setAsynchronous(!this.__sync);
		 	request.setParseJson(true);
		 	request.setRequestHeader("Content-Type", "application/json");
		 	request.setData(stationJson);
		 	request.addListener("completed", callback, self);
		 	request.addListener("failed", callback, self);
		 	request.send();
		 	return request;
		 },

		/**
		 * Отправляет Новую модель станции на сервер. В ответе от сервера содержится также содержится обновленная модель.
		 * @param  stationModel {bus.admin.mvp.model.StationModelEx}  Модель станции.
		 * @param  callback {Function}  Функция вызывается после получения ответа сервера. Аргументом функции является объект типа {@link qx.io.remote.Response}.
		 * @param  self      {Object} Объект this для callback функции
		 * @return {qx.io.remote.Request}  Объект управления запросом.
		 */
		 insert : function(stationModel, callback, self) {
		 	var stationJson = qx.lang.Json.stringify(stationModel.toDataModel());
		 	var request = new qx.io.remote.Request(this.__contextPath  + "stations/insert.json", "POST", "application/json");
		 	request.setRequestHeader("Content-Type", "application/json");
		 	request.setAsynchronous(!this.__sync);
		 	request.setParseJson(true);
		 	request.setData(stationJson);
		 	request.addListener("completed", callback, self);
		 	request.addListener("failed", callback, self);
		 	request.send();
		 	return request;
		 },

		/**
		 * Удаляет станцию. В ответе от сервера содержится инфрмация об успешности операции.
		 * @param  stationID {Integer}  ID станции.
		 * @param  callback {Function}  Функция вызывается после получения ответа сервера. Аргументом функции является объект типа {@link qx.io.remote.Response}.
		 * @param  self      {Object} Объект this для callback функции
		 * @return {qx.io.remote.Request}  Объект управления запросом.
		 */
		 remove : function(stationID, callback, self) {
		 	var request = new qx.io.remote.Request(this.__contextPath  + "stations/remove.json",	"POST", "application/json");
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
