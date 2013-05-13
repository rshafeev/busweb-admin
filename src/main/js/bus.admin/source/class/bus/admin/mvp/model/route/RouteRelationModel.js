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
 	 	 	nullable : true,
 	 	 	check : "Integer"
 	 	 },

 	 	/**
 	 	 * ID пути, которому принадлежит данная дуга
 	 	 */
 	 	 routeWayID : {
 	 	 	nullable : true,
 	 	 	check : "Integer"
 	 	 },

 	 	 /**
 	 	  * Порядковый номер дуги в последовательности. Первая луга имеет порядковый номер 0.
 	 	  */
 	 	  index : {
 	 	  	nullable : true,
 	 	  	check : "Integer"
 	 	  },


		/**
	 	 *  Географическая длина дуги ,м. Если данная дуга стоит первая в последовательности, то 0.
	 	 */
	 	 distance : {
	 	 	nullable : true,
	 	 	check : "Number"
	 	 },

 	 	/**
 	 	 * Среднее временя передвижения по данной дуге на транспорте. Если данная дуга стоит первая в 
 	 	 * последовательности, то null.
 	 	 */
 	 	 move : {
 	 	 	nullable : true,
 	 	 	check : "bus.admin.mvp.model.TimeIntervalModel"
 	 	 },

 	 	 /**
 	 	  * Полилиния, описывающая передвижение от станции предыдущей дуги к станции текущей дуги.
 	 	  *Если данная дуга стоит первая в последовательности, то null.
 	 	  */
 	 	  geom : {
 	 	  	nullable : true,
 	 	  	check : "bus.admin.mvp.model.geom.PolyLineModel"
 	 	  },

  	 	 /**
 	 	  * Станция, являющ. концом текущей дуги.
 	 	  */
 	 	  currStation : {
 	 	  	nullable : true,
 	 	  	check : "bus.admin.mvp.model.StationModelEx"
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
 		 		distance: this.getDistance()
 		 	};
 		 	if(this.getGeom() != undefined)
 		 		dataModel.geom =  this.getGeom().toDataModel();
 		 	if(this.getMove() != undefined)
 		 		dataModel.move =  this.getMove().toDataModel();
 		 	if(this.getCurrStation() != undefined)
 		 		dataModel.currStation =  this.getCurrStation().toDataModel();

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
 		  	if(dataModel == undefined)
 		  		return;
 		  	if(dataModel.id !=undefined)
 		  		this.setId(dataModel.id);
 		  	if(dataModel.routeWayID !=undefined)
 		  		this.setRouteWayID(dataModel.routeWayID);
 		  	if(dataModel.index !=undefined)
 		  		this.setIndex(dataModel.index);
 		  	if(dataModel.distance !=undefined)
 		  		this.setDistance(dataModel.distance);
 		  	if(dataModel.move !=undefined)
 		  		this.setMove(new bus.admin.mvp.model.TimeIntervalModel(dataModel.move));
 		  	if(dataModel.geom !=undefined)
 		  		this.setGeom(new bus.admin.mvp.model.geom.PolyLineModel(dataModel.geom));
 		  	if(dataModel.currStation !=undefined)
 		  		this.setCurrStation(new bus.admin.mvp.model.StationModelEx(dataModel.currStation));
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