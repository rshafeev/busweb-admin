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
 	 	 	init : 0,
 	 	 	check : "Integer"
 	 	 },

 	 	 cost : {
 	 	 	init : 0.0,
 	 	 	check : "Number"
 	 	 },

 	 	 number : {
 	 	 	init : "",
 	 	 	check : "String"
 	 	 },

 	 	 startWork : {
 	 	 	nullable : true,
 	 	 	check : "bus.admin.mvp.model.TimeIntervalModel"
 	 	 },

 	 	 finishWork : {
 	 	 	nullable : true,
 	 	 	check : "bus.admin.mvp.model.TimeIntervalModel"
 	 	 },

 	 	 minInterval : {
 	 	 	nullable : true,
 	 	 	check : "bus.admin.mvp.model.TimeIntervalModel"
 	 	 },

 	 	 maxInterval : {
 	 	 	nullable : true,
 	 	 	check : "bus.admin.mvp.model.TimeIntervalModel"
 	 	 },

 	 	 startStation : {
 	 	 	init : "",
 	 	 	check : "String"
 	 	 },

 	 	 finishStation : {
 	 	 	init : "",
 	 	 	check : "String"
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
 		 		startWork : this.getStartWork().toDataModel(),
 		 		finishWork : this.getFinishWork().toDataModel(),
 		 		minInterval :  this.getMinInterval().toDataModel(),
 		 		maxInterval : this.getMaxInterval().toDataModel(),
 		 		startStation : this.getStartStation(),
 		 		finishStation : this.getFinishStation() 
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
 		  	this.setId(dataModel.id);
 		  	this.setCost(dataModel.cost);
 		  	this.setNumber(dataModel.number);
 		  	this.setStartWork(new bus.admin.mvp.model.TimeIntervalModel(dataModel.startWork));
 		  	this.setFinishWork(new bus.admin.mvp.model.TimeIntervalModel(dataModel.finishWork));
 		  	this.setMinInterval(new bus.admin.mvp.model.TimeIntervalModel(dataModel.minInterval));
 		  	this.setMaxInterval(new bus.admin.mvp.model.TimeIntervalModel(dataModel.maxInterval));
 		  	this.setStartStation(dataModel.startStation);
 		  	this.setFinishStation(dataModel.finishStation);
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