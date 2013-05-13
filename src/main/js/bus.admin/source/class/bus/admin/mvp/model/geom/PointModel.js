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
 * Модель геоточки.
 */
 qx.Class.define("bus.admin.mvp.model.geom.PointModel", {
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
 	 	 * Широта
 	 	 */
 	 	 lat : {
 	 	 	init : 0.0,
 	 	 	check : "Number"
 	 	 },
 	 	 
 	 	 /**
 	 	  * Долгота
 	 	  */
 	 	 lon : {
 	 	 	init : 0.0,
 	 	 	check : "Number"
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
 		 		lat: this.getLat(),
 		 		lon : this.getLon()
 		 	}
 		 	return dataModel;
 		 },

 		 /**
 		  * Формирует модель из JS объекта. <br>
 		  * Как правило, объект  dataModel получают путем десериализации JSON строки, полученной от сервера. Объект dataModel должен иметь
 		  * следующие свойства:
 		  * <pre>
 		  * <ul>
 		  * <li> lat    Широта, Number</li>
 		  * <li> lon    Долгота, Number</li>
 		  * <ul>
 		  * </pre>
 		  * @param  dataModel {Object}  JS объект.
 		  */
 		  fromDataModel : function(dataModel){
 		  	this.setLat(dataModel.lat);
 		  	this.setLon(dataModel.lon);
 		  },


 		  /**
 		   * Клонирует текущий объект.
 		   * @return {bus.admin.mvp.model.geom.PolyLineModel} Копия объекта.
 		   */
 		   clone : function(){
 		   	var copy = new bus.admin.mvp.model.geom.PolyLineModel(this.toDataModel());
 		   	return copy;
 		   }

 		}

 	});