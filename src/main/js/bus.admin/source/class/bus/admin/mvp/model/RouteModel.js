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
 * Модель маршрута.
 */
 qx.Class.define("bus.admin.mvp.model.RouteModel", {
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

 	 	/**
 	 	 * ID города
 	 	 */
 	 	 cityID : {
 	 	 	init : 0,
 	 	 	check : "Integer"
 	 	 },

 	 	/**
 	 	 *  Тип маршрута. Возможные значения: "metro", "bus", "trolley", "tram" и др.
 	 	 */
 	 	 routeTypeID : {
 	 	 	init : "",
 	 	 	check : "String"
 	 	 },


 	 	 cost : {
 	 	 	init : 0.0,
 	 	 	check : "Number"
 	 	 },

 	 	/**
 	 	 * Ключ строковых констант названий остановки.
 	 	 */
 	 	 numberKey : {
 	 	 	init : 0,
 	 	 	check : "Integer"
 	 	 },


 	 	 directWay :{
 	 	 	init : null,
 	 	 	check : "bus.admin.mvp.model.route.RouteWayModel"
 	 	 },

 	 	 reverseWay :{
 	 	 	init : null,
 	 	 	check : "bus.admin.mvp.model.route.RouteWayModel"
 	 	 }



 	 	},
 	 	members : 
 	 	{

 	 	/**
 	 	 * Массив номеров маршрутов для всех языков
 	 	 * @type {Object}
 	 	 */
 	 	 __number : null,

 	 	/**
 	 	 * Задает номер маршрута в зависимости от языка.
 	 	 * @param langID {String} Код языка (Возможные значения смотрите в классе {@link bus.admin.AppProperties#LANGUAGES})
 	 	 * @param number {String} Номер маршрута. 
 	 	 */
 	 	 setNumber : function(langID, number){
 	 	 	if(this.__number != null)
 	 	 	{
 	 	 		for(var i=0;i < this.__number.length; i++){
 	 	 			if(this.__number[i].langID == langID){
 	 	 				this.__number[i].value = number;
 	 	 				return;
 	 	 			}
 	 	 		}
 	 	 	}
 	 	 	
 	 	 	if(this.__number == null)
 	 	 		this.__number = [];
 	 	 	this.__number.push({
 	 	 		id : null,
 	 	 		langID : langID,
 	 	 		value : number
 	 	 	}
 	 	 	);

 	 	 },

		/**
		 * Возвращает номер маршрута в зависимости от языка.
		 * @param  langID {String}  Код языка (Возможные значения смотрите в классе {@link bus.admin.AppProperties#LANGUAGES})
		 * @return {String|null} Название города.  
		 */
		 getNumber : function(langID) {
		 	var numb = this.__number;
		 	if(numb == null)
		 		return null;
		 	for (var i = 0; i < numb.length; i++) {
		 		if (numb[i].langID.toString() == langID.toString()) 
		 		{
		 			return numb[i].value;
		 		}
		 	}
		 	return null;
		 },


 		/**
 		 * Преобразует модель в JS объект, который можно в дальнейшем сериализовать в JSON строку и отправить на сервер.
 		 * @return {Object} JS объект.
 		 */
 		 toDataModel : function(){
 		 	var dataModel = {
 		 		id : this.getId(),
 		 		cityID : this.getCityID(),
 		 		routeTypeID : this.getRouteTypeID(),
 		 		cost : this.getCost(),
 		 		numberKey : this.getNumberKey(),
 		 		number : this.__number,
 		 		directWay : this.getDirectWay().toDataModel(),
 		 		reverseWay : this.getReverseWay().toDataModel() 		 		
 		 	}
 		 	return dataModel;
 		 },

 		 /**
 		  * Формирует модель из JS объекта. <br>
 		  * Как правило, объект  dataModel получают путем десериализации JSON строки, полученной от сервера. Объект dataModel должен иметь
 		  * следующие свойства:
 		  * <pre>
 		  * <ul>
 		  * <li> id          ID остановки, Integer</li>
 		  * <li> cityID      ID города, Integer</li>
 		  * <li> location    Местоположение, Object</li>
 		  * <li> names       Названия города на разных языках, Object[] </li>
 		  * <ul>
 		  * </pre>
 		  * @param  dataModel {Object}  JS объект.
 		  */
 		  fromDataModel : function(dataModel){
 		  	this.setId(dataModel.id);
 		  	this.setCityID(dataModel.cityID);
 		  	this.setNumberKey(dataModel.numberKey);
 		  	this.setCost(dataModel.cost);
 		  	
 		  	this.__number = dataModel.number;

 		  },

 		  /**
 		   * Возвращает местоположение города.
 		   * @return {Object} Местоположение города. Объект имеет функции getLat() и getLon().
 		   */
 		  getLocation : function(){
 		  	return this.__location;
 		  },

 		  /**
 		   * Устанавливает местоположение города.
 		   * @param lat {Number}  Широта
 		   * @param lon {Number}  Долгота
 		   */
 		  setLocation : function(lat, lon){
 		  	var loc = {
 		  		lat : lat,
 		  		lon : lon
 		  	};
 		  	this.__location = qx.data.marshal.Json.createModel(loc);
 		  },

 		  /**
 		   * Клонирует текущий объект.
 		   * @return {bus.admin.mvp.model.StationModel} Копия объекта.
 		   */
 		  clone : function(){
 		  	var copy = new bus.admin.mvp.model.StationModel(this.toDataModel());
 		  	return copy;
 		  }



 		}

 	});