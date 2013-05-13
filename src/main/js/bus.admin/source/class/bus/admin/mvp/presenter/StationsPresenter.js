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
 * Presenter страницы {@link bus.admin.view.Stations Stations}. Является посредником между хранилищем данных и представлением. 
 * После очередного действия пользователя представление ( {@link bus.admin.view.Stations} или его дочерние виджеты) вызывают триггер 
 * презентера. В функции триггера задается логика, которая обновляет данные хранилища (также, возможно изменение данных на сервере) и 
 * вызывает нужное событие (например, "refresh", "update_station"и др.). Слушатели событий получают обновленные данные из хранилища и обновляют view.
 * Слушателями событий данной класса выступают представление bus.admin.view.Stations и его дочерние виджеты. 
 */
 qx.Class.define("bus.admin.mvp.presenter.StationsPresenter", {

 	extend : qx.core.Object,
 	events : {

	   /**
 		 * Событие наступает после загрузки страницы или после нажатия на кнопку "Refresh".
 		 * <br><br>Свойства возвращаемого объекта: <br> 		 
 		 * <pre>
 		 * <ul>
 		 * <li> cities          Список городов, {@link bus.admin.mvp.model.CitiesModel CitiesModel}. </li>
 		 * <li> langs           Список языков,  {@link bus.admin.mvp.model.LanguagesModel LanguagesModel}. </li>
 		 * <li> error           Наличие ошибки при выполнении события, Boolean. </li>
 		 * <li> errorCode       Код ошибки, String. </li>
 		 * <li> errorRemoteInfo Описание ошибки с сервера, String. </li>
 		 * <li> sender          Объект, который вызвал триггер, Object </li>
 		 * <ul>
 		 * </pre>
 		 */
 		 "refresh"     : "qx.event.type.Data",

	   /**
 		 * Событие наступает после изменения текущего города или языка названий станций. (Также при обновлении страницы).
 		 * <br><br>Свойства возвращаемого объекта: <br> 		 
 		 * <pre>
 		 * <ul>
 		 * <li> stList          Список станций, {@link bus.admin.mvp.model.StationsListModel StationsListModel}. </li>
 		 * <li> error           Наличие ошибки при выполнении события, Boolean. </li>
 		 * <li> errorCode       Код ошибки, String. </li>
 		 * <li> errorRemoteInfo Описание ошибки с сервера, String. </li>
 		 * <li> sender          Объект, который вызвал триггер, Object </li>
 		 * <ul>
 		 * </pre>
 		 */
 		 "load_stations_list" : "qx.event.type.Data",

  		/**
 		 * Событие наступает после выбора города в таблице.
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
 		 * Событие наступает после выбора остановки в таблице.
 		 * <br><br>Свойства возвращаемого объекта: <br> 		 
 		 * <pre>
 		 * <ul>
 		 * <li> station         Выбранная остановка, {@link bus.admin.mvp.model.StationModelEx StationModelEx}</li>
  	 * <li> prevStation     Предыдущая выбранная остановка, {@link bus.admin.mvp.model.StationModelEx StationModelEx}</li>
     * <li> centering_map   Центрирование карты, Boolean  </li>
 		 * <li> error           Наличие ошибки при выполнении события, Boolean. </li>
 		 * <li> errorCode       Код ошибки, String. </li>
 		 * <li> errorRemoteInfo Описание ошибки с сервера, String. </li>
 		 * <li> sender          Объект, который вызвал триггер, Object </li>
 		 * <ul>
 		 * </pre>
 		 */		 
 		 "select_station" : "qx.event.type.Data",

 		 /**
 		 * Событие наступает при изменении данных о станции.
  		 * <br><br>Свойства возвращаемого объекта: <br> 		 
 		 * <pre>
 		 * <ul>
 		 * <li> oldStation      Старая модель остановки, {@link bus.admin.mvp.model.StationModelEx StationModelEx}. </li>
 		 * <li> newStation      Обновленная модель остановки,  {@link bus.admin.mvp.model.StationModelEx StationModelEx}. </li>
 		 * <li> error           Наличие ошибки при выполнении события, Boolean. </li>
 		 * <li> errorCode       Код ошибки, String. </li>
 		 * <li> errorRemoteInfo Описание ошибки с сервера, String. </li>
 		 * <li> sender          Объект, который вызвал триггер, Object </li>
 		 * <ul>
 		 * </pre>
 		 */
 		 "update_station" : "qx.event.type.Data",

 		 /**
 		 * Событие наступает при добавлении новой станции.
  		 * <br><br>Свойства возвращаемого объекта: <br> 		 
 		 * <pre>
 		 * <ul>
 		 * <li> newStation      Модель новой остановки,  {@link bus.admin.mvp.model.StationModelEx StationModelEx}. </li>
 		 * <li> error           Наличие ошибки при выполнении события, Boolean. </li>
 		 * <li> errorCode       Код ошибки, String. </li>
 		 * <li> errorRemoteInfo Описание ошибки с сервера, String. </li>
 		 * <li> sender          Объект, который вызвал триггер, Object </li>
 		 * <ul>
 		 * </pre>
 		 */
 		 "insert_station" : "qx.event.type.Data",
 		 
 		 /**
 		 * Событие наступает при удалении станции.
  		 * <br><br>Свойства возвращаемого объекта: <br> 		 
 		 * <pre>
 		 * <ul>
 		 * <li> stationID       ID остановки,  Integer. </li>
 		 * <li> error           Наличие ошибки при выполнении события, Boolean. </li>
 		 * <li> errorCode       Код ошибки, String. </li>
 		 * <li> errorRemoteInfo Описание ошибки с сервера, String. </li>
 		 * <li> sender          Объект, который вызвал триггер, Object </li>
 		 * <ul>
 		 * </pre>
 		 */
 		 "remove_station" : "qx.event.type.Data",

 		 /**
 		 * Событие наступает при изменении центральной точки или масштаба карты 
  		 * <br><br>Свойства возвращаемого объекта: <br> 		 
 		 * <pre>
 		 * <ul>
 		 * <li> lat    Широта,  Number. </li>
 		 * <li> lon    Долгота, Number. </li>
 		 * <li> scale  Масштаб, Integer. </li>
 		 * <li> sender Объект, который вызвал триггер, Object </li>
 		 * <ul>
 		 * </pre>
 		 */
 		 "change_map_center" : "qx.event.type.Data" 		 

 		},

 		construct : function() {
 			this.base(arguments);
 			var dataStorage = new bus.admin.mvp.storage.StationsPageDataStorage();
 			this.initDataStorage(dataStorage);
 		},


 		properties : {
 		/**
 		 * Хранилище данных страницы Cities
 		 * @type {bus.admin.mvp.storage.StationsPageDataStorage}
 		 */
 		 dataStorage : {
 		 	deferredInit : true
 		 }
 		},

 		members : {
 			/**
 			 * Триггер обновляет данные станции. 
 			 * @param  oldStationModel {bus.admin.mvp.model.StationModelEx} Старая модель станции
 			 * @param  newStationModel {bus.admin.mvp.model.StationModelEx} Новая модель станции
 			 * @param  callback {Function}  callback функция
 			 * @param  sender {Object}      Объект, который вызвал триггер
 			 */
 			 updateStationTrigger : function(oldStationModel, newStationModel, callback, sender){
 			 	var dataRequest =  new bus.admin.net.DataRequest();

 			 	dataRequest.Stations().update(newStationModel, function(responce){
 			 		var data = responce.getContent();
 			 		this.debug("Stations: update(): received stations data");
 			 		console.debug(data);
 			 		var args =null;
 			 		if(data == null || data.error != null)
 			 		{
 			 			args = {
 			 				oldStation : oldStationModel,
 			 				newStation : null,
 			 				error : true,
 			 				errorCode : data.error != undefined ? data.error.code : "req_err",
 			 				errorRemoteInfo :  data.error != undefined ? data.error.info : null,
 			 				sender : sender
 			 			};
 			 		}
 			 		else
 			 		{
 			 			var stationModel = new bus.admin.mvp.model.StationModelEx(data);
 			 			if(this.getDataStorage().getSelectedStationModel() != undefined && 
 			 				this.getDataStorage().getSelectedStationModel().getId() == oldStationModel.getId())
 			 			{
 			 				this.getDataStorage().setSelectedStationModel(stationModel);
 			 			}
 			 			args = {
 			 				oldStation   : oldStationModel,
 			 				newStation   : stationModel,
 			 				error     :  false,
 			 				sender    : sender
 			 			};
 			 			this.fireDataEvent("update_station", args);
 			 		}
 			 		if(callback != undefined)
 			 			callback(args);
 			 	},this);

},


 			/**
 			 * Триггер добавляет остановку. 
 			 * @param  newStationModel {bus.admin.mvp.model.StationModelEx} Новая модель станции
 			 * @param  callback {Function}  callback функция
 			 * @param  sender {Object}      Объект, который вызвал триггер
 			 */
 			 insertStationTrigger : function(newStationModel, callback, sender){
 			 	var dataRequest =  new bus.admin.net.DataRequest();

 			 	dataRequest.Stations().insert(newStationModel, function(responce){
 			 		var data = responce.getContent();
 			 		this.debug("Stations: insert(): received stations data");
 			 		console.debug(data);
 			 		var args =null;
 			 		if(data == null || data.error != null)
 			 		{
 			 			args = {
 			 				station : null,
 			 				error : true,
 			 				errorCode : data.error != undefined ? data.error.code : "req_err",
 			 				errorRemoteInfo :  data.error != undefined ? data.error.info : null,
 			 				sender : sender
 			 			};
 			 		}
 			 		else
 			 		{
 			 			var stationModel = new bus.admin.mvp.model.StationModelEx(data);
 			 			var langID = this.getDataStorage().getCurrNamesLangID();
 			 			// Обновим список станций
 			 			this.getDataStorage().getStationsListModel().insert(stationModel.getId(), stationModel.getName(langID));
 			 			args = {
 			 				station   : stationModel,
 			 				error     :  false,
 			 				sender    : sender
 			 			};
 			 			this.fireDataEvent("insert_station", args);
 			 		}
 			 		if(callback != undefined)
 			 			callback(args);
 			 	},this);

},

 			/**
 			 * Триггер удаляет остановку. 
 			 * @param  stationID {Integer} ID станции
 			 * @param  callback {Function}  callback функция
 			 * @param  sender {Object}      Объект, который вызвал триггер
 			 */
 			 removeStationTrigger : function(stationID, callback, sender){
 			 	var dataRequest =  new bus.admin.net.DataRequest();

 			 	dataRequest.Stations().remove(stationID, function(responce){
 			 		var data = responce.getContent();
 			 		this.debug("Stations: insert(): received stations data");
 			 		console.debug(data);
 			 		var args =null;
 			 		if(data == null || data.error != null)
 			 		{
 			 			args = {
 			 				stationID : null,
 			 				error : true,
 			 				errorCode : data.error != undefined ? data.error.code : "req_err",
 			 				errorRemoteInfo :  data.error != undefined ? data.error.info : null,
 			 				sender : sender
 			 			};
 			 		}
 			 		else
 			 		{
 			 			// Обновим список станций
 			 			this.getDataStorage().getStationsListModel().remove(stationID);

 			 			// Если данная станция, является была ранее выбрана, убираем
 			 			if(this.getDataStorage().getSelectedStationModel() != undefined && 
 			 				this.getDataStorage().getSelectedStationModel().getId() == stationID){
 			 				this.selectStationTrigger(-1);
 			 		}	
 			 		args = {
 			 			stationID   : stationID,
 			 			error       :  false,
 			 			sender      : sender
 			 		};
 			 		this.fireDataEvent("remove_station", args);
 			 	}
 			 	if(callback != undefined)
 			 		callback(args);
 			 },this);

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
 					 	var langID = this.getDataStorage().getCurrNamesLangID();
 					 	this.loadStationsListTrigger(cityID, langID);
 					 	this.selectCityTrigger(cityID,isCenteringMap);
 					 }
 					 if(isCenteringMap == false){
 					 	var mapCenter = this.getDataStorage().getMapCenter();
 					 	this.changeMapCenterTrigger(mapCenter.lat, mapCenter.lon, mapCenter.scale);
 					 }

 					}, this);
        // Загрузим список городов 
        this._getAllCities(cities_callback);
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
 			 * Возвращает набор остановок, местоположения которых попадает в заданный прямоугольник. 
 			 * @param  p1 {bus.admin.mvp.model.geom.PointModel}    Координаты левого верхнего угла прямоугольника. 
 			 * @param  p2 {bus.admin.mvp.model.geom.PointModel}    Координаты правого нижнего угла прямоугольника. 
 			 * @param  callback {Function}  Callback функиция, аргументом которой выступает массив остановок.
 			 */
 			 loadStationsFromBox : function(p1, p2, callback){
 			 	this.debug("execute loadStationsFromBox()");
 			 	var cityID = this.getDataStorage().getSelectedCityID();
 			 	var langID = this.getDataStorage().getCurrNamesLangID();

 			 	var args = {
 			 		stationsBox : null 			 	

 			 	};
 			 	
 			 	if (cityID <= 0){
 			 		if(callback!= undefined)
 			 			callback(args);	
 			 		return;
 			 	}
        var requestModel = new bus.admin.mvp.model.StationsBoxModel();
        requestModel.setCityID(cityID);
        requestModel.setLangID(langID);
        requestModel.setLtPoint(p1);
        requestModel.setRbPoint(p2);


 			 	var dataRequest =  new bus.admin.net.DataRequest();
 			 	var req = dataRequest.Stations().getStationsFromBox(requestModel, function(responce){
 			 		var data = responce.getContent();
 			 		this.debug("getStationsFromBox(): received cities data");
 			 		console.debug(data);
 			 		var args ={};
 			 		if(data == null || data.error != null){
 			 			args = {
 			 				stationsBox : null,
 			 				error : true,
 			 				errorCode : data.error != undefined ? data.error.code : "req_err",
 			 				errorRemoteInfo :  data.error != undefined ? data.error.info : null
 			 			}
 			 		}
 			 		else{
 			 			var responseModel = new bus.admin.mvp.model.StationsBoxModel(data);
 			 			args = {
 			 				stationsBox :  responseModel,
 			 				error  :  false
 			 			};
 			 		}
 			 		callback(args);
 			 	},this);

 			 },
 			/**
 			 * Триггер выполняет загрузку списка станций. (Вызывает событие load_stations_list)
 			 * @param  cityID {Integer}     ID города
 			 * @param  langID {String}      ID языка
 			 * @param  callback {Function}  callback функция
 			 * @param  sender {Object}      Объект, который вызвал триггер
 			 */
 			 loadStationsListTrigger : function(cityID, langID, callback, sender){
 			 	var dataRequest =  new bus.admin.net.DataRequest();

 			 	dataRequest.Stations().getStationsList(cityID, langID, function(responce){
 			 		var data = responce.getContent();
 			 		this.debug("Stations: getStationsList(): received stations list data");
 			 		console.debug(data);
 			 		var args ={};

 			 		if(data == null || data.error != null)
 			 		{
 			 			args = {
 			 				langID : langID,
 			 				cityID : cityID,
 			 				stList : null,
 			 				error  : true,
 			 				errorCode : data.error != undefined ? data.error.code : "req_err",
 			 				errorRemoteInfo :  data.error != undefined ? data.error.info : null,
 			 				sender : sender
 			 			}
 			 		}
 			 		else
 			 		{
 			 			var stationsListModel = new bus.admin.mvp.model.StationsListModel(data.stationsList);
 			 			this.getDataStorage().setSelectedCityID(cityID);
 			 			this.getDataStorage().setCurrNamesLangID(langID);
 			 			this.getDataStorage().setStationsListModel(stationsListModel);
 			 			args = {
 			 				langID : langID,
 			 				cityID : cityID,
 			 				stList : stationsListModel,
 			 				error  :  false,
 			 				sender : sender
 			 			};
 			 			this.fireDataEvent("load_stations_list", args);
 			 		}
          //
          if(callback != undefined)
            callback(args);
        }, this);
       //
     },


			/**
			 * Задает выбранную станцию.
			 * @param  stationID {Integer}    ID остановки
 			 * @param  centering_map {Boolean} Нужно ли центрировать карту
			 * @param  callback {Function}   Callback функиця
			 * @param  sender {Object}      Объект, который вызвал триггер
			 */
			 selectStationTrigger : function(stationID, centering_map, callback, sender){
			 	if(stationID <= 0){
			 		var prevStation = this.getDataStorage().getSelectedStationModel();
			 		var args = {
			 			prevStation : prevStation,
			 			station : null,
			 			centering_map : centering_map,
			 			sender : sender,
			 			error  : false
			 		};
			 		this.getDataStorage().setSelectedStationModel(null);
			 		this.fireDataEvent("select_station", args);
			 		return;
			 	}
			 	var self  = this;
			 	var st_callback = function(args){
			 		var prevStation = self.getDataStorage().getSelectedStationModel();
			 		if(prevStation != undefined)
			 			args.prevStation = prevStation.clone();
			 		else
			 			args.prevStation = null;
			 		args.centering_map = centering_map;
			 		if(args.error == false){
			 			self.getDataStorage().setSelectedStationModel(args.station);
			 			self.fireDataEvent("select_station", args);
			 		}
			 		if(callback != undefined)
			 			callback(args);
			 	}
			 	this.getStation(stationID, st_callback);
			 },

			 /**
			  * Ассинхронная функция. Возвращает модель остановки.
			  * @param  stationID {Integer}    ID остановки
			  * @param  callback {Function}   Callback функиця. Имеент единственный аргумент, который имеет структуру: {station : bus.admin.mvp.model.StationModelEx, error : Boolean }
			  */
			  getStation : function(stationID, callback){
			  	var dataRequest =  new bus.admin.net.DataRequest();
			  	dataRequest.Stations().get(stationID, function(responce){
			  		var data = responce.getContent();
			  		this.debug("Stations: get(): received station`s data");
			  		console.debug(data);
			  		var args ={};

			  		if(data == null || data.error != null)
			  		{
			  			args = {
			  				station : null,
			  				error  : true,
			  				errorCode : data.error != undefined ? data.error.code : "req_err",
			  				errorRemoteInfo :  data.error != undefined ? data.error.info : null
			  			};
			  		}
			  		else
			  		{
			  			var stationModel = new bus.admin.mvp.model.StationModelEx(data);
			  			args = {
			  				station : stationModel,
			  				error  :  false
			  			};
			  		}
			  		if(callback != undefined)
			  			callback(args);
			  	},this);
			  },

			 /**
			  * Триггер для изменения центральной точки карты или текущего масштаба.
			  * @param  lat {Number}         Широта центральной точки
			  * @param  lon {Number}         Долгота центральной точки
			  * @param  scale {Integer}      Масштаб карты
			  * @param  callback {Function}  Callback функция
			  * @param  sender {Object}      Объект, который вызвал триггер
			  */
			  changeMapCenterTrigger : function(lat, lon, scale, callback, sender){
			  	this.getDataStorage().setMapCenter({
			  		lat : lat,
			  		lon : lon,
			  		scale : scale
			  	});

			  	var args = {
			  		lat : lat,
			  		lon : lon,
			  		scale : scale,
			  		sender : sender
			  	};
			  	this.fireDataEvent("change_map_center", args);
			  	if(callback != undefined)
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
