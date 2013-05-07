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
 * Модель пути маршрута. Каждый маршрут имеет два пути: прямой и обратный. Объект класса RouteWayModel хранит последовательность
 * остановок, посещаемых по данному марщруту, массив географических точек, описывающих путь, расписание выезда из начальной станции. 
 */
 qx.Class.define("bus.admin.mvp.model.route.RouteWayModel", {
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
 	 	 * ID пути
 	 	 */
 	 	 id : {
 	 	 	init : 0,
 	 	 	check : "Integer"
 	 	 },

 	 	/**
 	 	 * ID маршрута, которому принадлежит данный путь
 	 	 */
 	 	 routeID : {
 	 	 	init : 0,
 	 	 	check : "Integer"
 	 	 },

 	 	 /**
 	 	  * Прямой или обратный путь?
 	 	  */
 	 	 direct : {
 	 	 	init : false,
 	 	 	check : "Boolean"
 	 	 },


		/**
	 	 * Географическое описание пути. Данная коллекция хранит последовательность станций пути, географическое описание
	 	 * пути в виде массива точек между станциями.
	 	 *  @type {bus.admin.mvp.model.route.RouteRelationModel[]}
	 	 */
	 	 relations : {
	 	 	nullable : true
	 	 },

 	 	/**
 	 	 * Расписание выезда из начальной станции.
 	 	 */
 	 	 schedule : {
 	 	 	nullable : true,
 	 	 	check : "bus.admin.mvp.model.route.ScheduleModel"
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
 		 		routeID : this.getRouteID(),
 		 		direct : this.getDirect(),
 		 		relations : [],
 		 		schedule : this.getSchedule().toDataModel()
 		 	}
 		 	var relations = this.getRelations();
 		 	for(var i=0;i < relations.length; i++){
 		 		dataModel.relations.push(relations[i].toDataModel());
 		 	}
 		 	return dataModel;
 		 },

 		 /**
 		  * Формирует модель из JS объекта. <br>
 		  * Как правило, объект  dataModel получают путем десериализации JSON строки, полученной от сервера. Объект dataModel должен иметь
 		  * следующие свойства:
 		  * <pre>
 		  * <ul>
 		  * <li> id          ID пути, Integer</li>
 		  * <li> routeID     ID маршрута, Object</li>
 		  * <li> direct      Направление, Boolean. </li>
 		  * <li> relations   Географическое описание пути, Object[] </li>
 		  * <li> schedule    Расписание, Object </li>
 		  * <ul>
 		  * </pre>
 		  * @param  dataModel {Object}  JS объект.
 		  */
 		  fromDataModel : function(dataModel){
 		  	this.setId(dataModel.id);
 		  	this.setRouteID(dataModel.routeID);
 		  	this.setDirect(dataModel.direct);
 		  	this.setSchedule(new bus.admin.mvp.model.route.ScheduleModel(dataModel.schedule));
 		  	var relations = [];
 		  	for(var i=0;i < dataModel.relations.length; i++){
 		  		var relationModel = new bus.admin.mvp.model.route.RouteRelationModel( dataModel.relations[i]);
 		  		relations.push(relationModel);
 		  	}
 		  	this.setRelations(relations);
 		  },

 		  /**
 		   * Клонирует текущий объект.
 		   * @return {bus.admin.mvp.model.route.RouteWayModel} Копия объекта.
 		   */
 		   clone : function(){
 		   	var copy = new bus.admin.mvp.model.route.RouteWayModel(this.toDataModel());
 		   	return copy;
 		   }



 		}

 	});