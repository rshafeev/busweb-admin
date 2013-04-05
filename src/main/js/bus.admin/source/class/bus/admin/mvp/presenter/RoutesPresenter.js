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
       "select_city" : "qx.event.type.Data"

 		/*
 		 "loadRoutesList" : "qx.event.type.Data",

 		 "loadRoute" : "qx.event.type.Data",

 		 "insertRoute" : "qx.event.type.Data",

 		 "removeRoute" : "qx.event.type.Data",

 		 "updateRoute" : "qx.event.type.Data",

 		 "startCreateNewRoute" : "qx.event.type.Data",

 		 "finishCreateNewRoute" : "qx.event.type.Data",

 		 "addNewStation" : "qx.event.type.Data",

 		 "insertStationToCurrentRoute" : "qx.event.type.Data",

 		 "loadImportObjects" : "qx.event.type.Data",

 		 "loadImportRoute" : "qx.event.type.Data"
 		 */
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
        var langID = bus.admin.AppProperties.getLocale();
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
        var routesListModel = new bus.admin.mvp.model.RoutesListModel(data.routesList);
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
