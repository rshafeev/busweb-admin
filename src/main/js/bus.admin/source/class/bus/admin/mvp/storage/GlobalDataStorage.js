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
 * Глобальные свойства приложения и функции работы  с ними.
 * var globalStorage =  qx.core.Init.getApplication().getDataStorage();
 */
 qx.Class.define("bus.admin.mvp.storage.GlobalDataStorage", {

 	extend : qx.core.Object,

 	construct : function() {
 		var currentPageKey = qx.module.Storage.getLocalItem("global.currentPageKey");
 		
 		if(currentPageKey != undefined){
 			this.setCurrentPageKey(currentPageKey);
 		}

 		var supportedLocales =  [{
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
 		}];
 		var langsModel = new bus.admin.mvp.model.LanguagesModel(supportedLocales);
 		this.setSupportedLocales(langsModel);

 		var routeTypes =  [{
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
 		}];
 		this.setRouteTypes(routeTypes);
 	},

 	properties : {

 		currentPageKey : {
 			init : "Cities",
 			check : "String",
 			apply : "_applyCurrentPageKey" 
 		},

		/**
		 * ContextPath
		 * @type {String}
		 */
		 contextPath : {
		 	init : "/",
		 	check : "String"
		 },

        /**
         * Хранит набор языков
         * @type {bus.admin.mvp.model.LanguagesModel}
         */

         supportedLocales : {
         	nullable : true
         },

		/**
		 * Типы маршрутов.
		 * @type {Object[]}
		 */
		 routeTypes : {
		 	nullable : true
		 }
		},

		statics : {

		/**
		 * Возвращает ID языка для текущей локали
		 * @return {String} ID языка. Возможные значения: "en", "ru", "uk"
		 */
		 getLocale : function(){
		 	return qx.locale.Manager.getInstance().getLocale();
		 }
		},


		members : {

        /**
         * Вызывается при изменении свойства bus.admin.mvp.storage.GlobalDataStorage#currentPageKey.
         * @param  value {Object}  Новое значение свойства
         * @param  old {Object}    Предыдущее значение свойства
         * @param  name {String}   Название свойства
         */
         _applyCurrentPageKey : function(value, old, name){
         	qx.module.Storage.setLocalItem("global.currentPageKey", value);
         },

         getLocale : function(){
         	return bus.admin.mvp.storage.GlobalDataStorage.getLocale();
         }
     }
 });
