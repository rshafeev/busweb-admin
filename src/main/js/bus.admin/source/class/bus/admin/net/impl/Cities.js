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
 * Класс удаленного вызова функций работы с городами.
 */
qx.Class.define("bus.admin.net.impl.Cities", {
	extend : Object,

	construct : function() {
	},

	members : {

		/**
		 * Получает от сервера массив всех городов. 
		 * @param  callback {Function}  Функция вызывается после получения ответа сервера. Аргументом функции является объект типа {@link qx.io.remote.Response}.
		 * @param  self    {Object} Объект this для callback функции
		 * @return {qx.io.remote.Request}  Объект управления запросом.
		 */
		getAll : function(callback, self) {
		 	var contextPath = bus.admin.AppProperties.ContextPath;
			var request = new qx.io.remote.Request(contextPath + "cities/getAll.json", "POST", "application/json");
			request.setParseJson(true);
			request.addListener("completed", callback, self);
			request.addListener("failed", callback, self);
			request.send();
			return request;
		},

		/**
		 * Отправляет Обновленную модель города на сервере. В ответе от сервера содержится также содержится обновленная модель.
		 * @param  cityModel {bus.admin.mvp.model.CitiesModel}  Модель города.
		 * @param  callback {Function}  Функция вызывается после получения ответа сервера. Аргументом функции является объект типа {@link qx.io.remote.Response}.
		 * @param  self      {Object} Объект this для callback функции
		 * @return {qx.io.remote.Request}  Объект управления запросом.
		 */
		update : function(cityModel, callback,	self) {
		 	var contextPath = bus.admin.AppProperties.ContextPath;
			var cityJson = qx.lang.Json.stringify(cityModel.toDataModel()); 
			var request = new qx.io.remote.Request(contextPath + "cities/update.json", "POST", "application/json");
			request.setParseJson(true);
			request.setRequestHeader("Content-Type", "application/json");
			request.setRequestHeader("Accept", "application/json");
			request.setData(cityJson);
			request.addListener("completed", callback, self);
			request.addListener("failed", callback, self);
			request.send();
			return request;
		},

		/**
		 * Отправляет новый город на сервер. В ответе сервера содержится данным о добавленном городе.  
		 * @param  cityModel {bus.admin.mvp.model.CitiesModel}   Новый город
	     * @param  callback {Function}  Функция вызывается после получения ответа сервера. Аргументом функции является объект типа {@link qx.io.remote.Response}.
		 * @param  self {Object}   Объект this для callback функции
		 * @return {qx.io.remote.Request}  Объект управления запросом.
		 */
		insert : function(cityModel, callback, self) {
		 	var contextPath = bus.admin.AppProperties.ContextPath;
			var cityJson = qx.lang.Json.stringify(cityModel.toDataModel()); 
			var request = new qx.io.remote.Request(contextPath +  "cities/insert.json", "POST", "application/json");
			request.setParseJson(true);
			request.setRequestHeader("Content-Type", "application/json");
			request.setData(cityJson);
			request.addListener("completed", callback, self);
			request.addListener("failed", callback, self);
			request.send();
			return request;
		},

		/**
		 * Отправляет на сервер ID города, который нужно удалить.
		 * @param  cityID {Integer}     ID города
		 * @param  callback {Function}  Функция вызывается после получения ответа сервера. Аргументом функции является объект типа {@link qx.io.remote.Response}.
		 * @param  self      {Object} Объект this для callback функции
		 * @return {qx.io.remote.Request}  Объект управления запросом.
		 */
		remove : function(cityID, callback, self) {
		 	var contextPath = bus.admin.AppProperties.ContextPath;
			var request = new qx.io.remote.Request(contextPath +  "cities/remove.json", "POST", "application/json");
			request.setParseJson(true);
			request.setParameter("city_id", cityID, true);
			request.addListener("completed", callback, self);
			request.addListener("failed", callback, self);
			request.send();
			return request;
		}

	}
});
