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
 * Глобальные свойства приложения и функции работы  с ними  
 */
qx.Class.define("bus.admin.AppProperties", {
	type : "static",

	statics : {
		/**
		 * Язык локали
		 * @type {String}
		 */
		LOCALE_LANGUAGE : "en",

		/**
		 * ContextPath
		 * @type {String}
		 */
		ContextPath : "/",
		
		/**
		 * ID языков контента
		 * @type {Object[]}
		 */
		LANGUAGES : 
		[{
			"id":"en",
			"name":"English"
		},
		{
			"id":"ru",
			"name":"Русский"
		},
		{
			"id":"uk",
			"name":"Українська"
		}],

		/**
		 * Типы маршрутов.
		 * @type {Object[]}
		 */
		RouteTypes : [{
				id : "bus",
				name : qx.locale.Manager.tr("Bus")
			}, {
				id : "tram",
				name : qx.locale.Manager.tr("Tram")
			}, {
				id : "trolley",
				name : qx.locale.Manager.tr("Trolleybus")
			}, {
				id : "metro",
				name : qx.locale.Manager.tr("Metro")
			}],

		/**
		 * Возвращает ID языка для текущей локали
		 * @return {String} ID языка. Возможные значения: "en", "ru", "uk"
		 */
		getLocale : function(){
			return qx.locale.Manager.getInstance().getLocale();
		}
	}
});
