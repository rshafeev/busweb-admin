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
 * Presenter страницы {@link bus.admin.view.Routes Routes}. Является посредником между хранилищем данных и представлением. 
 * После очередного действия пользователя представление ( {@link bus.admin.view.Routes} или его дочерние виджеты) вызывают триггер 
 * презентера. В функции триггера задается логика, которая обновляет данные хранилища (также, возможно изменение данных на сервере) и 
 * вызывает нужное событие (например, "refresh", "update_route"и др.). Слушатели событий получают обновленные данные из хранилища и обновляют view.
 * Слушателями событий данной класса выступают представление bus.admin.view.Routes и его дочерние виджеты. 
 */
 qx.Class.define("bus.admin.mvp.presenter.RoutesPresenter", {
 	include : [bus.admin.mvp.presenter.mix.RoutesManager],

 	extend : qx.core.Object,

 	events : {
 		"loadRoutesList" : "qx.event.type.Data",

 		"loadRoute" : "qx.event.type.Data",

 		"insertRoute" : "qx.event.type.Data",

 		"removeRoute" : "qx.event.type.Data",

 		"updateRoute" : "qx.event.type.Data",

 		"startCreateNewRoute" : "qx.event.type.Data",

 		"finishCreateNewRoute" : "qx.event.type.Data",

 		"addNewStation" : "qx.event.type.Data",

 		"insertStationToCurrentRoute" : "qx.event.type.Data",

 		"loadImportObjects" : "qx.event.type.Data",

 		"loadImportRoute" : "qx.event.type.Data"

 	},

 	construct : function() {
 		this.base(arguments);
 		var dataStorage = new bus.admin.mvp.storage.RoutesPageDataStorage();
 		this.initDataStorage(dataStorage);
 	},

 	properties : {
 		/**
 		 * Хранилище данных страницы Cities
 		 * @type {bus.admin.mvp.storage.StationsPageDataStorage}
 		 */
 		 dataStorage : {
 		 	deferredInit : true
 		 }
 		},

 		members : {
 		}


 	});
