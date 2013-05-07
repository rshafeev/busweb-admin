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

 qx.Class.define("bus.admin.mvp.model.route.RouteRelationModel", {
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
 	 	 * ID дуги
 	 	 */
 	 	 id : {
 	 	 	init : 0,
 	 	 	check : "Integer"
 	 	 },

 	 	/**
 	 	 * ID пути, которому принадлежит данная дуга
 	 	 */
 	 	 routeWayID : {
 	 	 	init : 0,
 	 	 	check : "Integer"
 	 	 },

 	 	 /**
 	 	  * Порядковый номер дуги в последовательности. Первая луга имеет порядковый номер 0.
 	 	  */
 	 	 index : {
 	 	 	init : false,
 	 	 	check : "Integer"
 	 	 },


		/**
	 	 *  Географическая длина дуги ,м. Если данная дуга стоит первая в последовательности, то 0.
	 	 */
	 	 distance : {
	 	 	init : 0.0,
	 	 	check : "Number"
	 	 },

 	 	/**
 	 	 * Среднее временя передвижения по данной дуге на транспорте. Если данная дуга стоит первая в 
 	 	 * последовательности, то null.
 	 	 */
 	 	 move : {
 	 	 	init : null,
 	 	 	check : "bus.admin.mvp.model.TimeIntervalModel"
 	 	 },

 	 	 /**
 	 	  * Полилиния, описывающая передвижение от станции предыдущей дуги к станции текущей дуги.
 	 	  *Если данная дуга стоит первая в последовательности, то null.
 	 	  */
 	 	 geom : {
 	 	 	init : null,
 	 	 	check : "bus.admin.mvp.model.geom.PolyLineModel"
 	 	 },

  	 	 /**
 	 	  * Станция, являющ. концом текущей дуги.
 	 	  */
 	 	 currStation : {
 	 	 	init : null,
 	 	 	check : "bus.admin.mvp.model.StationModel"
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
 		 		routeWayID: this.getRouteWayID(),
 		 		index: this.getIndex(),
 		 		distance: this.getDistance(),
 		 		move: this.getMove().toDataModel(),
 		 		geom: this.getGeom().toDataModel(),
 		 		currStation: this.getCurrStation().toDataModel()

 		 	}
 		 	return dataModel;
 		 },

 		 /**
 		  * Формирует модель из JS объекта. <br>
 		  * Как правило, объект  dataModel получают путем десериализации JSON строки, полученной от сервера. Объект dataModel должен иметь
 		  * следующие свойства:
 		  * <pre>
 		  * <ul>
 		  * <li> id           ID дуги, Integer</li>
 		  * <li> routeWayID   ID пути, Integer</li>
 		  * <li> index        Порядковый номер дуги, Integer. </li>
 		  * <li> distance     Расстояние, Number </li>
 		  * <li> move         Время движения, Object </li>
 		  * <li> geom         Геоточки, Number[][] </li>
 		  * <li> currStation  Текущая станция, Object </li>
 		  * <ul>
 		  * </pre>
 		  * @param  dataModel {Object}  JS объект.
 		  */
 		  fromDataModel : function(dataModel){
 		  	this.setId(dataModel.id);
 		  	this.setRouteWayID(dataModel.routeWayID);
 		  	this.setIndex(dataModel.index);
 		  	this.setDistance(dataModel.distance);
 		  	this.setMove(new bus.admin.mvp.model.TimeIntervalModel(dataModel.move));
 		  	this.setGeom(new bus.admin.mvp.model.geom.PolyLineModel(dataModel.geom));
 		  	this.setCurrStation(new bus.admin.mvp.model.StationModel(dataModel.currStation));
 		  },

 		  /**
 		   * Клонирует текущий объект.
 		   * @return {bus.admin.mvp.model.route.RouteRelationModel} Копия объекта.
 		   */
 		   clone : function(){
 		   	var copy = new bus.admin.mvp.model.route.RouteRelationModel(this.toDataModel());
 		   	return copy;
 		   }



 		}

 	});