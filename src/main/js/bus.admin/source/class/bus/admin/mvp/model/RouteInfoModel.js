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
 * Модель маршрута (общая информация).
 */
 qx.Class.define("bus.admin.mvp.model.RouteInfoModel", {
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
 	 	 * ID остановки
 	 	 */
 	 	 id : {
 	 	 	nullable : true,
 	 	 	check : "Integer"
 	 	 },

 	 	 /**
 	 	  * Стоимость проезда
 	 	  * @type {Number}
 	 	  */
 	 	 cost : {
 	 	 	nullable : true,
 	 	 	check : "Number"
 	 	 },

 	 	 /**
 	 	  * Номер маршрута в текущей локали
 	 	  * @type {String}
 	 	  */
 	 	 number : {
 	 	 	nullable : true,
 	 	 	check : "String"
 	 	 },


 	 	 /**
 	 	  * Включен ли маршрут в транспортный граф?
 	 	  * @type {Object}
 	 	  */
 	 	 visible : {
  	 	 	nullable : true,
 	 	 	check : "Boolean"	 	 	
 	 	 }


 	 	},
 	 	members : 
 	 	{


 		/**
 		 * Преобразует модель в JS объект, который можно в дальнейшем сериализовать в JSON строку и отправить на сервер.
 		 * @return {Object} JS объект.
 		 */
 		 toDataModel : function(){
 		 	var dataModel = {
 		 		id : this.getId(),
 		 		number : this.getNumber(),
 		 		cost : this.getCost(),
 		 		visible : this.getVisible()
 		 		
 		 	}
 		 	return dataModel;
 		 },

 		 /**
 		  * Формирует модель из JS объекта. <br>
 		  * Как правило, объект  dataModel получают путем десериализации JSON строки, полученной от сервера. Объект dataModel должен иметь
 		  * следующие свойства:
 		  * <pre>
 		  * <ul>
 		  * <li> id            ID остановки, Integer</li>
 		  * <li> number        Номер маршрута, String</li>
 		  * <li> startWork     Начало работы по данному маршруту (сек), Number</li>
 		  * <li> finishWork    Конец  работы по данному маршруту (сек), Number </li>
 		  * <li> interval      Интервал движения, (сек), Number</li> 
 		  * <li> startStation  Начальная остановка, String </li>
 		  * <li> finishStation Конечная остановка, String</li>
 		  * <ul>
 		  * </pre>
 		  * @param  dataModel {Object}  JS объект.
 		  */
 		  fromDataModel : function(dataModel){
 		  	if(dataModel == undefined)
 		  		return;
 		  	if(dataModel.id != undefined)
 		  		this.setId(dataModel.id);
 		  	if(dataModel.cost != undefined)
 		  		this.setCost(dataModel.cost);
 		  	if(dataModel.number != undefined)
 		  		this.setNumber(dataModel.number);
 		  	else
 		  		this.setNumber("");
 		  	if(dataModel.visible != undefined)
 		  		this.setVisible(dataModel.visible);
 		  },

 		  /**
 		   * Формирует модель из модели маршрута
 		   * @param  routeModel{bus.admin.mvp.model.RouteModel}  Модель маршрута
 		   * @param  langID {String} ID языка
 		   */
 		   fromRoute : function(routeModel, langID){
 		   	this.setId(routeModel.getId());
 		   	this.setCost(routeModel.getCost());
 		   	this.setNumber(routeModel.getNumber(langID));
 		   	this.setVisible(routeModel.getVisible())
 		   },


 		  /**
 		   * Клонирует текущий объект.
 		   * @return {bus.admin.mvp.model.RouteInfoModel} Копия объекта.
 		   */
 		   clone : function(){
 		   	var copy = new bus.admin.mvp.model.RouteInfoModel(this.toDataModel());
 		   	return copy;
 		   }



 		}

 	});