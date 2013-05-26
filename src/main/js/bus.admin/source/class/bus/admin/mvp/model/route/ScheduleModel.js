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
 qx.Class.define("bus.admin.mvp.model.route.ScheduleModel", {
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
 	 	 * ID расписания
 	 	 */
 	 	 id : {
 	 	 	nullable : true,
 	 	 	check : "Integer"
 	 	 },

 	 	/**
 	 	 * ID пути, к которому относится данное расписание
 	 	 */
 	 	 routeWayID : {
 	 	 	nullable : true,
 	 	 	check : "Integer"
 	 	 },

 	 	/**
 	 	  * Дни недели разбиты по группам. Для каждой группы отдельное расписание
 	 	  * @type {bus.admin.mvp.model.route.ScheduleGroupModel[]}
 	 	  */
 	 	  groups : {
 	 	  	nullable : true
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
 		 		routeWayID : this.getRouteWayID(),
 		 		groups :  [] 
 		 	};
 		 	var groups = this.getGroups();
 		 	if(groups != undefined){
 		 		for(var i = 0; i < groups.length; i++){
 		 			var grp = groups[i].toDataModel();
 		 			dataModel.groups.push(grp);
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
 		  * <li> id          ID расписания, Integer</li>
 		  * <li> routeWayID  ID пути, к которому относится данное расписание, Integer</li>
 		  * <li> groups      Дни недели разбиты по группам. Для каждой группы отдельное расписание, Object[]. </li>
 		  * <ul>
 		  * </pre>
 		  * @param  dataModel {Object}  JS объект.
 		  */
 		  fromDataModel : function(dataModel){
 		  	if(dataModel == undefined)
 		  		return;
 		  	if(dataModel.id != undefined)
 		  		this.setId(dataModel.id);
 		  	if(dataModel.routeWayID != undefined)
 		  		this.setRouteWayID(dataModel.routeWayID);
 		  	if(dataModel.groups != undefined){
 		  		var groups = [];
 		  		for(var i=0;i < dataModel.groups.length; i++){
 		  			groups.push(new bus.admin.mvp.model.route.ScheduleGroupModel(dataModel.groups[i]));
 		  		}
 		  		this.setGroups(groups);
 		  	}
 		  },

 		  /**
 		   * Добавляет группу
 		   * @param  groupModel {bus.admin.mvp.model.route.ScheduleGroupModel}  Новая группа
 		   * @return {bus.admin.mvp.model.route.ScheduleGroupModel}            Добавленая группа
 		   */
 		   addGroup : function(groupModel){
 		   	var groups = this.getGroups();
 		   	if(groups == undefined)
 		   		groups = [];
 		   	if(groupModel.getId() <= 0){
 		   		groupModel.setId(-groups.length -1);
 		   	}
 		   	groups.push(groupModel);
 		   	this.setGroups(groups);
 		   	return groupModel;
 		   },

 		  /**
 		   * Возвращает группу по ID
 		   * @param  groupID {Integer}  ID группы
 		   * @return {bus.admin.mvp.model.route.ScheduleGroupModel|null} Модель группы 
 		   */
 		   getGroupByID : function(groupID){
 		   	var groups = this.getGroups();
 		   	if(groups == undefined)
 		   		return null;
 		   	for(var i=0;i < groups.length; i++){
 		   		if(groups[i].getId() == groupID)
 		   			return groups[i];
 		   	}
 		   	return null;
 		   },

 		   /**
 		    * Возвращает позицию группы дней в массиве
 		    * @param  groupID {Integer}  ID группы
 		    * @return {Integer} Позиция в массиве. В случае, если группа с переданным ID не найдена, функция возвращает -1.
 		    */
 		    getGroupPosition : function(groupID){
 		    	var groups = this.getGroups();
 		    	if(groups == undefined)
 		    		return -1;
 		    	for(var i=0;i < groups.length; i++){
 		    		if(groups[i].getId() == groupID)
 		    			return i;
 		    	}
 		    	return -1;
 		    },

 		    /**
 		     * Выполняет оптимизацию групп дней. Удаляет пустые группы, вводит "all", если имеется только одна группа
 		     */
 		     optimize : function(){
 		     	var arr = [];
 		     	var groups  = this.getGroups();
 		     	for(var i=0;i < groups.length; i++){
 		     		if( groups[i].getDays() != undefined  && groups[i].getDays().length > 0 && groups[i].getDays().length < 7)
 		     		{
 		     			arr.push(groups[i]);
 		     		}else
 		     		if(groups[i].getDays() != undefined  &&  groups[i].getDays().length == 7){
 		     			groups[i].setDays(["all"]);
 		     			arr.push(groups[i]);
 		     		}
 		     	}
 		     	this.setGroups(arr);
 		     },

 		 /**
 		  * Формирует модель из данных об интервале движения, начале и окончании работы по маршруту <br>
 		  * @param  timeA {Integer}  Начало работы, сек.
 		  * @param  timeB{Integer}  Конец работы, сек.
 		  * @param  frequency {Integer} Интервал движения, сек.
 		  */
 		  fromSimple : function(timeA, timeB, frequency){
 		  	this.setId(-1);
 		  	this.setRouteWayID(-1);
 		  	var group = new bus.admin.mvp.model.route.ScheduleGroupModel();
 		  	group.setId(-1);
 		  	group.setDays(["all"]);
 		  	group.setTimetable([{
 		  		freq  : frequency,
 		  		timeA : timeA,
 		  		timeB : timeB
 		  	}]);
 		  	this.addGroup(group);
 		  },



 		  /**
 		   * Клонирует текущий объект.
 		   * @return {bus.admin.mvp.model.route.ScheduleModel} Копия объекта.
 		   */
 		   clone : function(){
 		   	var copy = new bus.admin.mvp.model.route.ScheduleModel(this.toDataModel());
 		   	return copy;
 		   }



 		}

 	});