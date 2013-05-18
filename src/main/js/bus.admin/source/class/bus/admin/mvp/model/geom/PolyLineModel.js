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
 * Модель геолинии.
 */
 qx.Class.define("bus.admin.mvp.model.geom.PolyLineModel", {
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

 	 	
 	 },
 	 members : 
 	 {

 	 	/**
 	 	 * Точки полилинии 
 	 	 * @type {Number[][]}
 	 	 */
 	 	 __points : null,


 		/**
 		 * Преобразует модель в JS объект, который можно в дальнейшем сериализовать в JSON строку и отправить на сервер.
 		 * @return {Object} JS объект.
 		 */
 		 toDataModel : function(){
 		 	var dataModel = {
 		 		points: this.__points
 		 	}
 		 	return dataModel;
 		 },

 		 /**
 		  * Формирует модель из JS объекта. <br>
 		  * Как правило, объект  dataModel получают путем десериализации JSON строки, полученной от сервера. Объект dataModel должен иметь
 		  * следующие свойства:
 		  * <pre>
 		  * <ul>
 		  * <li> points          массив геоточек, Number[][]</li>
 		  * <ul>
 		  * </pre>
 		  * @param  dataModel {Object}  JS объект.
 		  */
 		  fromDataModel : function(dataModel){
 		  	this.__points = dataModel.points;
 		  },

 		  /**
 		   * Возвращает точки.
 		   * @return {Number[][]} Точки.
 		   */
 		   getPoints : function ()
 		   {
 		   	return this.__points;
 		   },

  		  /**
 		   * Устанавливает точки в массив
 		   * @param  points  {Number[][]} Точки.
 		   */		  
 		   setPoints : function(points){
 		   	this.__points = points;
 		   },

 		  /**
 		   * Устанавливает значение точки в массиве
 		   * @param  index {Integer}  Порядковый номер точки в массиве
 		   * @param  lat {Number}    Широта
 		   * @param  lon {Number}    Долгота
 		   */
 		   setPoint : function(index, lat, lon){
 		   	if(this.__points == undefined || index >= this.__points.length){
 		   		return;
 		   	}
 		   	this.__points[index] = [lat, lon];
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