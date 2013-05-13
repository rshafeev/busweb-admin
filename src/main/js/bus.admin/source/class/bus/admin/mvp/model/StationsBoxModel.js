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
 * Модель хранит набор моделей остановок, которые находятся в заданном кадрате. Каждая модель хранит id, название и местоположение остановки.
 * Пример:
 * <pre class="javascript">
 * var dataModel = [
 * {
 * 	  id : 1,
 * 	  name : "ст. Пушкинская",
 * 	  location : {
 * 	  		lat : 50.3242,
 * 	  		lon : 36.4444
 * 	  }
 * },
 * {
 * 	  id : 3,
 * 	  name : "ст. Университет",
 * 	  location : {
 * 	  		lat : 51.00,
 * 	  		lon : 37.333
 * 	  }
 * }
 *
 * ];
 * var model = new bus.admin.mvp.model.StationsBoxModel(dataModel); 
 * var st = model.getStationByID(3);
 * this.debug(st.getId());                 // print 3
 * this.debug(st.getName());			   // print ст. Университет
 * this.debug(st.getLocation().getLat());  // print 51.00
 * this.debug(st.getLocation().getLon());  // print 37.333
 * </pre>
 */
 qx.Class.define("bus.admin.mvp.model.StationsBoxModel", {
 	extend : Object,

 	/**
 	 * @param  dataModel {Object[]|null}  JS объект.
 	 */
 	 construct : function(dataModel) {
 	 	this.__stations = [];
 	 	if(dataModel != undefined){
 	 		this.fromDataModel(dataModel);
 	 	}
 	 },


 	 properties : {

 	 	/**
 	 	 * ID города
 	 	 */
 	 	 cityID : {
 	 	 	nullable : true,
 	 	 	check : "Integer"
 	 	 },

 	 	/**
 	 	 * ID города
 	 	 */
 	 	 langID : {
 	 	 	nullable : true,
 	 	 	check : "String"
 	 	 },

 	 	 /**
 	 	  *  Левая верхняя точка прямоугольной области
 	 	  * @type {bus.admin.mvp.model.geom.PointModel}
 	 	  */
 	 	  ltPoint : {
 	 	  	nullable : true,
 	 	  	check : "bus.admin.mvp.model.geom.PointModel"
 	 	  },

 	 	 /**
 	 	  * Права нижняя точка прямоугольной области
 	 	  * @type {bus.admin.mvp.model.geom.PointModel}
 	 	  */
 	 	  rbPoint : {
 	 	  	nullable : true,
 	 	  	check : "bus.admin.mvp.model.geom.PointModel"
 	 	  }


 	 	},
 	 	members : 
 	 	{
 	 	/**
 	 	 * Массив станций
 	 	 * @type {bus.admin.mvp.model.geom.StationModel[]}
 	 	 */
 	 	 __stations : null,

 	 	/**
 	 	 * Возвращает массив объектов, каждый из которых является моделью станции. Каждая модель имеет следующие функции структуру:
 	 	 * @return {bus.admin.mvp.model.geom.StationModel[]} Массив станций.
 	 	 */
 	 	 getStations : function(){
 	 	 	return this.__stations;
 	 	 },

 		/**
 		  * Формирует модель из JS объекта. <br>
 		  * Как правило, объект  dataModel получают путем десериализации JSON строки, полученной от сервера. Объект dataModel является массивом объектов,
 		  * каждый из которых должен иметь следующие свойства:
 		  * <br>
 		  * <pre>
 		  * <ul>
 		  * <li> cityID     ID города, Integer</li>
 		  * <li> langID     ID языка(ru,en,uk), String</li>
 		  * <li> ltPoint    Левая верхняя точка прямоугольной области, Object </li>
 		  * <li> rbPoint    Права нижняя точка прямоугольной области, Object </li>
 		  * <ul>
 		  * </pre>
 		  * @param  dataModel {Object}  JS объект.
 		  */
 		  fromDataModel : function(dataModel){
 		  	if(dataModel == undefined)
 		  		return;
 		  	if(dataModel.cityID != undefined)
 		  		this.setCityID(dataModel.cityID);
 		  	if(dataModel.langID != undefined)
 		  		this.setLangID(dataModel.langID);
 		  	if(dataModel.ltPoint != undefined)
 		  		this.setLtPoint(new bus.admin.mvp.model.geom.PointModel(dataModel.ltPoint));
 		  	if(dataModel.rbPoint != undefined)
 		  		this.setRbPoint(new bus.admin.mvp.model.geom.PointModel(dataModel.rbPoint));
 		  	if(dataModel.stations != undefined){
 		  		this.__stations = [];
 		  		for(var i = 0; i < dataModel.stations.length; i++){
 		  			var stModel = new bus.admin.mvp.model.StationModel(dataModel.stations[i]);
 		  			this.__stations.push(stModel);
 		  		}
 		  	}
 		  	
 		  },


 		/**
 		 * Преобразует модель в JS объект, который можно в дальнейшем сериализовать в JSON строку и отправить на сервер.
 		 * @return {Object} JS объект.
 		 */
 		 toDataModel : function(){
 		 	var dataModel = {
 		 		cityID : this.getCityID(),
 		 		langID : this.getLangID(),
 		 		ltPoint : this.getLtPoint().toDataModel(),
 		 		rbPoint : this.getRbPoint().toDataModel()
 		 	}
 		 	return dataModel;
 		 },

 	 	/**
 	 	 * Возвращает модель станции по ID
 	 	 * @param  stationID {Integer}  ID станции
 	 	 * @return {Object}   Модель станции
 	 	 */
 	 	 getStationByID : function(stationID){
 	 	 	if(this.__stations == null)
 	 	 		return null;
 	 	 	for(var i = 0; i < this.__stations.length; i++){
 	 	 		if(stationID == this.__stations[i].getId()){
 	 	 			return this.__stations[i];
 	 	 		}
 	 	 	}
 	 	 	return null;
 	 	 }

 	 	}

 	 });