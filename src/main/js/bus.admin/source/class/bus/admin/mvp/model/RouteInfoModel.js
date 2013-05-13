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

 	 	 cost : {
 	 	 	nullable : true,
 	 	 	check : "Number"
 	 	 },

 	 	 number : {
 	 	 	nullable : true,
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
 	 	 	nullable : true,
 	 	 	check : "String"
 	 	 },

 	 	 finishStation : {
 	 	 	nullable : true,
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
 		  	if(dataModel == undefined)
 		  		return;
 		  	if(dataModel.id != undefined)
 		  		this.setId(dataModel.id);
 		  	if(dataModel.cost != undefined)
 		  		this.setCost(dataModel.cost);
 		  	if(dataModel.number != undefined)
 		  		this.setNumber(dataModel.number);
 		  	if(dataModel.startWork != undefined)
 		  		this.setStartWork(new bus.admin.mvp.model.TimeIntervalModel(dataModel.startWork));
 		  	if(dataModel.finishWork != undefined)
 		  		this.setFinishWork(new bus.admin.mvp.model.TimeIntervalModel(dataModel.finishWork));
 		  	if(dataModel.minInterval != undefined)
 		  		this.setMinInterval(new bus.admin.mvp.model.TimeIntervalModel(dataModel.minInterval));
 		  	if(dataModel.maxInterval != undefined)
 		  		this.setMaxInterval(new bus.admin.mvp.model.TimeIntervalModel(dataModel.maxInterval));
 		  	if(dataModel.startStation != undefined)
 		  		this.setStartStation(dataModel.startStation);
 		  	if(dataModel.finishStation != undefined)
 		  		this.setFinishStation(dataModel.finishStation);
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