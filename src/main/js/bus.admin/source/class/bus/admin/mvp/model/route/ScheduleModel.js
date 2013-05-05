/*************************************************************************
 *
 * Copyright:
 * Bus.Admin-lib is copyright (c) 2012, {@link http://ways.in.ua} Inc. All Rights Reserved. 
 *
 * License:
 * Bus.Admin-lib is free software, licensed under the MIT license. 
 * See the file {@link http://api.ways.in.ua/license.txt license.txt} in this distribution for more details.
 *
 * Authors:
 * Roman Shafeyev (rs@premiumgis.com)
 *
 *************************************************************************/

/**
 * Модель расписания маршрута. 
 */
 qx.Class.define("bus.admin.mvp.model.route.ScheduleModel", {
 	extend : Object,

 	/**
 	 * В конструктор передается JS объект, который имеет следующий формат:
 	 * 
 	 * @param  dataModel {Object|null}  JS объект.
 	 */
 	 construct : function(dataModel) {
 	 	if(dataModel != undefined){
 	 		this.fromDataModel(dataModel);
 	 	}
 	 },

 	 properties : {

 	 	/**
 	 	 * ID расписания
 	 	 */
 	 	 id : {
 	 	 	init : 0,
 	 	 	check : "Integer"
 	 	 },

 	 	/**
 	 	 * ID пути, к которому относится данное расписание
 	 	 */
 	 	 routeWayID : {
 	 	 	init : 0,
 	 	 	check : "Integer"
 	 	 }



 	 	},
 	 	members : 
 	 	{
 	 	/**
 	 	  * Дни недели разбиты по группам. Для каждой группы отдельное расписание
 	 	  */
 	 		__groups : null,

 		/**
 		 * Преобразует модель в JS объект, который можно в дальнейшем сериализовать в JSON строку и отправить на сервер.
 		 * @return {Object} JS объект.
 		 */
 		 toDataModel : function(){
 		 	var dataModel = {
 		 		id : this.getId(),
 		 		routeWayID : this.getRouteWayID(),
 		 		groups : this.__groups
 		 
 		 	};
 		 	return dataModel;
 		 },

 		 /**
 		  * Формирует модель из JS объекта. <br>
 		  * Как правило, объект  dataModel получают путем десериализации JSON строки, полученной от сервера. Объект dataModel должен иметь
 		  * следующие свойства:
 		  * <pre>
 		  * <ul>
 		  * <li> id          ID пути, Integer</li>
 		  * <li> routeWayID  ID пути, к которому относится данное расписание, Integer</li>
 		  * <li> groups      Дни недели разбиты по группам. Для каждой группы отдельное расписание, Object[]. </li>
 		  * <ul>
 		  * </pre>
 		  * @param  dataModel {Object}  JS объект.
 		  */
 		  fromDataModel : function(dataModel){
 		  	this.setId(dataModel.id);
 		  	this.setRouteWayID(dataModel.routeWayID);
 		  	this.__groups = dataModel.groups;
 		  },

 		  /**
 		   * Клонирует текущий объект.
 		   * @return {bus.admin.mvp.model.route.ScheduleModel} Копия объекта.
 		   */
 		   clone : function(){
 		   	var copy = new bus.admin.mvp.model.route.ScheduleModel(this.toDataModel());
 		   	return copy;
 		   }



 		}

 	});