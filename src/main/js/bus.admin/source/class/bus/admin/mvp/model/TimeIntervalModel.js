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
 	 construct : function(dataModel) {
 	 	if(dataModel != undefined){
 	 		this.fromDataModel(dataModel);
 	 	}
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
 		 * Преобразует модель в JS объект, который можно в дальнейшем сериализовать в JSON строку и отправить на сервер.
 		 * @return {Object} JS объект.
 		 */
 		 toDataModel : function(){
 		 	var dataModel = {
 		 		time : this.getSecs()

 		 	}
 		 	return dataModel;
 		 },


 		 /**
 		  * Формирует модель из JS объекта. <br>
 		  * Как правило, объект  dataModel получают путем десериализации JSON строки, полученной от сервера. Объект dataModel должен иметь
 		  * следующие свойства:
 		  * <pre>
 		  * <ul>
 		  * <li> time          Время в секундах, Integer</li>
 		  * <ul>
 		  * </pre>
 		  * @param  dataModel {Object}  JS объект.
 		  */
 		  fromDataModel : function(dataModel){
 		  	if(dataModel == undefined)
 		  		return;
 		  	if(dataModel.time != undefined)
 		  		this.setSecs(dataModel.time);
 		  },

 		  /**
 		   * Клонирует текущий объект.
 		   * @return {bus.admin.mvp.model.TimeIntervalModel} Копия объекта.
 		   */
 		   clone : function(){
 		   	var copy = new bus.admin.mvp.model.TimeIntervalModel(this.getSecs());
 		   	return copy;
 		   }



 		},

 		statics : {

 				/**
				 * Проверка регулярным выражением времени HH:MM
				 * 
				 * @param value {String} время  в формате HH:MM
				 * @return {Boolean} True: валидация прошла успешно
				 */
				 validate : function(value) {
					// validate if time has the format HH:MM
					var re = /^([0-1][0-9]|[2][0-3])(:([0-5][0-9])){1,2}$/i;
					return re.test(value);
				},

				/**
				 * Обработка HH:MM
				 * @param value {String} время  в формате HH:MM
				 * @return {Object} Обект в формате: {hh: {Integer}, mm : (Integer) }
				 */
				 parse : function(value) {
					// parse time HH:MM
					var time = value.split(":");
					return {
						hh : parseInt(time[0]),
						mm : parseInt(time[1])
					};
				},

				/**
				 * Преобразование в секунды
				 * @param value {String} время  в формате HH:MM
				 */
				 convertToSeconds : function(value) {
				 	if(value==null || value.toString().length == 0){
				 		return 0;
				 	}
				 	var time = value.split(":");
				 	var t = {
				 		hh : time[0],
				 		mm : time[1]
				 	};
				 	return (t.hh * 60 * 60 + t.mm * 60);
				 },

				 convertSecsToHHMM : function(secs) {
				 	var d = new Date();
				 	d.setTime(secs * 1000);
				 	var hours = parseInt(secs / 60 / 60).toString();
				 	var minutes = parseInt((secs - hours * 60 * 60) / 60)
				 	.toString();
				 	if (hours.length == 1) {
				 		hours = "0" + hours;
				 	}
				 	if (minutes.length == 1) {
				 		minutes = "0" + minutes;
				 	}
				 	return hours + ":" + minutes;
				 }


				}

			});