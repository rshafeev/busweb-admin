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
 * Данная модель представляет собой контейнер моделей городов и имеет ряд функций для работы с ними.
 */
 qx.Class.define("bus.admin.mvp.model.CitiesModel", {
 	extend : Object,

 	/**
 	 * В конструктор передается JS объект, который имеет следующий формат:
 	 * @param  dataModel {Object[]|null}  JS объект.
 	 */
 	 construct : function(dataModel) {
 	 	if(dataModel != undefined){
 	 		this.fromDataModel(dataModel);
 	 	}

 	 },

 	 members : {
 		/**
 		 * Массив городов
 		 * @type {bus.admin.mvp.model.CityModel[]}
 		 */
 		 _cities : null,

 		/**
 		 * Возвращает количество городов  моделе
 		 * @return {Integer} Количество городов
 		 */
 		size : function(){
 			if(this._cities == undefined)
 				return 0;
 			return this._cities.length;
 		},

 		/**
 		 * Возвращает все города.
 		 * @return {bus.admin.mvp.model.CityModel[]} Массив моделей городов.
 		 */
 		 getAllCities : function(){
 		 	return this._cities;
 		 },

 		/**
 		 * Добавляет город.
 		 * @param  cityModel {bus.admin.mvp.model.CityModel}  Модель города.
 		 */
 		 insertCity : function(cityModel) {
 		 	this._cities.push(cityModel);
 		 },

 		 /**
 		  * Удаляет город.
 		  * @param  cityID {Integer}  ID города.
 		  */
 		  removeCity : function(cityID) {
 		  	var cities = this._cities;
 		  	if (cities == null)
 		  		return;
 		  	for (var i = 0; i < cities.length; i++) {
 		  		if (cityID == cities[i].getId()) {
 		  			cities.splice(i, 1);
 		  			return;
 		  		}
 		  	}
 		  },

 		 /**
 		  * Обновляет модель города. А точнее, вначале удаляет город с ID равный oldID, а затем добавляет город newCityModel
 		  * @param  oldID {Integer}  ID города, который нужно обновить.
 		  * @param  newCityModel {bus.admin.mvp.model.CityModel}  Новая модель города.
 		  */
 		  updateCity : function(oldID, newCityModel) {
 		  	var cities = this._cities;
 		  	if (cities == null)
 		  		return;
 		  	for (var i = 0; i < cities.length; i++) {
 		  		if (oldID == cities[i].getId()) {
 		  			cities[i] = newCityModel;
 		  			return;
 		  		}
 		  	}
 		  	return;
 		  },

 		/**
 		 * Возвращает модель города по ID.
 		 * @param  id {Integer} ID города.
 		 * @return {bus.admin.mvp.model.CityModel}    Модель города.
 		 */
 		 getCityByID : function(id) {
 		 	var cities = this._cities;
 		 	if (cities == null)
 		 		return null;
 		 	for (var i = 0; i < cities.length; i++) {
 		 		if (cities[i].getId() == id) {
 		 			return cities[i];
 		 		}
 		 	}
 		 	return null;

 		 },

 		/**
 		 * Возвращает модель города по назнанию.
 		 * @param  name {String} Название города.
 		 * @param  lang {String} ID языка названия города name.
 		 * @return {bus.admin.mvp.model.CityModel} Модель города. 
 		 */
 		 getCityByName : function(name, lang) {
 		 	var cities = this.getData();
 		 	if (cities == null || name == null || lang == null)
 		 		return null;
 		 	for (var i = 0; i < cities.length; i++) 
 		 	{
 		 		for (var j = 0; j < cities[i].names.length; j++) 
 		 		{
 		 			if (cities[i].names[j].lang_id.toString() == lang
 		 				.toString()
 		 				&& cities[i].names[j].value.toString() == name
 		 				.toString()) 
 		 			{
 		 				return cities[i];
 		 			}
 		 		}

 		 	}
 		 	return null;
 		 },

 		/**
 		 * Преобразует модель в JS объект, который можно в дальнейшем сериализовать в JSON строку и отправить на сервер.
 		 * @return {Object[]} JS объект.
 		 */
 		 toDataModel : function(){
 		 	var dataModel = {
 		 		cities : []
 		 	};
 		 	for(var i=0; i < this._cities.length; i++)
 		 	{
 		 		dataModel.cities.push(this._cities[i].toDataModel());
 		 	}
 		 	return dataModel;
 		 },

 		 /**
 		  * Формирует модель из JS объекта. <br>
 		  * Как правило, объект  dataModel получают путем десериализации JSON строки, полученной от сервера. 
 		  * Объект dataModel является массивом объектов, из которых можно сформировать модели городов.
 		  * Описание свойств данных объектов приведено в {@link bus.admin.mvp.model.CityModel#fromDataModel}. 
 		  * @param  dataModel {Object}  JS объект.
 		  */
 		  fromDataModel : function(dataModel){
 		  	if(dataModel == undefined)
 		  		return;
 		  	this._cities = [];
 		  	var citiesData = dataModel.cities;
 		  	for(var i=0; i < citiesData.length; i++)
 		  	{
 		  		this._cities.push(new bus.admin.mvp.model.CityModel(citiesData[i]));
 		  	}
 		  }




 		}
 	});