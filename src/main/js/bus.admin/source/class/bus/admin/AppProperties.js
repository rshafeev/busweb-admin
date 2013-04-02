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
			"id":"c_en",
			"name":"English"
		},
		{
			"id":"c_ru",
			"name":"Русский"
		},
		{
			"id":"c_uk",
			"name":"Українська"
		}],

		/**
		 * Типы маршрутов.
		 * @type {Object[]}
		 */
		RouteTypes : [{
				id : "c_route_bus",
				text : qx.locale.Manager.tr("Bus")
			}, {
				id : "c_route_tram",
				text : qx.locale.Manager.tr("Tram")
			}, {
				id : "c_route_trolley",
				text : qx.locale.Manager.tr("Trolleybus")
			}, {
				id : "c_route_metro",
				text : qx.locale.Manager.tr("Metro")
			}],

		/**
		 * Возвращает ID языка для текущей локали
		 * @return {String} ID языка. Возможные значения: "c_en", "c_ru", "c_uk"
		 */
		getLocale : function(){
			return "c_" + qx.locale.Manager.getInstance().getLocale();
		}
	}
});
