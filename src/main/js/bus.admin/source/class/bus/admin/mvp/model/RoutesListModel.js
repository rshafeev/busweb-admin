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
 * Модель хранит список маршрутов.
 */
 qx.Class.define("bus.admin.mvp.model.RoutesListModel", {
 	extend : Object,

 	/**
 	 * В конструктор передается JS объект, который имеет следующий формат:
 	 * <br>
 	 * <pre>
 	 * <ul>
 	 * <li> id          ID маршрута, Integer</li>
 	 * <li> number      Номер маршрута, String </li>
 	 * <li> cost        Стоимость проезда, Number </li>
 	 * <ul>
 	 * </pre>
 	 * @param  dataModel {Object[]|null}  JS объект.
 	 */
 	 construct : function(dataModel) {
 	 	this.__routesList = [];
 	 	if(dataModel != undefined){
 	 		this.fromDataModel(dataModel);
 	 	}
 	 },

 	 members : 
 	 {
 	 	/**
 	 	 * Список маршрутов
 	 	 * @type {bus.admin.mvp.model.RouteInfoModel[]}
 	 	 */
 	 	 __routesList : null,


 	 	/**
 	 	 * Возвращает массив объектов, каждый из которых является моделью маршрута. Каждая модель имеет следующие функции:
  		 * <br>
 		 * <pre>
 		 * <ul>
 		 * <li> Integer getId(),     setId(val)     ID маршрута. </li>
 		 * <li> String  getNumber(), setNumber(val) Номер маршрута. </li>
 		 * <li> Number  getCost(),   setCost(val)   Стоимость проезда.</li>
 		 * <ul>
 		 * </pre>
 	 	 * @return {bus.admin.mvp.model.RouteInfoModel[]} Массив моделей маршрутов.
 	 	 */
 	 	 getAll : function(){
 	 	 	return this.__routesList;
 	 	 },

  		/**
 		  * Формирует модель из JS объекта. <br>
 		  * Как правило, объект  dataModel получают путем десериализации JSON строки, полученной от сервера. Объект dataModel является массивом объектов,
 		  * каждый из которых должен иметь следующие свойства:
 		  * <br>
 		  * <pre>
 		  * <ul>
 		  * <li> id          ID маршрута, Integer</li>
 		  * <li> number      Номер маршрута, String </li>
 		  * <li> cost        Стоимость проезда, Number </li>
 		  * <ul>
 		  * </pre>
 		  * @param  dataModel {Object[]}  JS объект.
 		  */	 	
 		  fromDataModel : function(dataModel){
 		  	if(dataModel == undefined)
 		  		return;
 		  	var routes = dataModel.routes;
 		  	
 		  	this.__routesList = [];
 		  	for(var i = 0; i < routes.length; i++){
 		  		this.__routesList.push(new bus.admin.mvp.model.RouteInfoModel(routes[i]));
 		  	}
 		  },

 	 	/**
 	 	 * Возвращает модель маршрута по ID
 	 	 * @param  routeID {Integer}  ID маршрута
 	 	 * @return {bus.admin.mvp.model.RouteInfoModel}   Модель маршрута
 	 	 */
 	 	 getRouteInfoByID : function(routeID){
 	 	 	if(this.__routesList == null)
 	 	 		return null;
 	 	 	for(var i = 0; i < this.__routesList.length; i++){
 	 	 		if(routeID == this.__routesList[i].getId()){
 	 	 			return this.__routesList[i];
 	 	 		}
 	 	 	}
 	 	 	return null;
 	 	 },

 	 	 /**
 	 	  * Показывает, есть ли маршрут с таким же номером в списке. (Внимание, т.к. номера маршрутов в списке хранятся только
 	 	  * на языке текущей локали, сравнение выполняется только по одному языку).
 	 	  * @param  number {String}   Номер маршрута
 	 	  * @param  excludeRouteID {Integer} ID языка, который не учавствует в проверке
 	 	  * @return {Boolean}  True : маршрут с таким номер есть в списке. False : в противном случае.
 	 	  */
 	 	 isNumberExists : function(number, excludeRouteID){
 	 	 	for(var i=0;i < this.__routesList.length; i++){
 	 	 		var routeInfo = this.__routesList[i];
 	 	 		if(number.toString() == routeInfo.getNumber().toString()){
 	 	 			if(excludeRouteID != undefined && excludeRouteID != routeInfo.getId())
 	 	 				return true;
 	 	 		}
 	 	 	}
 	 	 	return false;
 	 	 	
 	 	 },

  	 	/**
 	 	 * Обновляет маршрут в списке.
 	 	 * @param  routeInfo {bus.admin.mvp.model.RouteInfoModel}  Информация о маршруте
 	 	 */
 	 	 update : function(routeInfo){
 	 	 	if(this.__routesList == null)
 	 	 		return;
 	 	 	for(var i = 0; i < this.__routesList.length; i++){
 	 	 		if(routeInfo.getId() == this.__routesList[i].getId()){
 	 	 			this.__routesList[i] = routeInfo;
 	 	 			break;
 	 	 		}
 	 	 	}	
 	 	 },

 	 	/**
 	 	 * Добавляет маршрут в список.
 	 	 * @param  routeInfo {bus.admin.mvp.model.RouteInfoModel}  Информация о маршруте
 	 	 */
 	 	 insert : function(routeInfo){
 	 	 	if(this.__routesList == undefined)
 	 	 		this.__routesList = [];
 	 	 	this.__routesList.push(routeInfo);
 	 	 },

 	 	/**
 	 	 * Удаляет маршрут из списка 
 	 	 * @param  routeID {Integer}  ID маршрута
 	 	 */
 	 	 remove : function(routeID){
 	 	 	if(this.__routesList == null)
 	 	 		return;
 	 	 	for(var i = 0; i < this.__routesList.length; i++){
 	 	 		if(routeID == this.__routesList[i].getId()){
 	 	 			this.__routesList.splice(i, 1);
 	 	 			break;
 	 	 		}
 	 	 	}	
 	 	 }

 	 	}

 	 });