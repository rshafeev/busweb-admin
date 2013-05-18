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
 	 	 	nullable : true,
 	 	 	check : "Integer"
 	 	 },

 	 	/**
 	 	 * ID маршрута, которому принадлежит данный путь
 	 	 */
 	 	 routeID : {
 	 	 	nullable : true,
 	 	 	check : "Integer"
 	 	 },

 	 	 /**
 	 	  * Прямой или обратный путь?
 	 	  */
 	 	  direct : {
 	 	  	nullable : true,
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
          * Обновляет дугу, причем обновляются только те поля, которые не null
          * @param  stationBID {Integer} ID конечной станции, к которой привязывается полилиния
          * @param  relationModel {bus.admin.mvp.model.route.RouteRelationModel}  Дуга
          * @return {bus.admin.mvp.model.route.RouteRelationModel}  обновленная дуга
          */
          updateRelation : function(stationBID, relationModel){
            var r = this.getRelationByStationBID(stationBID);
            if(r != undefined)
               r.fromDataModel(relationModel.toDataModel());
            return r;
         },

        /**
 	 	   * Есть ли такая станция в пути?
 	 	   * @param  stationID {Integer}  ID станции
 	 	   * @return {Boolean}   True: есть.
 	 	   */
          isStationExists: function(stationID){
            var relations = this.getRelations();
            if(relations == undefined)
              return false;
           for(var i = 0; i < relations.length; i++){
              if(relations[i].getCurrStation().getId() == stationID){
                return true;
             }
          }	 		
          return false;
       },

 	 	/**
 	 	 * Возвращает предыдущую дугу
 	 	 * @param  relationModel {bus.admin.mvp.model.route.RouteRelationModel} Текущая дуга
 	 	 * @return {bus.admin.mvp.model.route.RouteRelationModel|null}  Предыдущая дуга
 	 	 */
 	 	 getPrevRelation : function(relationModel){
 	 	 	var relations = this.getRelations();
 	 	 	if(relationModel == undefined || relations == undefined)
 	 	 		return null;

 	 	 	for(var i = 0; i < relations.length; i++){
 	 	 		if(relations[i].getCurrStation().getId() == relationModel.getCurrStation().getId()){
 	 	 			if(i > 0)
 	 	 				return relations[i-1];
 	 	 		}
 	 	 	}

 	 	 	return null;
 	 	 },

       /**
        * Возвращает дугу, у которой конечной вершиной выступает остановка с ID равным stationBID
        * @param  stationBID {Integer}  ID конечной станции
        * @return {bus.admin.mvp.model.route.RouteRelationModel|null} Дуга
        */
        getRelationByStationBID : function(stationBID){
         var relations = this.getRelations();
         if(stationBID == undefined || relations == undefined)
            return null;

         for(var i = 0; i < relations.length; i++){
            if(relations[i].getCurrStation().getId() == stationBID){
               return relations[i];
            }
         }

         return null;
      },


 	 	/**
 	 	 * Возвращает следующую дугу
 	 	 * @param  relationModel {bus.admin.mvp.model.route.RouteRelationModel} Текущая дуга
 	 	 * @return {bus.admin.mvp.model.route.RouteRelationModel|null}  Следующая дуга
 	 	 */
 	 	 getNextRelation : function(relationModel){
 	 	 	var relations = this.getRelations();
 	 	 	if(relationModel == undefined || relations == undefined)
 	 	 		return null;

 	 	 	for(var i = 0; i < relations.length; i++){
 	 	 		if(relations[i].getCurrStation().getId() == relationModel.getCurrStation().getId()){
 	 	 			if(i < relations.length - 1)
 	 	 				return relations[i+1];
 	 	 		}
 	 	 	}
 	 	 	return null;
 	 	 },

 	 	/** Удаляет станции из пути.
         * <br><br>Свойства возвращаемого объекта: <br>      
         * <pre>
         * <ul>
         * <li> oldRelation       Модель измененной  дуги, {@link bus.admin.mvp.model.route.RouteRelationModel RouteRelationModel} </li>
         * <li> relation          Новая модель дуги, {@link bus.admin.mvp.model.route.RouteRelationModel RouteRelationModel </li>
         * <li> operation         Операция, которая была произведена над дугой ("insert", "remove", "update"), String </li>
         * <ul>
         * </pre>
 	 	 * @param  stationID Integer}  Модель станции
 	 	 * @param  position {Integer} Положение станции относительно остальных станций
 	 	 * @return {Object[]}   Правки пути.
 	 	 */
 	 	 removeStation : function(stationID){
 	 	 	// Проверка входных данных
 	 	 	var result = [];
 	 	 	var relations = this.getRelations();
 	 	 	if(relations == undefined)
 	 	 		return [];
 	 	 	var position = null; // индекс станции, которую нужно удалить
 	 	 	for(var i = 0;i <  relations.length; i++){
 	 	 		if(relations[i].getCurrStation().getId() == stationID){
 	 	 			position = i;
 	 	 			break;
 	 	 		}
 	 	 	} 	 	 	
 	 	 	if(position == null)
 	 	 		return [];
 	 	 	
 	 	 	// Удалим дугу с данной станцией 
 	 	 	result.push({
 	 	 		relation : relations[position],
 	 	 		operation : "remove"
 	 	 	});
 	 	 	relations.splice(position, 1);

 	 	 	// обновим индексы
 	 	 	for(var i = position;i <  relations.length; i++){
 	 	 		relations[i].setIndex(i);
 	 	 	}
 	 	 	
 	 	 	if(position < relations.length){
 	 	 		// Пересчитаем первую точку geom для следующей дуги (ее индекс теперь равен position, т.к. перед ней мы удалили дугу)
 	 	 		var geom = relations[position].getGeom();
 	 	 		if(position == 0)
 	 	 			geom = null;
 	 	 		else
 	 	 		{
 	 	 			var prevStation = relations[position - 1].getCurrStation();
 	 	 			geom.setPoint(0, prevStation.getLocation().getLat(),  prevStation.getLocation().getLon());
 	 	 		}
 	 	 		relations[position].setGeom(geom);
 	 	 		var points = [];

 	 	 		result.push({
 	 	 			relation : relations[position],
 	 	 			operation : "update"
 	 	 		});
 	 	 	}
 	 	 	this.setRelations(relations);
 	 	 	return result;
 	 	 },

 	 	/** Добавляет станцию к пути на указанную позицию.
         * <br><br>Свойства возвращаемого объекта: <br>      
         * <pre>
         * <ul>
         * <li> oldRelation       Модель измененной  дуги, {@link bus.admin.mvp.model.route.RouteRelationModel RouteRelationModel} </li>
         * <li> relation          Новая модель дуги, {@link bus.admin.mvp.model.route.RouteRelationModel RouteRelationModel </li>
         * <li> operation         Операция, которая была произведена над дугой ("insert", "remove", "update"), String </li>
         * <ul>
         * </pre>
 	 	 * @param  stationModel {bus.admin.mvp.model.StationModelEx}  Модель станции
 	 	 * @param  position {Integer} Положение станции относительно остальных станций
 	 	 * @return {Object[]}   Правки пути.
 	 	 */
 	 	 insertStation : function(stationModel, position){
 	 	 	// Проверка входных данных
 	 	 	var result = [];
 	 	 	var relations = this.getRelations();
 	 	 	if((relations != undefined && relations.length < position) ||
 	 	 		(relations == undefined && position > 0 ) )
 	 	 		return [];
 	 	 	if(relations == undefined)
 	 	 		relations = [];
 	 	 	for(var i = 0;i <  relations.length; i++){
 	 	 		if(relations[i].getCurrStation().getId() == stationModel.getId())
 	 	 			return [];
 	 	 	} 	 	 	

 	 	 	// обновим индексы
 	 	 	for(var i = position;i <  relations.length; i++){
 	 	 		relations[i].setIndex(i+1);
 	 	 	}
 	 	 	var newRelation = new bus.admin.mvp.model.route.RouteRelationModel();
 	 	 	newRelation.setRouteWayID(this.getId());
 	 	 	newRelation.setCurrStation(stationModel);
 	 	 	newRelation.setIndex(position);
 	 	 	result.push({
 	 	 		relation : newRelation,
 	 	 		operation : "insert"
 	 	 	});
 	 	 	
 	 	 	if(relations.length == 0){
 	 	 		// Если путь пустой
 	 	 		newRelation.setGeom(null);
 	 	 		//relations.push(newRelation);
 	 	 	}
 	 	 	else
 	 	 		if(position == relations.length){
 	 	 		// Если нужно добавить станцию вконец пути
 	 	 		var lastStation = relations[relations.length-1].getCurrStation();
 	 	 		var geom = new bus.admin.mvp.model.geom.PolyLineModel();
 	 	 		var points = [];
 	 	 		points.push([lastStation.getLocation().getLat(),  lastStation.getLocation().getLon()]);
 	 	 		points.push([stationModel.getLocation().getLat(), stationModel.getLocation().getLon()]);

 	 	 		newRelation.setGeom(new bus.admin.mvp.model.geom.PolyLineModel({points : points}));
 	 	 		// relations.push(newRelation);
 	 	 	}
 	 	 	else
 	 	 		if(position == 0){
 	 	 		// Если нужно добавить станцию в начало пути
 	 	 		var fistStation = relations[0].getCurrStation();
 	 	 		var points = [];
 	 	 		points.push([stationModel.getLocation().getLat(), stationModel.getLocation().getLon()]);
 	 	 		points.push([fistStation.getLocation().getLat(),  fistStation.getLocation().getLon()]);
 	 	 		relations[0].setGeom(new bus.admin.mvp.model.geom.PolyLineModel({points : points}));
 	 	 		// relations.splice(0, 0, newRelation);

 	 	 	}
 	 	 	else
 	 	 		if(position > 0){
 	 	 		// Если нужно добавить станцию по средине пути
 	 	 		var prevStation = relations[position-1].getCurrStation();
 	 	 		var nextStation = relations[position].getCurrStation();
 	 	 		
 	 	 		var points1 = [];
 	 	 		points1.push([prevStation.getLocation().getLat(),  prevStation.getLocation().getLon()]);
 	 	 		points1.push([stationModel.getLocation().getLat(), stationModel.getLocation().getLon()]);
 	 	 		newRelation.setGeom(new bus.admin.mvp.model.geom.PolyLineModel({points : points1}));

 	 	 		var points2 = [];
 	 	 		points2.push([stationModel.getLocation().getLat(), stationModel.getLocation().getLon()]);
 	 	 		points2.push([nextStation.getLocation().getLat(),  nextStation.getLocation().getLon()]);
 	 	 		relations[position].setGeom(new bus.admin.mvp.model.geom.PolyLineModel({points : points2}));

 	 	 		result.push({
 	 	 			relation : relations[position],
 	 	 			operation : "update"
 	 	 		});

 	 	 	}
 	 	 	if(relations.length == position)
 	 	 		relations.push(newRelation);
 	 	 	else
 	 	 		relations.splice(position, 0, newRelation);
 	 	 	// Сохраним дуги в свойство "relations" и вернем измененные дуги. 
 	 	 	this.setRelations(relations);
 	 	 	return result;
 	 	 },

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
 		 	if(relations != undefined){
 		 		for(var i=0;i < relations.length; i++){
 		 			dataModel.relations.push(relations[i].toDataModel());
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
 		  	if(dataModel == undefined)
 		  		return;
 		  	if(dataModel.id != undefined)
 		  		this.setId(dataModel.id);
 		  	if(dataModel.routeID != undefined)
 		  		this.setRouteID(dataModel.routeID);
 		  	if(dataModel.direct != undefined)
 		  		this.setDirect(dataModel.direct);
 		  	if(dataModel.schedule != undefined){
 		  		if(this.getSchedule() == undefined)
 		  			this.setSchedule(new bus.admin.mvp.model.route.ScheduleModel());
 		  		this.getSchedule().fromDataModel(dataModel.schedule);
 		  	}
 		  	if(dataModel.relations!=undefined){
 		  		var relations = [];
 		  		for(var i=0;i < dataModel.relations.length; i++){
 		  			var relationModel = new bus.admin.mvp.model.route.RouteRelationModel( dataModel.relations[i]);
 		  			relations.push(relationModel);
 		  		}
 		  		this.setRelations(relations);
 		  	}
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