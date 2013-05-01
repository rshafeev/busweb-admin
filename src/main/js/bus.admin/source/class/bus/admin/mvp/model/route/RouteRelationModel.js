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
 	 	 * Задает название города.
 	 	 * @param langID {String} Код языка (Возможные значения смотрите в классе {@link bus.admin.AppProperties#LANGUAGES})
 	 	 * @param name {String}   Новое название города. 
 	 	 */
 	 	 setName : function(langID, name){
 	 	 	if(this.__names != null)
 	 	 	{
 	 	 		for(var i=0;i < this.__names.length; i++){
 	 	 			if(this.__names[i].lang == langID){
 	 	 				this.__names[i].value = name;
 	 	 				return;
 	 	 			}
 	 	 		}
 	 	 	}
 	 	 	
 	 	 	if(this.__names == null)
 	 	 		this.__names = [];
 	 	 	this.__names.push({
 	 	 		id : null,
 	 	 		lang : langID,
 	 	 		value : name
 	 	 	}
 	 	 	);

 	 	 },

		/**
		 * Возвращает назание города в зависимости от языка
		 * @param  langID {String}  Код языка (Возможные значения смотрите в классе {@link bus.admin.AppProperties#LANGUAGES})
		 * @return {String|null} Название города.  
		 */
		 getName : function(langID) {
		 	var names = this.__names;
		 	if(names == null)
		 		return null;
		 	for (var i = 0; i < names.length; i++) {
		 		if (names[i].lang.toString() == langID.toString()) 
		 		{
		 			return names[i].value;
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
 		 		key : this.getKey(),
 		 		show : this.getShow(),
 		 		nameKey : this.getNameKey(),
 		 		scale : this.getScale(),
 		 		names : this.__names,
 		 		location : {
 		 			lat : this.getLocation().getLat(),
 		 			lon : this.getLocation().getLon()
 		 		}
 		 	}
 		 	return dataModel;
 		 },

 		 /**
 		  * Формирует модель из JS объекта. <br>
 		  * Как правило, объект  dataModel получают путем десериализации JSON строки, полученной от сервера. Объект dataModel должен иметь
 		  * следующие свойства:
 		  * <pre>
 		  * <ul>
 		  * <li> id          ID города, Integer</li>
 		  * <li> location    Местоположение, Object</li>
 		  * <li> scale       Масштаб, Integer. </li>
 		  * <li> names       Названия города на разных языках, Object[] </li>
 		  * <li> isShow      Видимость города, String </li>
 		  * <ul>
 		  * </pre>
 		  * @param  dataModel {Object}  JS объект.
 		  */
 		  fromDataModel : function(dataModel){
 		  	this.setLocation(dataModel.location.lat, dataModel.location.lon);
 		  	this.setScale(dataModel.scale);
 		  	this.setId(dataModel.id);
 		  	this.setKey(dataModel.key);
 		  	this.setShow(dataModel.show);
 		  	this.setNameKey(dataModel.nameKey);
 		  	this.__names = dataModel.names;
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
 		   * @return {bus.admin.mvp.model.CityModel} Копия объекта.
 		   */
 		   clone : function(){
 		   	var copy = new bus.admin.mvp.model.CityModel(this.toDataModel());
 		   	return copy;
 		   }



 		}

 	});