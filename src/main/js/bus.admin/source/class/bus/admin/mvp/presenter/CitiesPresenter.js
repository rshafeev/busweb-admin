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
 * Presenter страницы {@link bus.admin.view.Cities Cities}. Является посредником между хранилищем данных и представлением. 
 * После очередного действия пользователя представление ( {@link bus.admin.view.Cities} или его дочерние виджеты) вызывает триггер 
 * презентера. В функции триггера задается логика, которая обновляет данные хранилища (также, возможно изменение данных на сервере) и 
 * вызывает нужное событие (например, "refresh", "update_city"). Слушатели событий получают обновленные данные из хранилища.
 * Слушателями событий данной класса выступают представление bus.admin.view.Cities и его дочерние виджеты. 
 */
 qx.Class.define("bus.admin.mvp.presenter.CitiesPresenter", 
 {
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
 		 * Событие наступает после выбора языка в выпадающем списке comboLangs.
 		 * <br><br>Свойства возвращаемого объекта: <br> 		 
 		 * <pre>
 		 * <ul>
 		 * <li> langID          Код языка,  {@link bus.admin.mvp.model.LanguagesModel LanguagesModel}</li>
 		 * <li> sender          Объект, который вызвал триггер, Object </li>
 		 * <ul>
 		 * </pre>
 		 */
 		 "select_comboLangs" :  "qx.event.type.Data",

  		/**
 		 * Событие наступает после выбора города в таблице.
 		 * <br><br>Свойства возвращаемого объекта: <br> 		 
 		 * <pre>
 		 * <ul>
 		 * <li> city  Выбранный город, {@link bus.admin.mvp.model.CitiesModel CitiesModel}</li>
 		 * <li> sender          Объект, который вызвал триггер, Object </li>
 		 * <ul>
 		 * </pre>
 		 */		 
 		 "select_city" : "qx.event.type.Data",


 		 /**
 		 * Событие наступает при изменении модели города.
  		 * <br><br>Свойства возвращаемого объекта: <br> 		 
 		 * <pre>
 		 * <ul>
 		 * <li> oldCity         Старая модель города, {@link bus.admin.mvp.model.CityModel CityModel}. </li>
 		 * <li> newCity         Обновленная модель города,  {@link bus.admin.mvp.model.CityModel CityModel}. </li>
 		 * <li> error           Наличие ошибки при выполнении события, Boolean. </li>
 		 * <li> errorCode       Код ошибки, String. </li>
 		 * <li> errorRemoteInfo Описание ошибки с сервера, String. </li>
 		 * <li> sender          Объект, который вызвал триггер, Object </li>
 		 * <ul>
 		 * </pre>
 		 */
 		 "update_city" : "qx.event.type.Data",

 		 /**
 		 * Событие наступает при изменении модели города.
  		 * <br><br>Свойства возвращаемого объекта: <br> 		 
 		 * <pre>
 		 * <ul>
 		 * <li> city            Модель нового города,  {@link bus.admin.mvp.model.CityModel CityModel}. </li>
 		 * <li> error           Наличие ошибки при выполнении события, Boolean. </li>
 		 * <li> errorCode       Код ошибки, String. </li>
 		 * <li> errorRemoteInfo Описание ошибки с сервера, String. </li>
 		 * <li> sender          Объект, который вызвал триггер, Object </li>
 		 * <ul>
 		 * </pre>
 		 */
 		 "insert_city" : "qx.event.type.Data",

 		 /**
 		 * Событие наступает при удалении города.
  		 * <br><br>Свойства возвращаемого объекта: <br> 		 
 		 * <pre>
 		 * <ul>
 		 * <li> cityID          ID города, который был удален,  {@link bus.admin.mvp.model.CityModel CityModel}. </li>
 		 * <li> error           Наличие ошибки при выполнении события, Boolean. </li>
 		 * <li> errorCode       Код ошибки, String. </li>
 		 * <li> errorRemoteInfo Описание ошибки с сервера, String. </li>
 		 * <li> sender          Объект, который вызвал триггер, Object </li>
 		 * <ul>
 		 * </pre>
 		 */
 		 "remove_city" : "qx.event.type.Data",

 		/**
 		 * Событие наступает при изменении состояния страницы. Например, при нажатии на кнопку Move или Save/Cancel.
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
 			var dataStorage = new bus.admin.mvp.storage.CitiesPageDataStorage();
 			this.initDataStorage(dataStorage);
 		},

 		properties : {
 		/**
 		 * Хранилище данных страницы Cities
 		 * @type {bus.admin.mvp.storage.CitiesPageDataStorage}
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
 			 	var cities_callback = qx.lang.Function.bind(function(e) {
 					/**
 					 * Если выбранный город не сущестует в обновленном списке городов, тогда уберем выбранный город
 					 */
 					 var selectedCityID = this.getDataStorage().getSelectedCityID();
 					 if(selectedCityID > 0 &&  this.getDataStorage().getCitiesModel().getCityByID(selectedCityID) == null){
 					 	this.getDataStorage().setSelectedCityID(-1);
 					 	selectedCityID = -1;
 					 }
 					 e.sender = sender;
 					 if(e.error == false){
 					 	this.fireDataEvent("refresh", e);
 					 }
 					 if(callback!= undefined)
 					 	callback(e);
 					 
 					 if(selectedCityID > 0 ){
 					 	this.selectCityTrigger(selectedCityID);
 					 }

 					}, this);
 			 	this._getAllCities(cities_callback);
 			 },

 			/**
 			 * Вызывается для изменения языка локализации. (Срабатывает при изменении языка в выпадающем списке языков на вкладке Localization) 
 			 * @param  langID {String} Код языка      
 			 * @param  callback {Function}  callback функция
 			 * @param  sender {Object}      Объект, который вызвал триггер
 			 */
 			 comboLangsSelectionItemTrigger : function(langID, callback, sender){
 			 	this.getDataStorage().setCurrNamesLangID(langID);
 			 	var args = {
 			 		cities : this.getDataStorage().getCitiesModel(),
 			 		langID : langID,
 			 		sender : sender
 			 	};
 			 	this.fireDataEvent("select_comboLangs", args);
 			 	if(callback!= undefined)
 			 		callback(args);
 			 },

 			/**
 			 * Вызывается для выбора текущего города.
 			 * @param  cityID {Integer} ID города
 			 * @param  callback {Function}  callback функция
 			 * @param  sender {Object}      Объект, который вызвал триггер
 			 */
 			 selectCityTrigger : function(cityID, callback, sender){
 			 	this.debug("execute selectCityTrigger()");
 			 	this.debug("cityID: ", cityID);
 			 	this.getDataStorage().setSelectedCityID(cityID);
 			 	var args = {
 			 		city : this.getDataStorage().getCitiesModel().getCityByID(cityID),
 			 		sender : sender
 			 	};
 			 	this.fireDataEvent("select_city", args);
 			 	if(callback!= undefined)
 			 		callback(args);			
 			 },

 			/**
 			 * Триггер обновляет данные города. 
 			 * @param  oldCityModel {bus.admin.mvp.model.CityModel} Старая модель города
 			 * @param  newCityModel {bus.admin.mvp.model.CityModel} Новая модель города
 			 * @param  callback {Function}  callback функция
 			 * @param  sender {Object}      Объект, который вызвал триггер
 			 */
 			 updateCityTrigger : function(oldCityModel, newCityModel, callback, sender){
 			 	var dataRequest =  new bus.admin.net.DataRequest();

 			 	dataRequest.Cities().update(newCityModel, function(responce){
 			 		var data = responce.getContent();
 			 		this.debug("Cities: update(): received cities data");
 			 		console.debug(data);
 			 		var args ={};
 			 		if(data == null || data.error != null)
 			 		{
 			 			args = {
 			 				oldCity : oldCityModel,
 			 				newCity : null,
 			 				error : true,
 			 				errorCode : data.error != undefined ? data.error.code : "req_err",
 			 				errorRemoteInfo :  data.error != undefined ? data.error.info : null,
 			 				sender : sender
 			 			}
 			 		}
 			 		else
 			 		{
 			 			var cityModel = new bus.admin.mvp.model.CityModel(data);
 			 			this.getDataStorage().getCitiesModel().updateCity(oldCityModel.getId(),cityModel);
 			 			args = {
 			 				oldCity   : oldCityModel,
 			 				newCity   : cityModel,
 			 				error     :  false,
 			 				sender    : sender
 			 			};
 			 			this.fireDataEvent("update_city", args);
 			 		}
 			 		if(callback != undefined)
 			 			callback(args);
 			 	},this);
 			 },

 			/**
 			 * Добавляет новый город.
 			 * @param  newCityModel {bus.admin.mvp.model.CityModel} Новая модель города
 			 * @param  callback {Function}  callback функция
 			 * @param  sender {Object}      Объект, который вызвал триггер
 			 */
 			 insertCityTrigger : function(newCityModel, callback, sender){
 			 	var dataRequest =  new bus.admin.net.DataRequest();

 			 	dataRequest.Cities().insert(newCityModel, function(responce){
 			 		var data = responce.getContent();
 			 		this.debug("Cities: insert(): received cities data");
 			 		console.debug(data);
 			 		var args ={};
 			 		if(data == null || data.error != null)
 			 		{
 			 			args = {
 			 				city : newCityModel,
 			 				error : true,
 			 				errorCode : data.error != undefined ? data.error.code : "req_err",
 			 				errorRemoteInfo :  data.error != undefined ? data.error.info : null,
 			 				sender : sender
 			 			}
 			 		}
 			 		else
 			 		{
 			 			var cityModel = new bus.admin.mvp.model.CityModel(data);
 			 			this.getDataStorage().getCitiesModel().insertCity(cityModel);
 			 			args = {
 			 				city      : cityModel,
 			 				error     : false,
 			 				sender    : sender
 			 			};
 			 			this.fireDataEvent("insert_city", args);
 			 		}
 			 		if(callback != undefined)
 			 			callback(args);
 			 	},this);
 			 },

 			/**
 			 * Удаляет город.
 			 * @param  cityID {Integer} ID города
 			 * @param  callback {Function}  callback функция
 			 * @param  sender {Object}      Объект, который вызвал триггер
 			 */
 			 removeCityTrigger : function(cityID, callback, sender){
 			 	var dataRequest =  new bus.admin.net.DataRequest();
 			 	dataRequest.Cities().remove(cityID, function(responce)	{
 			 		var data = responce.getContent();
 			 		this.debug("Cities: remove(): received cities data");
 			 		console.debug(data);
 			 		var args ={};
 			 		if(data == null || data.error != null)
 			 		{
 			 			args = {
 			 				cityID  : cityID,
 			 				error : true,
 			 				errorCode : data.error != undefined ? data.error.code : "req_err",
 			 				errorRemoteInfo :  data.error != undefined ? data.error.info : null,
 			 				sender : sender
 			 			}
 			 		}
 			 		else	{
 			 			this.getDataStorage().getCitiesModel().removeCity(cityID);
 			 			if(this.getDataStorage().getSelectedCityID() == cityID)	{
 			 				this.getDataStorage().setSelectedCityID(-1);
 			 				var args = {
 			 					city : null,
 			 					sender : sender
 			 				};
 			 				this.fireDataEvent("select_city", args);
 			 			}
 			 			args = {
 			 				cityID      : cityID,
 			 				error       : false,
 			 				sender      : sender
 			 			};
 			 			this.fireDataEvent("remove_city", args);
 			 		}
 			 		if(callback != undefined)
 			 			callback(args);
 			 	},this);

			},

			/**
			 * Меняет состояние страницы.
			 * @param  state {String}       Состояние страницы. Возможные значения: ["none", "move"].
 			 * @param  callback {Function}  callback функция
 			 * @param  sender {Object}      Объект, который вызвал триггер
 			 */
 			 changeStateTrigger : function(state, callback, sender){
 			 	var args  = {
 			 		oldState  : this.getDataStorage().getState(),
 			 		newState  : state,
 			 		sender    : sender
 			 	};
 			 	this.getDataStorage().setState(state);
 			 	this.fireDataEvent("change_state", args);
 			 	if(callback != undefined){
 			 		callback(args);
 			 	}
 			 	if(state == "move"){
 			 		var cityModel = this.getDataStorage().getSelectedCity();
 			 		if(cityModel != null){
 			 			var args = {
 			 				city : cityModel,
 			 				sender : this
 			 			};
 			 			this.fireDataEvent("select_city", args);
 			 		}

 			 	}
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
			  	if(callback != undefined)
			  		callback(args);
			  	this.fireDataEvent("change_map_center", args);
			  },

			  /**
			   * Запрашивает у сервера данные о городах, затем по ним формирует модель городов и языков
			   * и записывает их  в локальное хранилище DataStorage.
			   * @param  callback {Function}  Callback функция
			   */
			  _getAllCities : function(callback) {
			  	var dataRequest =  new bus.admin.net.DataRequest();
			  	var req = dataRequest.Cities().getAll(function(responce){
			  		var data = responce.getContent();
			  		this.debug("_getAllCities(): received cities data");
			  		console.debug(data);
			  		var args ={};
			  		if(data == null || data.error != null){
			  			args = {
			  				cities : null,
			  				langs : null,
			  				error : true,
			  				errorCode : data.error != undefined ? data.error.code : "req_err",
			  				errorRemoteInfo :  data.error != undefined ? data.error.info : null
			  			}
			  		}
			  		else{
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


		}
		);
