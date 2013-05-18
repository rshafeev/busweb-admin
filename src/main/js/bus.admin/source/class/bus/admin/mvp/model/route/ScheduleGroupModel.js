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
 * Модель расписания маршрута. 
 */
 qx.Class.define("bus.admin.mvp.model.route.ScheduleGroupModel", {
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
 	 	 * ID группы
 	 	 */
 	 	 id : {
 	 	 	nullable : true,
 	 	 	check : "Integer"
 	 	 },


 	 	 /**
 	 	  * Дни недели группы
 	 	  * @type {String[]}
 	 	  */
 	 	  days : {
 	 	  	nullable : true
 	 	  },

 	 	 /**
 	 	   * Частота выезда в заданные промежутки времени
 	 	   * @type {Object[]}
 	 	   */
 	 	   timetable : {
 	 	   	nullable : true
 	 	   }

 	 	},
 	 	members : 
 	 	{

  		 /**
 		  * Возвращает ID всех дней, которые находятся в группе. Вместо "all" возвращает список всей дней недели.
 		  * @return {String[]} Дни недели
 		  */
 		  getAllDaysIds : function(){
 		  	if(this.getDays() == undefined || this.getDays().length ==0)
 		  		return [];
 		  	if(this.getDays()[0] == "all"){
 		  		var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
 		  		return days;
 		  	}
 		  	return this.getDays();

 		  },

 		/**
 		 * Преобразует модель в JS объект, который можно в дальнейшем сериализовать в JSON строку и отправить на сервер.
 		 * @return {Object} JS объект.
 		 */
 		 toDataModel : function(){
 		 	var dataModel = {
 		 		id : this.getId(),
 		 		days : bus.admin.helpers.ObjectHelper.clone(this.getDays()),
 		 		timetable : bus.admin.helpers.ObjectHelper.clone(this.getTimetable())
 		 	};
 		 	return dataModel;
 		 },


 		 /**
 		  * Формирует модель из JS объекта. <br>
 		  * Как правило, объект  dataModel получают путем десериализации JSON строки, полученной от сервера. Объект dataModel должен иметь
 		  * следующие свойства:
 		  * <pre>
 		  * <ul>
 		  * <li> id          ID группы, Integer</li>
 		  * <li> days        Дни недели, String[]</li>
 		  * <li> timetable   Расписание, Object[]. </li>
 		  * <ul>
 		  * </pre>
 		  * @param  dataModel {Object}  JS объект.
 		  */
 		  fromDataModel : function(dataModel){
 		  	if(dataModel == undefined)
 		  		return;
 		  	if(dataModel.id != undefined)
 		  		this.setId(dataModel.id);
 		  	if(dataModel.days != undefined)
 		  		this.setDays( bus.admin.helpers.ObjectHelper.clone(dataModel.days) );
 		  	if(dataModel.timetable != undefined)
 		  		this.setTimetable(bus.admin.helpers.ObjectHelper.clone(dataModel.timetable));
 		  },


 		  /**
 		   * Клонирует текущий объект.
 		   * @return {bus.admin.mvp.model.route.ScheduleModel} Копия объекта.
 		   */
 		   clone : function(){
 		   	var copy = new bus.admin.mvp.model.route.ScheduleGroupModel(this.toDataModel());
 		   	return copy;
 		   }



 		}

 	});