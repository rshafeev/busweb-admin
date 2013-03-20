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
 * Класс имитирует удаленный вызов функции на сервере. 
 */
 qx.Class.define("bus.admin.net.DataRequest", {
 	extend : qx.core.Object,

 	construct : function() {

 	},
 	members : {
		/**
		 * Позволяет удаленно работать с городами
		 * @type {bus.admin.net.impl.Cities}
		 */
		 __cities : null,

		/**
		 * Позволяет удаленно работать  со станциями
		 * @type {bus.admin.net.impl.Stations}
		 */
		 __stations : null,

		/**
		 * Возвращает объект для удаленной работы с городами
		 * @return {bus.admin.net.impl.Cities} 
		 */
		 Cities : function(){
		 	if(this.__cities == null){
		 		this.__cities = new bus.admin.net.impl.Cities();
		 	}
		 	return this.__cities;
		 },

		/**
		 * Возвращает объект для удаленной работы со станциями
		 * @return {bus.admin.net.impl.Stations} 
		 */
		 Stations : function(){
		 	if(this.__stations == null){
		 		this.__stations = new bus.admin.net.impl.Stations();
		 	}
		 	return this.__stations;	
		 }


		}

	});
