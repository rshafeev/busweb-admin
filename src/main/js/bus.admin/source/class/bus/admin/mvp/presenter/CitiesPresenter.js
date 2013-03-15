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
 * После очередного действия пользователя представление ( {@link bus.admin.view.Cities} и его дочерние виджеты) вызывает триггер 
 * презентера. В функции триггера задается логика, которая обновляет данные хранилища (также, возможно изменение данных на сервере) и 
 * вызывает нужное событие (например, "refresh", "update_city"). Слушатели событий получают обновленные данные из хранилища.
 * Слушателями событий данной класса выступают представление bus.admin.view.Cities и его дочерние виджеты. 
 */
 qx.Class.define("bus.admin.mvp.presenter.CitiesPresenter", 
 {

 	include : [bus.admin.mvp.presenter.mix.Cities],
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
 		 * <ul>
 		 * </pre>
 		 */		 
 		 "select_city" : "qx.event.type.Data",


 		 /**
 		  * Событие наступает при изменении модели города.
 		  */
 		  "update_city" : "qx.event.type.Data",

 		  "insert_city" : "qx.event.type.Data",

 		  "delete_city" : "qx.event.type.Data"



 		},

 		construct : function() {
 			this.base(arguments);
 			var dataStorage = new bus.admin.mvp.storage.CitiesPageDataStorage();
 			this.initDataStorage(dataStorage);
 		},

 		properties : {
 		/**
 		 * Хранилище данных страницы Cities
 		 * @type { bus.admin.mvp.storage.CitiesPageDataStorage}
 		 */
 		 dataStorage : {
 		 	deferredInit : true
 		 }
 		},

 		members : {

 			refreshTrigger : function(callback){
 				this.debug("execute refreshTrigger()");
 				var cities_callback = qx.lang.Function.bind(function(data) {
 					/**
 					 * Если выбранный город не сущестует в обновленном списке городов, тогда уберем выбранный город
 					 */
 					 var selectedCityID = this.getDataStorage().getSelectedCityID();
 					 if(selectedCityID > 0 &&  this.getDataStorage().getCitiesModel().getCityByID(selectedCityID) == null){
 					 	this.getDataStorage().setSelectedCityID(-1);
 					 	selectedCityID = -1;
 					 }
 					 if(data.error == false)
 					 	this.fireDataEvent("refresh", data);
 					 if(callback!= undefined)
 					 	callback(data);
 					 
 					 if(selectedCityID > 0 ){
 					 	this.selectCityTrigger(selectedCityID);
 					 }

 					}, this);
 				this._getAllCities(cities_callback);
 			},

 			comboLangsSelectionItemTrigger : function(langID, callback){
 				this.getDataStorage().setCurrNamesLangID(langID);
 				var data = {
 					cities : this.getDataStorage().getCitiesModel(),
 					langID : langID
 				};
 				this.fireDataEvent("select_comboLangs", data);
 				if(callback!= undefined)
 					callback(data);
 			},

 			selectCityTrigger : function(cityID, callback, sender){
 				this.debug("execute selectCityTrigger()");
 				this.debug("cityID: ", cityID);
 				this.getDataStorage().setSelectedCityID(cityID);
 				var data = {
 					city : this.getDataStorage().getCitiesModel().getCityByID(cityID),
 					sender : sender
 				};
 				this.fireDataEvent("select_city", data);
 				if(callback!= undefined)
 					callback(data);			
 			},

 			updateCityTrigger : function(oldCityModel, newCityModel, callback){
 				var dataRequest =  new bus.admin.net.DataRequest();
 				
 				var req = dataRequest.Cities().update(newCityModel, function(responce){
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
 							errorRemoteInfo :  data.error != undefined ? data.error.info : null
 						}
 					}
 					else
 					{
 						var cityModel = new bus.admin.mvp.model.CityModel(data);
 						this.getDataStorage().getCitiesModel().updateCity(oldCityModel.getId(),cityModel);
 						args = {
 							oldCity   : oldCityModel,
 							newCity   : cityModel,
 							error     :  false
 						};
 						this.fireDataEvent("update_city", args);
 					}
 					if(callback != undefined)
 					callback(args);
 				},this);
 			}
 		/*

 		insertCityTrigger : function(city, event_finish_func) {
 			this.debug("insertCity event execute");

 			var modelsContainer = qx.core.Init.getApplication()
 			.getModelsContainer();
 			var citiesRequest = new bus.admin.net.DataRequest();

 			var new_city_json = qx.lang.Json.stringify(city);
 			var request = citiesRequest.insertCity(new_city_json, function(
 				response) {
 				var result = response.getContent();
 				if (result == null || result.error != null) {
 					var data = {
 						city : result,
 						error : true,
 						server_error : result.error
 					};
 					this.fireDataEvent("insert_city", data);
 					event_finish_func(data);
 				} else {
 					var data = {
 						city : result,
 						error : null,
 						server_error : null
 					};
 					modelsContainer.getCitiesModel().insertCity(result);
 					this.fireDataEvent("insert_city", data);
 					event_finish_func(data);
 				}
 			}, function() {
 				var data = {
 					city : null,
 					error : true,
 					server_error : null
 				};
 				this.fireDataEvent("insert_city", data);
 				event_finish_func(data);
 			}, this);
 			return request;
 		},

 		updateCityTrigger : function(old_city, new_city, event_finish_func) {

 			var modelsContainer = qx.core.Init.getApplication()
 			.getModelsContainer();
 			var citiesRequest = new bus.admin.net.DataRequest();
 			var new_city_json = qx.lang.Json.stringify(new_city);
 			var request = citiesRequest.updateCity(new_city_json, function(
 				response) {
 				var result = response.getContent();
 				if (result == null || result.error != null) {
 					var data = {
 						new_city : null,
 						old_city : old_city,
 						error : true,
 						server_error : null
 					};
 					this.fireDataEvent("update_city", data);
 					event_finish_func(data);

 				} else {
 					modelsContainer.getCitiesModel().updateCity(old_city.id,result);
 					var data = {
 						new_city : result,
 						old_city : old_city,
 						error : null,
 						server_error : null
 					};
 					this.fireDataEvent("update_city", data);
 					event_finish_func(data);

 				}
 			}, function() {

 				var data = {
 					new_city : null,
 					old_city : old_city,
 					error : true,
 					server_error : null
 				};
 				this.fireDataEvent("update_city", data);

 			}, this);
 			return request;
 		},

 		deleteCityTrigger : function(city_id, event_finish_func) {
 			this.debug("execute deleteCityTrigger()");
 			var dataStorage = this.getDataStorage();
 			var citiesRequest = new bus.admin.net.DataRequest();
 			var city_id_json = city_id.toString();
 			var request = citiesRequest.deleteCity(city_id_json, function(
 				response) {
 				var result = response.getContent();
 				if (result == null || result.error != null) {
 					var data = {
 						city_id : null,
 						error : true,
 						server_error : result.error
 					};
 					this.fireDataEvent("delete_city", data);
 					event_finish_func(data);
 				} else {
 					var data = {
 						city_id : city_id,
 						error : null,
 						server_error : null
 					};
 					modelsContainer.getCities().deleteCity(city_id);
 					this.fireDataEvent("delete_city", data);
 					event_finish_func(data);
 				}
 			}, function() {
 				var data = {
 					city_id : null,
 					error : true,
 					server_error : null
 				};
 				this.fireDataEvent("delete_city", data);
 				event_finish_func(data);
 			}, this);
 			return request;

 		}

 		*/
 	}


 }
 );
