/*************************************************************************
 *
 * Copyright:
 * Bus.Admin-lib is copyright (c) 2012, {@link http://ways.in.ua} Inc. All Rights Reserved. 
 *
 * License:
 * Bus.Admin-lib is free software, licensed under the MIT license. 
 * See the file {@link http://api.ways.in.ua/license.txt|license.txt} in this distribution for more details.
 *
 * Authors:
 * Roman Shafeyev (rs@premiumgis.com)
 *
 *************************************************************************/

/**
 * Presenter страницы {@link bus.admin.view.Routes Routes}. Является посредником между хранилищем данных и представлением. 
 * После очередного действия пользователя представление ( {@link bus.admin.view.Routes} или его дочерние виджеты) вызывают триггер 
 * презентера. В функции триггера задается логика, которая обновляет данные хранилища (также, возможно изменение данных на сервере) и 
 * вызывает нужное событие (например, "refresh", "update_route"и др.). Слушатели событий получают обновленные данные из хранилища и обновляют view.
 * Слушателями событий данной класса выступают представление bus.admin.view.Routes и его дочерние виджеты. 
 */
 qx.Class.define("bus.admin.mvp.presenter.RoutesPresenter", {

 	extend : qx.core.Object,
  include : [bus.admin.mvp.presenter.mix.BoxStationsLoader],
  events : {

	   /**
 		  * Событие наступает после загрузки страницы или после нажатия на кнопку "Refresh".
 		  * <br><br>Свойства возвращаемого объекта: <br> 		 
 		  * <pre>
 		  * <ul>
 		  * <li> cities          Список городов, {@link bus.admin.mvp.model.CitiesModel CitiesModel}. </li>
 		  * <li> langs           Список языков,  {@link bus.admin.mvp.model.LanguagesModel LanguagesModel}. </li>
 		  * <li> routeTypes      Типы маршрутов, Object[] </li>
 		  * <li> error           Наличие ошибки при выполнении события, Boolean. </li>
 		  * <li> errorCode       Код ошибки, String. </li>
 		  * <li> errorRemoteInfo Описание ошибки с сервера, String. </li>
 		  * <li> sender          Объект, который вызвал триггер, Object </li>
 		  * <ul>
 		  * </pre>
 		  */
      "refresh"     : "qx.event.type.Data",

     /**
      * Событие наступает после изменения текущего города или типа маршрутов. (Также при обновлении страницы).
      * <br><br>Свойства возвращаемого объекта: <br>         
      * <pre>
      * <ul>
      * <li> routesList      Список маршрутов, {@link bus.admin.mvp.model.RoutesListModel RoutesListModel}. </li>
      * <li> error           Наличие ошибки при выполнении события, Boolean. </li>
      * <li> errorCode       Код ошибки, String. </li>
      * <li> errorRemoteInfo Описание ошибки с сервера, String. </li>
      * <li> sender          Объект, который вызвал триггер, Object </li>
      * <ul>
      * </pre>
      */
      "load_routes_list" : "qx.event.type.Data",

    /**
     * Событие наступает при изменении состояния страницы. Например, при создании нового маршрута.
       * <br><br>Свойства возвращаемого объекта: <br>      
     * <pre>
     * <ul>
     * <li> oldState  Старое состояние,  String. </li>
     * <li> newState  Новое состояние, String. </li>
     * <li> sender    Объект, который вызвал триггер, Object </li>
     * <ul>
     * </pre>
     */
     "change_state" : "qx.event.type.Data",

      /**
       * Событие наступает после выбора города.
       * <br><br>Свойства возвращаемого объекта: <br>         
       * <pre>
       * <ul>
       * <li> city   Выбранный город, {@link bus.admin.mvp.model.CitiesModel CitiesModel}</li>
       * <li> centering_map   Центрирование карты, Boolean  </li>
       * <li> sender Объект, который вызвал триггер, Object </li>
       * <ul>
       * </pre>
       */        
       "select_city" : "qx.event.type.Data",

      /**
       * Событие наступает после добавления нового маршрута в серверную БД.
       * <br><br>Свойства возвращаемого объекта: <br>      
       * <pre>
       * <ul>
       * <li> route           Модель нового маршрута, {@link bus.admin.mvp.model.RouteModel RouteModel} </li>
       * <li> centering_map   Центрирование карты, Boolean  </li>
       * <li> error           Наличие ошибки при выполнении события, Boolean. </li>
       * <li> errorCode       Код ошибки, String. </li>
       * <li> errorRemoteInfo Описание ошибки с сервера, String. </li>
       * <li> sender          Объект, который вызвал триггер, Object </li>
       * <ul>
       * </pre>
       */    
       "insert_route" : "qx.event.type.Data",

      /**
       * Событие наступает после удаления маршрута из БД.
       * <br><br>Свойства возвращаемого объекта: <br>      
       * <pre>
       * <ul>
       * <li> routeID         ID удаленного маршрута, Integer </li>
       * <li> error           Наличие ошибки при выполнении события, Boolean. </li>
       * <li> errorCode       Код ошибки, String. </li>
       * <li> errorRemoteInfo Описание ошибки с сервера, String. </li>
       * <li> sender          Объект, который вызвал триггер, Object </li>
       * <ul>
       * </pre>
       */    
       "remove_route" : "qx.event.type.Data",

      /**
       * Событие наступает после выбора маршрута в таблице.
       * <br><br>Свойства возвращаемого объекта: <br>      
       * <pre>
       * <ul>
       * <li> route           Выбранный маршрут, {@link bus.admin.mvp.model.RouteModel RouteModel} </li>
       * <li> prevRoute       Предыдущий выбранный маршрут, {@link bus.admin.mvp.model.RouteModel RouteModel} </li>
       * <li> centering_map   Центрирование карты, Boolean  </li>
       * <li> error           Наличие ошибки при выполнении события, Boolean. </li>
       * <li> errorCode       Код ошибки, String. </li>
       * <li> errorRemoteInfo Описание ошибки с сервера, String. </li>
       * <li> sender          Объект, который вызвал триггер, Object </li>
       * <ul>
       * </pre>
       */    
       "select_route" : "qx.event.type.Data",

      /**
       * Событие наступает после изменения направления.
       * <br><br>Свойства возвращаемого объекта: <br>      
       * <pre>
       * <ul>
       * <li> direction       Направление (прямое/обратное), Boolean </li>
       * <li> sender          Объект, который вызвал триггер, Object </li>
       * <ul>
       * </pre>
       */ 
       "change_direction" : "qx.event.type.Data",


      /**
       * Событие наступает после изменения данных маршрута на сервере.
       * <br><br>Свойства возвращаемого объекта: <br>      
       * <pre>
       * <ul>
       * <li> route             Обновленная модель маршрута, {@link bus.admin.mvp.model.RouteModel RouteModel} </li>
       * <li> requestRoute      Модель маршрута, которая была отправлена на обновление (Может хранить не все данные маршрута, а только те, 
       *                        которые нужно обновить), {@link bus.admin.mvp.model.RouteModel RouteModel} </li>
       * <li> sender            Объект, который вызвал триггер, Object </li>
       * <ul>
       * </pre>
       */ 
       "update_route" : "qx.event.type.Data",


      /**
       * Событие наступает после добавления новой "prepared" станции на карту в процессе конструирования маршрута. Данная станция
       * не была занесена в БД, а только хранитс в dataStorage текущего презентера. Станции типа "prepared" нужны для конструирования маршрута 
       * и заносятся в БД только вместе с сохранением в ней обновленого/нового маршрута. Все станции "prepared" имеют уникальный ID, но с 
       * отрицательным знаком. 
       * <br><br>Свойства возвращаемого объекта: <br>      
       * <pre>
       * <ul>
       * <li> station           Модель новой станции, {@link bus.admin.mvp.model.StationModelEx StationModelEx} </li>
       * <ul>
       * </pre>
       */ 
       "insert_prepared_station" : "qx.event.type.Data",

      /**
       * Событие наступает после изменения  "prepared" станции. 
       * <br><br>Свойства возвращаемого объекта: <br>      
       * <pre>
       * <ul>
       * <li> station           Модель станции, {@link bus.admin.mvp.model.StationModelEx StationModelEx} </li>
       * <ul>
       * </pre>
       */ 
       "update_prepared_station" : "qx.event.type.Data",



      /**
       * Событие наступает после добавления/изменения(geom, станции)/удаления дуги пути. 
       * <br><br>Свойства возвращаемого объекта: <br>      
       * <pre>
       * <ul>
       * <li> relation          Новая модель дуги, {@link bus.admin.mvp.model.route.RouteRelationModel RouteRelationModel </li>
       * <li> operation         Операция, которая была произведена над дугой ("insert", "remove", "update"), String </li>
       * <ul>
       * </pre>
       */ 
       "update_way_relations" : "qx.event.type.Data"


     },

     construct : function() {
      this.base(arguments);
      var dataStorage = new bus.admin.mvp.storage.RoutesPageDataStorage();
      this.initDataStorage(dataStorage);
    },

    properties : {
 		/**
 		 * Хранилище данных страницы Routes
 		 * @type {bus.admin.mvp.storage.RoutesPageDataStorage}
 		 */
 		 dataStorage : {
 		 	deferredInit : true
 		 }
 		},

 		members : {
       
      /**
       * Удаляет маршрут
       * @param  routeID {bus.admin.mvp.model.RouteModel} Модель маршрута
       * @param  callback {Function}   Callback функиця
       * @param  sender {Object}       Объект, который вызвал триггер
       */
       removeRouteTrigger : function(routeID, callback, sender){

         var state = this.getDataStorage().getState();

         // Если страница находится в состоянии конструирования маршрута, то выходим.
         if(state != "none"){
          if(callback != undefined){
            callback({error: true});
          }
          return;
        }

        var dataRequest =  new bus.admin.net.DataRequest();
        dataRequest.Routes().remove(routeID, function(responce){
          var data = responce.getContent();
          this.debug("Routes: remove(): received route`s data");
          console.debug(data);
          var args ={};

          if(data == null || data.error != null)
          {
            args = {
              route : routeID,
              error  : true,
              errorCode : data.error != undefined ? data.error.code : "req_err",
              errorRemoteInfo :  data.error != undefined ? data.error.info : null
            };
          }
          else
          {
            var routeModel = new bus.admin.mvp.model.RouteModel(data);
            var langID = qx.core.Init.getApplication().getDataStorage().getLocale();

            args = {
              routeID : routeID,
              error  :  false,
              sender : sender
            };
            // Обновим список маршрутов
            var routesList = this.getDataStorage().getRoutesListModel();
            if(routesList != undefined){
              routesList.remove(routeID);
            }

            // Оповестим слушателей об удалении маршрута
            this.fireDataEvent("remove_route", args);

            // Если удаленный маршрут является текущим, уберем его.
            var route = this.getDataStorage().getSelectedRoute();
            if(route != undefined && route.getId() == routeID){
              var selectedArgs = {
                error  :  false,
                sender : sender,
                route : null,
                prevRoute : route
              };
              this.getDataStorage().setSelectedRoute(null);
              this.fireDataEvent("select_route", selectedArgs);
            }
          }
          
          if(callback != undefined)
            callback(args);
        },this);
        // exit
        return;
      },

      /**
       * Добавляет новый маршрут
       * @param  routeModel {bus.admin.mvp.model.RouteModel} Модель маршрута
       * @param  callback {Function}   Callback функиця
       * @param  sender {Object}       Объект, который вызвал триггер
       */
       insertRouteTrigger : function(routeModel, callback, sender){

         var state = this.getDataStorage().getState();

         // Если страница находится в состоянии конструирования маршрута, то выходим.
         if(state != "none"){
          if(callback != undefined){
            callback({error: true});
          }
          return;
        }

        var dataRequest =  new bus.admin.net.DataRequest();
        dataRequest.Routes().insert(routeModel, function(responce){
          var data = responce.getContent();
          this.debug("Routes: insert(): received route`s data");
          console.debug(data);
          var args ={};

          if(data == null || data.error != null)
          {
            args = {
              route : null,
              requestRoute : routeModel,
              error  : true,
              errorCode : data.error != undefined ? data.error.code : "req_err",
              errorRemoteInfo :  data.error != undefined ? data.error.info : null
            };
          }
          else
          {
            var routeModel = new bus.admin.mvp.model.RouteModel(data);
            var langID = qx.core.Init.getApplication().getDataStorage().getLocale();

            args = {
              route : routeModel,
              error  :  false,
              sender : sender
            };
            // Обновим список маршрутов
            var routesList = this.getDataStorage().getRoutesListModel();
            if(routesList != undefined){
              var routeInfo = new bus.admin.mvp.model.RouteInfoModel();
              routeInfo.fromRoute(routeModel, langID);
              routesList.insert(routeInfo);
            }

            // Оповестим слушателей о добавлении нового маршрута
            this.fireDataEvent("insert_route", args);

            // Сделаем новый маршрут текущим(выбранным)
            var selectedArgs = {
              error  :  false,
              sender : sender,
              route : routeModel
            };
            var prevRoute = this.getDataStorage().getSelectedRoute();
            if(prevRoute != undefined)
              selectedArgs.prevRoute = prevRoute.clone();
            else
              selectedArgs.prevRoute = null;
            selectedArgs.centering_map = true;
            if(args.error == false){
              this.getDataStorage().setSelectedRoute(routeModel);
              this.fireDataEvent("select_route", selectedArgs);
            }
          }
          
          if(callback != undefined)
            callback(args);
        },this);
        // exit
        return;
      },


      /**
       * Триггер обновления расписания выбранного пути.
       * @param  scheduleModel {bus.admin.mvp.model.route.ScheduleModel}  Новое расписание
       * @param  isBoth {Boolean}    Заменить расписание второго пути на scheduleModel тоже?
       * @param  callback {Function}  callback функция
       * @param  sender {Object}      Объект, который вызвал триггер
       */
       updateScheduleTrigger : function(scheduleModel, isBoth, callback, sender){
        this.debug("execute updateScheduleTrigger()");
        var route = this.getDataStorage().getSelectedRoute();

        if(route == undefined){
          if(callback != undefined )
            callback({error  : true});
          return;        
        }
        var selectedWay = this.getDataStorage().getSelectedWay();
        scheduleModel.optimize();
        if(this.getDataStorage().getState() == "make")
        {
         var schedule = scheduleModel.clone();
         schedule.setRouteWayID(selectedWay.getId());
         selectedWay.setSchedule(schedule);
         if(isBoth == true){
          var secondWay = route.getWayByDirection(!this.getDataStorage().getDirection());
          var secondSchedule = scheduleModel.clone();
          secondSchedule.setRouteWayID(secondWay.getId());
          secondWay.setSchedule(secondSchedule);
        }

        if(callback != undefined )
          callback({error  : false});
        return;     

      }

      if(this.getDataStorage().getState() == "none")
      {
        var updRoute = new bus.admin.mvp.model.RouteModel();
        var updSelectedWay = new bus.admin.mvp.model.route.RouteWayModel();
        var schedule = scheduleModel.clone();
        schedule.setRouteWayID(selectedWay.getId());

        if(selectedWay.getSchedule() != undefined){
          schedule.setId(selectedWay.getSchedule().getId());
        }
        updSelectedWay.setSchedule(schedule);
        updSelectedWay.setDirect(this.getDataStorage().getDirection());
        updRoute.setId(route.getId());
        updRoute.setWay(updSelectedWay);
        if(isBoth == true){
          var secondWay = route.getWayByDirection(!this.getDataStorage().getDirection());
          var updSecondWay = new bus.admin.mvp.model.route.RouteWayModel();
          var secondSchedule = schedule.clone();
          if(secondWay.getSchedule() != undefined){
            secondSchedule.setId(secondWay.getSchedule().getId());
          }
          secondSchedule.setRouteWayID(secondWay.getId());
          updSecondWay.setSchedule(secondSchedule);
          updSecondWay.setDirect(!this.getDataStorage().getDirection());
          updRoute.setWay(updSecondWay);
        }

        var update_callback = function(args){
          if(callback != undefined)
            callback(args);
        }
        this.updateRouteTrigger(updRoute, update_callback);

      } 
      //exit
    },

     /**
      * Триггер обновления дуги
      * @param  stationBID {Integer} ID конечной станции, к которой привязывается полилиния
      * @param  relationModel {bus.admin.mvp.model.route.RouteRelationModel}  Модель дуги
      * @param  callback {Function}  callback функция
      * @param  sender {Object}      Объект, который вызвал триггер
      */     
      updateWayRelationTrigger : function(stationBID, relationModel, callback, sender){
        this.debug("execute updateWayRelationTrigger()");
        if(this.getDataStorage().getState() != "make")
        {
          if(callback != undefined )
            callback({error  : true});
          return;
        }
        var routeWay = this.getDataStorage().getSelectedWay();
        var rel = routeWay.updateRelation(stationBID, relationModel);
        var args  =  {
          relation : rel,
          operation : "update",
          error : false,
          sender : sender
        };
        this.fireDataEvent("update_way_relations", args);

      },

     /**
      * Триггер вызывается для добавления станции к пути маршрута
      * @param  stationModel {bus.admin.mvp.model.StationModelEx}  Модель станции
      * @param  position {Integer} Положение станции относительно остальных станций
      * @param  callback {Function}  callback функция
      * @param  sender {Object}      Объект, который вызвал триггер
      */     
      includeStationToRouteWayTrigger : function(stationModel, position, callback, sender){
        this.debug("execute includeStationToRouteWayTrigger()");
        if(this.getDataStorage().getState() != "make")
        {
          if(callback != undefined || position < 0)
            callback({error  : true});
          return;
        }
        var routeWay = this.getDataStorage().getSelectedWay();
        var changes = routeWay.insertStation(stationModel, position);
        for(var i=0; i< changes.length; i++){
          var args  =  changes[i];
          args.error = false;
          args.sender = this;
          this.fireDataEvent("update_way_relations", args);
        }
      },

      /**
       * Исключает станцию из текущего пути
       * @param stationID  {Integer}  ID станции
       * @param  callback {Function}  callback функция
       * @param  sender {Object}      Объект, который вызвал триггер
       */
       excludeStationToRouteWayTrigger : function(stationID, callback, sender){
        this.debug("execute excludeStationToRouteWayTrigger()");
        if(this.getDataStorage().getState() != "make")
        {
          if(callback!=undefined)
            callback({error  : true});
          return;
        }
        var routeWay = this.getDataStorage().getSelectedWay();
        var changes = routeWay.removeStation(stationID);
        for(var i=0; i< changes.length; i++){
          var args  =  changes[i];
          args.error = false;
          args.sender = this;
          this.debug(args);
          this.fireDataEvent("update_way_relations", args);
        }
      },

 		   /**
 			* Триггер вызывается для обновления данных на странице
 			* @param  callback {Function}  callback функция
 			* @param  sender {Object}      Объект, который вызвал триггер
 			*/
 			refreshTrigger : function(callback, sender){
 				this.debug("execute refreshTrigger()");

 				var cities_callback = qx.lang.Function.bind(function(e) 
 				{
 					/**
 					 * Если выбранный город не сущестует в обновленном списке городов, тогда уберем выбранный город
 					 */
 					 if(this.getDataStorage().getCitiesModel().getCityByID(this.getDataStorage().getSelectedCityID()) == null)
 					 {
 					 	this.getDataStorage().setSelectedCityID(-1);
 					 }

 					 if(this.getDataStorage().getSelectedCityID() <= 0 && this.getDataStorage().getCitiesModel().size() >0)
 					 {
 					 	var selectedCityID = this.getDataStorage().getCitiesModel().getAllCities()[0].getId();
 					 	this.getDataStorage().setSelectedCityID(selectedCityID);
 					 }
 					 e.routeTypes = this.getDataStorage().getRouteTypes();
 					 e.sender = sender;
 					 if(e.error == false)
 					 {
 					 	this.fireDataEvent("refresh", e);
 					 }

 					 if(callback!= undefined)
 					 	callback(e);

 					 var isCenteringMap = (this.getDataStorage().getMapCenter() == undefined);
 					 if(this.getDataStorage().getSelectedCityID() > 0)
 					 {
 					 	var cityID = this.getDataStorage().getSelectedCityID();
 					 	var routeTypeID = this.getDataStorage().getSelectedRouteTypeID();
 					 	this.loadRoutesListTrigger(cityID, routeTypeID);
 					 	this.selectCityTrigger(cityID,isCenteringMap);
            if(this.getDataStorage().getSelectedRoute() == null){
              this.getDataStorage().setSelectedRoute(null);
              this.selectRouteTrigger(-1);
            }else
            {
              var routeID = this.getDataStorage().getSelectedRoute().getId();
              //this.selectRouteTrigger(-1);
            }
          }
          if(isCenteringMap == false){
            var mapCenter = this.getDataStorage().getMapCenter();
 					 	//this.changeMapCenterTrigger(mapCenter.lat, mapCenter.lon, mapCenter.scale);
 					 }

 					},	this);
				// Загрузим список городов
				this._getAllCities(cities_callback);
			},

      /**
       * Триггер выполняет загрузку списка станций. (Вызывает событие load_stations_list)
       * @param  cityID {Integer}     ID города
       * @param  routeTypeID {String} Тип маршрутов
       * @param  callback {Function}  callback функция
       * @param  sender {Object}      Объект, который вызвал триггер
       */
       loadRoutesListTrigger : function(cityID, routeTypeID, callback, sender){
        this.debug("execute loadRoutesListTrigger()");
        var dataRequest =  new bus.admin.net.DataRequest();
        var langID = qx.core.Init.getApplication().getDataStorage().getLocale();
        dataRequest.Routes().getRoutesList(cityID, routeTypeID, langID, function(responce){
         var data = responce.getContent();
         this.debug("Routes: getRoutesList(): received routes list data");
         console.debug(data);
         var args ={};

         if(data == null || data.error != null)
         {
          args = {
           routesList : null,
           error  : true,
           errorCode : data.error != undefined ? data.error.code : "req_err",
           errorRemoteInfo :  data.error != undefined ? data.error.info : null,
           sender : sender
         };
       }
       else
       {
        var routesListModel = new bus.admin.mvp.model.RoutesListModel(data);
        this.getDataStorage().setSelectedCityID(cityID);
        this.getDataStorage().setSelectedRouteTypeID(routeTypeID);
        this.getDataStorage().setRoutesListModel(routesListModel);
        args = {
         langID : langID,
         routeTypeID : routeTypeID,
         cityID : cityID,
         routesList : routesListModel,
         error  :  false,
         sender : sender
       };
       this.debug("fire");
       this.fireDataEvent("load_routes_list", args);

     }

     this.getDataStorage().setSelectedRoute(null);
     this.selectRouteTrigger(-1);
     if(callback != undefined)
      callback(args);

  }, this);
},

     /**
      * Вызывается для выбора текущего города.
      * @param  cityID {Integer} ID города
      * @param  centering_map {Boolean} Нужно ли центрировать карту
      * @param  callback {Function}  callback функция
      * @param  sender {Object}      Объект, который вызвал триггер
      */
      selectCityTrigger : function(cityID, centering_map, callback, sender){
        this.debug("execute selectCityTrigger()");
        this.debug("cityID: ", cityID);
        this.getDataStorage().setSelectedCityID(cityID);
        var args = {
         city : this.getDataStorage().getCitiesModel().getCityByID(cityID),
         centering_map : centering_map,
         sender : sender
       };
       this.fireDataEvent("select_city", args);
       if(callback!= undefined)
         callback(args);               
     },

      /**
       * Задает выбранный маршрут.
       * @param  routeID {Integer}    ID маршрута
       * @param  centering_map {Boolean} Нужно ли центрировать карту
       * @param  callback {Function}   Callback функиця
       * @param  sender {Object}      Объект, который вызвал триггер
       */
       selectRouteTrigger : function(routeID, centering_map, callback, sender){
        if(routeID <= 0){
          var prevRoute = this.getDataStorage().getSelectedRoute();
          var args = {
            prevRoute : prevRoute,
            route : null,
            centering_map : centering_map,
            sender : sender,
            error  : false
          };
          this.getDataStorage().setSelectedRoute(null);
          this.fireDataEvent("select_route", args);
          if(callback != undefined)
            callback(args);
          return;
        }
        var self  = this;
        var rt_callback = function(args){
          var prevRoute = self.getDataStorage().getSelectedRoute();
          if(prevRoute != undefined)
            args.prevRoute = prevRoute.clone();
          else
            args.prevRoute = null;
          args.centering_map = centering_map;
          if(args.error == false){
            self.getDataStorage().setSelectedRoute(args.route);
            self.fireDataEvent("select_route", args);
          }
          if(callback != undefined)
            callback(args);
        }
        this.getRoute(routeID, rt_callback);
      },

      /**
       * Задает направление
       * @param  direction {Boolean}   Прямое/обратное направление маршрута.
       * @param  callback {Function}   Callback функиця
       * @param  sender {Object}       Объект, который вызвал триггер
       */
       setDirectionTrigger : function (direction, callback, sender)
       {
        this.debug("setDirectionTrigger(): ", direction);
        if(this.getDataStorage().getDirection() == direction)
          return;
        var args = {
          direction : direction,
          sender : sender
        };
        this.getDataStorage().setDirection(direction);
        this.fireDataEvent("change_direction", args);
        if(callback != undefined)
          callback(args);
      },


      /**
       * Обновление  выбранного маршрута, когда страница находится в состоянии конструирования маршрута (state = "make")
       * @param  routeModel {bus.admin.mvp.model.RouteModel} Модель маршрута. Хранит только те данные, которые были изменены.
       * @param  callback {Function}   Callback функиця
       * @param  sender {Object}       Объект, который вызвал триггер
       */
       __updateRouteInStateMake : function(routeModel, callback, sender){
         var selectedRoute = this.getDataStorage().getSelectedRoute();
         var dataModel = routeModel.toDataModel();
         selectedRoute.fromDataModel(dataModel);
         var args = {
          route : selectedRoute,
          requestRoute : routeModel,
          error  :  false
        };
        this.fireDataEvent("update_route", args);
        if(callback != undefined)
          callback(args);
      },

      /**
       * Обновляет модель маршрута
       * @param  routeModel {bus.admin.mvp.model.RouteModel} Модель маршрута
       * @param  callback {Function}   Callback функиця
       * @param  sender {Object}       Объект, который вызвал триггер
       */
       updateRouteTrigger : function(routeModel, callback, sender){
        var state = this.getDataStorage().getState();
        
        // Если страница находится в состоянии конструирования маршрута, то просто обновим выбранную модель
        if(state == "make"){
         var selectedRoute = this.getDataStorage().getSelectedRoute();
         if(selectedRoute != undefined && selectedRoute.getId() == routeModel.getId()){
          this.__updateRouteInStateMake(routeModel, callback, sender);
          return; 
        }
      }

      var dataRequest =  new bus.admin.net.DataRequest();
      dataRequest.Routes().update(routeModel, function(responce){
        var data = responce.getContent();
        this.debug("Routes: update(): received route`s data");
        console.debug(data);
        var args ={};

        if(data == null || data.error != null)
        {
          args = {
            route : null,
            requestRoute : routeModel,
            error  : true,
            errorCode : data.error != undefined ? data.error.code : "req_err",
            errorRemoteInfo :  data.error != undefined ? data.error.info : null
          };
        }
        else
        {
          var routeModel = new bus.admin.mvp.model.RouteModel(data);
          var langID = qx.core.Init.getApplication().getDataStorage().getLocale();

          args = {
            route : routeModel,
            requestRoute : routeModel,
            error  :  false
          };
            // Обновим выбранный маршрут
            var selectedRoute = this.getDataStorage().getSelectedRoute();
            if(selectedRoute!=undefined && selectedRoute.getId() == routeModel.getId()){
             this.getDataStorage().setSelectedRoute(routeModel);
           }

            // Обновим список маршрутов
            var routesList = this.getDataStorage().getRoutesListModel();
            if(routesList != undefined){
             var routeInfo = new bus.admin.mvp.model.RouteInfoModel();
             routeInfo.fromRoute(routeModel, langID);
             routesList.update(routeInfo);
           }

           // Оповестим слушателей об обновлении маршрута
           this.fireDataEvent("update_route", args);

           // В случае, если второй путь отсутствует, изменим направление на true
           if(routeModel.getReverseWay() == undefined)
             this.setDirectionTrigger(true);
         }
         if(callback != undefined)
          callback(args);
      },this);
},

      /**
       * Оповещает презентер о начале процесса конструирования маршрута и перевод страницы в состояние "make".
       * @param  routeModel {bus.admin.mvp.model.RouteModel} Модель маршрута
       * @param  callback {Function}  callback функция
       * @param  sender {Object}      Объект, который вызвал триггер
       */
       startingMakeRouteTrigger : function(routeModel, callback, sender){
        this.debug("execute startingMakeRouteTrigger()", routeModel);

        var state = "make";

        if(this.getDataStorage().getState() == state)
        {
          if(callback!=undefined)
            callback({error  : true});
          return;
        }
        // Изменим состояние страницы
        this.getDataStorage().setState(state);
        
        // Оповестим слушателей об изменении состояния страницы
        var args  = {
          oldState  : this.getDataStorage().getState(),
          newState  : state,
          sender    : sender
        };
        this.fireDataEvent("change_state", args);

        // Сохраним копию текущего выбранного маршрута
        var backupRoute = null;
        if(this.getDataStorage().getSelectedRoute() != null)
          backupRoute = this.getDataStorage().getSelectedRoute().clone();
        this.getDataStorage().setBackupSelectedRoute(backupRoute);
        
        // Заменим текущий маршрут 
        this.getDataStorage().setSelectedRoute(routeModel);

        // Оповестим слушателей об изменении выбранного маршрута
        var isCenteringMap = true;
        if(backupRoute != null && routeModel.getId() == backupRoute.getId())
          isCenteringMap = false;
        var selectRouteArgs = {
          prevRoute : backupRoute,
          route : routeModel,
          centering_map : isCenteringMap,
          sender : sender,
          error  : false
        };
        this.fireDataEvent("select_route", selectRouteArgs);        
        if(callback != undefined){
          callback(args);
        }

      },

      /**
       * Выполняет отмену конструирования маршрута. Используется триггером finishingMakeRouteTrigger()
       * @param  callback {Function}  callback функция
       * @param  sender {Object}      Объект, который вызвал триггер
       */
       __cancelMakeRoute : function(callback, sender){
        var state = "none";
        var stateArgs  = {
          oldState  : this.getDataStorage().getState(),
          newState  : state,
          sender    : sender
        };
        this.getDataStorage().setState(state);
        this.fireDataEvent("change_state", stateArgs);

        var currRoute = this.getDataStorage().getSelectedRoute();
        console.debug(currRoute.toDataModel());
        var backupRoute = this.getDataStorage().getBackupSelectedRoute();
        this.getDataStorage().setSelectedRoute(backupRoute);
        var selectRouteArgs = {
          prevRoute : currRoute,
          route : this.getDataStorage().getSelectedRoute(),
          centering_map : false,
          sender : sender,
          error  : false
        };
        this.fireDataEvent("select_route", selectRouteArgs);
      },


      /**
       * Оповещает презентер о завершении процесса конструирования маршрута и перевод страницы в состояние "make".
       * @param  isSave {Boolean}     Сохранить изменения маршрута или отменить?
       * @param  callback {Function}  callback функция
       * @param  sender {Object}      Объект, который вызвал триггер
       */
       finishingMakeRouteTrigger : function(isSave, callback, sender){
        this.debug("execute finishingMakeRouteTrigger()");

        if(this.getDataStorage().getState() != "make")
        {
          if(callback!=undefined)
            callback({error  : true});
          return;
        }

        if(isSave == true){
          var self = this;
          var update_callback = function(args){
            if(args != undefined && args.error == true){
              self.getDataStorage().setState("make");
              callback(args);
              return;
            }
            var stateArgs  = {
              oldState  : self.getDataStorage().getState(),
              newState  : "none",
              sender    : sender
            };
            self.fireDataEvent("change_state", stateArgs);      

            var currRoute = self.getDataStorage().getSelectedRoute();
            var selectRouteArgs = {
              prevRoute : currRoute,
              route : currRoute,
              centering_map : false,
              sender : sender,
              error  : false
            };
            self.fireDataEvent("select_route", selectRouteArgs);

            if(callback!=undefined)
              callback(args);
            return;
          };
          self.getDataStorage().setState("none");
          var currRoute = this.getDataStorage().getSelectedRoute();
          console.debug(currRoute.toDataModel());
          if(currRoute.getId() > 0){
            this.updateRouteTrigger(currRoute, update_callback);
          }else
          this.insertRouteTrigger(currRoute, update_callback);

        }
        else {
          this.__cancelMakeRoute(callback, sender);
        }

      },

      /**
       * Добавляет "prepared" станцию. Возможен вызов только, если страница находится в состоянии "make".
       * @param stationModel {bus.admin.mvp.model.StationModelEx}    Модель станции
       * @param  callback {Function}  callback функция
       * @param  sender {Object}      Объект, который вызвал триггер
       */
       insertPreparedStationTrigger : function(stationModel, callback, sender){
         if(this.getDataStorage().getState() != "make")
         {
          if(callback!=undefined)
            callback({error  : true});
          return;
        }
        var newStationModel = this.getDataStorage().addPreparedStation(stationModel);
        var args  = {
          station : newStationModel,
          sender  : sender,
          arror   : false
        };

        this.fireDataEvent("insert_prepared_station", args);
        if(callback!=undefined)
          callback(args);
      },

      /**
       * Обновляет "prepared" станцию. Возможен вызов только, если страница находится в состоянии "make".
       * @param stationModel {bus.admin.mvp.model.StationModelEx}    Модель станции
       * @param  callback {Function}  callback функция
       * @param  sender {Object}      Объект, который вызвал триггер
       */
       updatePreparedStationTrigger : function(stationModel, callback, sender){
         if(this.getDataStorage().getState() != "make")
         {
          if(callback!=undefined)
            callback({error  : true});
          return;
        }
        this.getDataStorage().updatePreparedStation(stationModel);
        var args  = {
          station : stationModel,
          sender  : sender,
          arror   : false
        };
        this.fireDataEvent("update_prepared_station", args);

        var routeWay = this.getDataStorage().getSelectedWay();
        var changes = routeWay.updateStation(stationModel);
        for(var i=0; i< changes.length; i++){
          var rargs  =  changes[i];
          rargs.error = false;
          rargs.sender = this;
          this.fireDataEvent("update_way_relations", rargs);
        }
        var direction = this.getDataStorage().getDirection();
        var otherWay = this.getDataStorage().getSelectedRoute().getWayByDirection(!direction);
        otherWay.updateStation(stationModel);
        if(callback!=undefined)
          callback(args);
      },



       /**
        * Ассинхронная функция. Возвращает модель маршрута.
        * @param  routeID {Integer}    ID маршрута
        * @param  callback {Function}   Callback функиця. В функцию передается объект, который имеет следующую структуру: 
        * {
        *   route : {bus.admin.mvp.model.RouteModel}, 
        *   error : {Boolean}
        * }
        */
        getRoute : function(routeID, callback){
          var dataRequest =  new bus.admin.net.DataRequest();
          dataRequest.Routes().get(routeID, function(responce){
            var data = responce.getContent();
            this.debug("Routes: get(): received route`s data");
            console.debug(data);
            var args ={};

            if(data == null || data.error != null)
            {
              args = {
                route : null,
                error  : true,
                errorCode : data.error != undefined ? data.error.code : "req_err",
                errorRemoteInfo :  data.error != undefined ? data.error.info : null
              };
            }
            else
            {
              var routeModel = new bus.admin.mvp.model.RouteModel(data);
              args = {
                route : routeModel,
                error  :  false
              };
            }
            if(callback != undefined)
              callback(args);
          },this);
        },

 		 /**
			* Запрашивает у сервера данные о городах, затем по ним формирует модель городов и языков
			* и записывает их  в локальное хранилище DataStorage.
			* @param  callback {Function}  Callback функция
			*/
			_getAllCities : function(callback) {
          		// Создадим запрос серверу
          		var dataRequest =  new bus.admin.net.DataRequest();
          		var req = dataRequest.Cities().getAll(function(responce){
          			var data = responce.getContent();
          			this.debug("_getAllCities(): received cities data");
          			console.debug(data);
          			var args ={};
          			if(data == null || data.error != null)
          			{
          				args = {
          					cities : null,
          					langs : null,
          					error : true,
          					errorCode : data.error != undefined ? data.error.code : "req_err",
          					errorRemoteInfo :  data.error != undefined ? data.error.info : null
          				};
          			}
          			else
          			{
          				this.getDataStorage().getCitiesModel().fromDataModel(data);
          				args = {
          					cities :  this.getDataStorage().getCitiesModel(),
          					langs  :  this.getDataStorage().getLangsModel(),
          					error  :  false
          				};
          			}
          			callback(args);
          		},this);
          	}				
          }


        });
