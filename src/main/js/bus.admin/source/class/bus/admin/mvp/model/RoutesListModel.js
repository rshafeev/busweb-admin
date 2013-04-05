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
 	 	 * @type {Object}
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
 	 	 * @return {Oject[]} Массив моделей маршрутов.
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
 	 		this.__routesList = [];
 	 		for(var i = 0; i < dataModel.length; i++){
 	 			this.__routesList.push(qx.data.marshal.Json.createModel(dataModel[i]));
 	 		}
 	 	},

 	 	/**
 	 	 * Возвращает модель маршрута по ID
 	 	 * @param  routeID {Integer}  ID маршрута
 	 	 * @return {Object}   Модель маршрута
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
 	 	 * Формирут модель маршрута из входных параметров и добавляет в список.
 	 	 * @param  routeID {Integer}  ID маршрута
 	 	 * @param  routeNumber {String} Номер маршрута
 	 	 * @param  routeNumber {Number} Стоимость проезда
 	 	 */
 	 	insert : function(routeID, routeNumber, routeCost){
 	 		var model = {
 	 			id : routeID,
 	 			number : routeNumber,
 	 			cost : routeCost
 	 		};
 	 		if(this.__routesList == undefined)
 	 			this.__routesList = [];
 	 		this.__routesList.push(qx.data.marshal.Json.createModel(model));
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