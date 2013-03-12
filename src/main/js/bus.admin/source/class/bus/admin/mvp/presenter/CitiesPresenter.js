
/**
 * Presenter страницы Cities. Является посредником между хранилищем данных и представлением. 
 * После очередного действия пользователя представление ( bus.admin.view.Cities и его дочерние виджеты) вызывает триггер 
 * презентера. В функции триггера задается логика, которая обновляет данные хранилища (также, возможно изменение данных на сервере) и 
 * вызывает нужное событие (например, "refresh", "update_city"). Слушатели событий получают обновленные данные из хранилища.
 * Слушателями событий данной класса выступают представление bus.admin.view.Cities и его дочерние виджеты. 
 */
 qx.Class.define("bus.admin.mvp.presenter.CitiesPresenter", 
 {

 	include : [bus.admin.mvp.presenter.mix.Cities],
 	extend : qx.core.Object,
 	events : {

 		"refresh"     : "qx.event.type.Data",

 		"update_city" : "qx.event.type.Data",

 		"insert_city" : "qx.event.type.Data",

 		"delete_city" : "qx.event.type.Data"

 	},

 	construct : function() {
 		this.base(arguments);
 		var dataStorage = new bus.admin.mvp.storage.CitiesPageDataStorage();
 		this.setDataStorage(dataStorage);
 	},

 	properties : {
 		dataStorage : {
 			nullable : true
 		}
 	},

 	members : {

 		refreshTrigger : function(callback){
 			var cities_callback = qx.lang.Function.bind(function(data) {
 				this.fireDataEvent("refresh", data);
 				callback(data);
 			}, this);
 			this._getAllCities(cities_callback);
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
