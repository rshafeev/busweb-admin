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
 * Модель хранит список остановок.
 */
 qx.Class.define("bus.admin.mvp.model.StationsListModel", {
 	extend : Object,

 	/**
 	 * В конструктор передается JS объект, который имеет следующий формат:
 	 * 
 	 * @param  dataModel {Object|null}  JS объект.
 	 */
 	 construct : function(dataModel) {
 	 	this.__stationsList = [];
 	 	if(dataModel != undefined){
 	 		this.fromDataModel(dataModel);
 	 	}
 	 },

 	 members : 
 	 {
 	 	/**
 	 	 * Список моделей станций
 	 	 * @type {Object}
 	 	 */
 	 	__stationsList : null,


 	 	/**
 	 	 * Возвращает массив объектов, каждый из которых является моделью станции. Каждая модель имеет следующие функции структуру:
  		 * <br>
 		 * <pre>
 		 * <ul>
 		 * <li> getId(), getId()              ID станции, Integer. </li>
 		 * <li> getName(), setName()          Название, String. </li>
 		 * <ul>
 		 * </pre>
 	 	 * @return {Oject[]} Массив станций.
 	 	 */
 	 	getAll : function(){
 	 		return this.__stationsList;
 	 	},

  		/**
 		  * Формирует модель из JS объекта. <br>
 		  * Как правило, объект  dataModel получают путем десериализации JSON строки, полученной от сервера. Объект dataModel является массивом объектов,
 		  * каждый из которых должен иметь следующие свойства:
 		  * <br>
 		  * <pre>
 		  * <ul>
 		  * <li> id          ID станции, Integer</li>
 		  * <li> name        Название станции, String </li>
 		  * <ul>
 		  * </pre>
 		  * @param  dataModel {Object[]}  JS объект.
 		  */	 	
 	 	fromDataModel : function(dataModel){
 	 		this.__stationsList = [];
 	 		for(var i = 0; i < dataModel.length; i++){
 	 			if(dataModel[i].name == undefined){
 	 				dataModel[i].name = "";
 	 			}
 	 			this.__stationsList.push(qx.data.marshal.Json.createModel(dataModel[i]));
 	 		}
 	 	},

 	 	/**
 	 	 * Возвращает модель станции по ID
 	 	 * @param  stationID {Integer}  ID станции
 	 	 * @return {Object}   Модель станции
 	 	 */
 	 	getStationByID : function(stationID){
 	 		if(this.__stationsList == null)
 	 			return null;
 	 		for(var i = 0; i < this.__stationsList.length; i++){
 	 			if(stationID == this.__stationsList[i].getId()){
 	 				return this.__stationsList[i];
 	 			}
 	 		}
 	 		return null;
 	 	},

 	 	/**
 	 	 * Формирут модель остановки из входных параметров и добавляет в список.
 	 	 * @param  stationID {Integer}  ID станции
 	 	 * @param  stationName {String} Название станции
 	 	 */
 	 	insert : function(stationID, stationName){
 	 		var model = {
 	 			id : stationID,
 	 			name : stationName
 	 		};
 	 		if(this.__stationsList == undefined)
 	 			this.__stationsList = [];
 	 		this.__stationsList.push(qx.data.marshal.Json.createModel(model));
 	 	},

 	 	/**
 	 	 * Удаляет остановку из списка 
 	 	 * @param  stationID {Integer}  ID станции
 	 	 */
 	 	remove : function(stationID){
 	 		if(this.__stationsList == null)
 	 			return;
 	 		for(var i = 0; i < this.__stationsList.length; i++){
 	 			if(stationID == this.__stationsList[i].getId()){
 	 				this.__stationsList.splice(i, 1);
 	 				break;
 	 			}
 	 		}	
 	 	}

 	 }

 	});