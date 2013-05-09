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
 	 	 * ID маршрута
 	 	 */
 	 	 id : {
 	 	 	init : -1,
 	 	 	check : "Integer"
 	 	 },

 	 	/**
 	 	 * ID города
 	 	 */
 	 	 cityID : {
 	 	 	init : -1,
 	 	 	check : "Integer"
 	 	 },

 	 	/**
 	 	 *  Тип маршрута. Возможные значения: "metro", "bus", "trolley", "tram" и др.
 	 	 */
 	 	 routeTypeID : {
 	 	 	init : "",
 	 	 	check : "String"
 	 	 },

 	 	 /**
 	 	  * Стоимость маршрута.
 	 	  */
 	 	  cost : {
 	 	  	init : 0.0,
 	 	  	check : "Number"
 	 	  },

 	 	/**
 	 	 * Ключ строковых констант номеров маршрута.
 	 	 */
 	 	 numberKey : {
 	 	 	init : 0,
 	 	 	check : "Integer"
 	 	 },

 	 	 /**
 	 	  * Прямой путь
 	 	  */
 	 	  directWay :{
 	 	  	check : "bus.admin.mvp.model.route.RouteWayModel",
 	 	  	nullable : true
 	 	  },

 	 	 /**
 	 	  * Обратный путь
 	 	  */
 	 	  reverseWay :{
 	 	  	check : "bus.admin.mvp.model.route.RouteWayModel",
 	 	  	nullable : true
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
 	 	 			if(this.__number[i].lang == langID){
 	 	 				this.__number[i].value = number;
 	 	 				return;
 	 	 			}
 	 	 		}
 	 	 	}
 	 	 	
 	 	 	if(this.__number == null)
 	 	 		this.__number = [];
 	 	 	this.__number.push({
 	 	 		id : null,
 	 	 		lang : langID,
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
		 		if (numb[i].lang.toString() == langID.toString()) 
		 		{
		 			return numb[i].value;
		 		}
		 	}
		 	return null;
		 },

		 /**
		  * Возвращает массив номеров для разных языков
		  * @return {Object[]} Массив номеров для разных языков
		  */
		 getNumbers : function(){
		 	return this.__number;

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
 		 		directWay : null,
 		 		reverseWay : null		 		
 		 	}
 		 	if(this.getDirectWay() != null){
 		 		dataModel.directWay = this.getDirectWay().toDataModel();
 		 	}
 		 	if(this.getReverseWay() != null){
 		 		dataModel.reverseWay = this.getReverseWay().toDataModel();
 		 	}
 		 	return dataModel;
 		 },

 		 /**
 		  * Формирует модель из JS объекта. <br>
 		  * Как правило, объект  dataModel получают путем десериализации JSON строки, полученной от сервера. Объект dataModel должен иметь
 		  * следующие свойства:
 		  * <pre>
 		  * <ul>
 		  * <li> id          ID маршрута, Integer</li>
 		  * <li> cityID      ID города, Integer</li>
 		  * <li> routeTypeID Тип маршрута, String</li>
 		  * <li> cost        Стоимость проезда, Number </li>
 		  * <li> numberKey   Ключ строковых констант номеров маршрута, Integer </li>
 		  * <li> number      Номера маршрута на разных языках, Object </li>
 		  * <li> directWay   Прямой путь, Object </li>
 		  * <li> reverseWay  Обратный путь, Object </li>
 		  * <ul>
 		  * </pre>
 		  * @param  dataModel {Object}  JS объект.
 		  */
 		  fromDataModel : function(dataModel){
 		  	this.setId(dataModel.id);
 		  	this.setCityID(dataModel.cityID);
 		  	this.setNumberKey(dataModel.numberKey);
 		  	this.setCost(dataModel.cost);
 		  	this.setRouteTypeID(dataModel.routeTypeID);
 		  	this.setDirectWay(new bus.admin.mvp.model.route.RouteWayModel(dataModel.directWay));
 		  	this.setReverseWay(new bus.admin.mvp.model.route.RouteWayModel(dataModel.reverseWay));
 		  	this.__number = dataModel.number;

 		  },

 		  /**
 		   * Возвращает путь в зависимости от направления.
 		   * @param direction  {Boolean}  Направление
 		   * @return  {bus.admin.mvp.model.route.RouteWayModel} Модель пути
 		   */
 		   getWayByDirection : function (direction)
 		   {
 		   	if (direction == true)
 		   		return this.getDirectWay();
 		   	return this.getReverseWay();
 		   },

 		  /**
 		   * Клонирует текущий объект.
 		   * @return {bus.admin.mvp.model.RouteModel} Копия объекта.
 		   */
 		   clone : function(){
 		   	var copy = new bus.admin.mvp.model.RouteModel(this.toDataModel());
 		   	return copy;
 		   },


 		   /**
 		    * Одинаково ли пишется номер маршрута на разных языках?
 		    * @return {Boolean} True: одинаково. False : нет.
 		    */
 		    isSameNumbers : function(){
 		    	var langs  = bus.admin.AppProperties.LANGUAGES;
 		    	var numb = this.getName(langs[0].id);
 		    	for(var i=1;i < langs.length; i++){
 		    		if(numb.toString() != this.getName(langs[i].id).toString() )
 		    			return false;
 		    	}
 		    	return true;

 		    }



 		}

 	});