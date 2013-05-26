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
 * Класс удаленного вызова функций работы с поддерживаемыми языками.
 */
qx.Class.define("bus.admin.net.impl.Langs", {
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
		 * Получает от сервера массив всех городов. 
		 * @param  callback {Function}  Функция вызывается после получения ответа сервера. Аргументом функции является объект типа {@link qx.io.remote.Response}.
		 * @param  self    {Object} Объект this для callback функции
		 * @return {qx.io.remote.Request}  Объект управления запросом.
		 */
		 getAll : function(callback, self) {
		 	var request = new qx.io.remote.Request(this.__contextPath + "langs/getAll.json", "POST", "application/json");
		 	request.setParseJson(true);
		 	request.setAsynchronous(!this.__sync);
		 	request.addListener("completed", callback, self);
		 	request.addListener("failed", callback, self);
		 	request.send();
		 	return request;
		 }
		}
	});
