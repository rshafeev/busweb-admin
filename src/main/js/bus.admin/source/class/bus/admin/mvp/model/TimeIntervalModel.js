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
 * Интервал времени.
 */
 qx.Class.define("bus.admin.mvp.model.TimeIntervalModel", {
 	extend : Object,

 	/**
 	 * В конструктор передается JS объект, который имеет следующий формат:
 	 * 
 	 * @param  dataModel {Object|null}  JS объект.
 	 */
 	 construct : function(secs) {
 	 	this.setSecs(secs);
 	 },

 	 properties : {

 	 	/**
 	 	 * Интервал в секундах
 	 	 */
 	 	 secs : {
 	 	 	init : 0,
 	 	 	check : "Number"
 	 	 }

 	 	},
 	 	members : 
 	 	{

 		  /**
 		   * Клонирует текущий объект.
 		   * @return {bus.admin.mvp.model.TimeIntervalModel} Копия объекта.
 		   */
 		  clone : function(){
 		  	var copy = new bus.admin.mvp.model.TimeIntervalModel(this.getSecs());
 		  	return copy;
 		  }



 		}

 	});