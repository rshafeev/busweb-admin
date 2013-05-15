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
 * Модель остановки.
 */
 qx.Class.define("bus.admin.mvp.model.StationModel", {
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
 	 	 	init : -1,
 	 	 	check : "Integer"
 	 	 },


 	 	/**
 	 	 * Название
 	 	 */
 	 	 name : {
 	 	 	nullable : true,
 	 	 	check : "String"
 	 	 },

 	 	 /**
 	 	  * Местоположение
 	 	  * @type {bus.admin.mvp.model.geom.PointModel}
 	 	  */
 	 	  location : {
 	 	  	nullable : true,
 	 	  	check : "bus.admin.mvp.model.geom.PointModel"
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
 		 		name : this.getName(),
 		 		location : this.getLocation().toDataModel()
 		 	}
 		 	return dataModel;
 		 },

 		 /**
 		  * Возвращает модель станции типа {@link bus.admin.mvp.model.StationModelEx}
 		  * @param langID {String} ID языка, для которого нужно присвоить название станции в модели modelEx
 		  * @return {bus.admin.mvp.model.StationModelEx} Модель станции
 		  */
 		 toModelEx : function(langID){
 		 	var modelEx = new bus.admin.mvp.model.StationModelEx();
 		 	modelEx.setId(this.getId());
 		 	modelEx.setLocation(this.getLocation().getLat(), this.getLocation().getLon());
 		 	modelEx.setName(langID, this.getName());
 		 	return modelEx;
 		 },

 		 /**
 		  * Формирует модель из JS объекта. <br>
 		  * Как правило, объект  dataModel получают путем десериализации JSON строки, полученной от сервера. Объект dataModel должен иметь
 		  * следующие свойства:
 		  * <pre>
 		  * <ul>
 		  * <li> id          ID остановки, Integer</li>
 		  * <li> name        Название станции, String</li>
 		  * <li> location    Местоположение, Object</li>
 		  * <ul>
 		  * </pre>
 		  * @param  dataModel {Object}  JS объект.
 		  */
 		  fromDataModel : function(dataModel){
 		  	if(dataModel == undefined)
 		  		return;
 		  	if(dataModel.id != undefined){
 		  		this.setId(dataModel.id);
 		  	}
 		  	if(dataModel.name != undefined){
 		  		this.setName(dataModel.name);
 		  	}
 		  	if(dataModel.location != undefined){
 		  		this.setLocation(new bus.admin.mvp.model.geom.PointModel(dataModel.location));
 		  	} 		  	
 		  	
 		  },


 		  /**
 		   * Клонирует текущий объект.
 		   * @return {bus.admin.mvp.model.StationModel} Копия объекта.
 		   */
 		   clone : function(){
 		   	var dataModel = this.toDataModel();
 		   	var copy = new bus.admin.mvp.model.StationModel(dataModel);
 		   	return copy;
 		   }



 		}

 	});