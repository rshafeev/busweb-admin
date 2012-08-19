

qx.Mixin.define("bus.admin.mvp.presenter.mng.CitiesManager", {
	construct : function() {

	},
	members : {

		deleteCity : function(city_id, event_finish_func) {
			this.debug("deleteCity event execute");
			var globalPresenter = qx.core.Init.getApplication().getPresenter();
			var modelsContainer = qx.core.Init.getApplication()
					.getModelsContainer();
			var citiesRequest = new bus.admin.net.CitiesRequest();
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
							globalPresenter.fireDataEvent("delete_city", data);
							event_finish_func(data);
						} else {
							var data = {
								city_id : city_id,
								error : null,
								server_error : null
							};
							modelsContainer.getCitiesModel().deleteCity(city_id);
							globalPresenter.fireDataEvent("delete_city", data);
							event_finish_func(data);
						}
					}, function() {
						var data = {
							city_id : null,
							error : true,
							server_error : null
						};
						globalPresenter.fireDataEvent("delete_city", data);
						event_finish_func(data);
					}, this);
			return request;

		},
		insertCity : function(city, event_finish_func) {
			this.debug("insertCity event execute");
			var globalPresenter = qx.core.Init.getApplication().getPresenter();
			var modelsContainer = qx.core.Init.getApplication()
					.getModelsContainer();
			var citiesRequest = new bus.admin.net.CitiesRequest();

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
							globalPresenter.fireDataEvent("insert_city", data);
							event_finish_func(data);
						} else {
							var data = {
								city : result,
								error : null,
								server_error : null
							};
							modelsContainer.getCitiesModel().insertCity(result);
							globalPresenter.fireDataEvent("insert_city", data);
							event_finish_func(data);
						}
					}, function() {
						var data = {
							city : null,
							error : true,
							server_error : null
						};
						globalPresenter.fireDataEvent("insert_city", data);
						event_finish_func(data);
					}, this);
			return request;
		},

		updateCity : function(old_city, new_city, event_finish_func) {
			console.info("presenter: update_city");
			var globalPresenter = qx.core.Init.getApplication().getPresenter();
			var modelsContainer = qx.core.Init.getApplication()
					.getModelsContainer();
			var citiesRequest = new bus.admin.net.CitiesRequest();
			var new_city_json = qx.lang.Json.stringify(new_city);
			var request = citiesRequest.updateCity(new_city_json, function(
							response) {
						var result = response.getContent();
						console.info("presenter: update_city: request1");
						if (result == null || result.error != null) {
							var data = {
								new_city : null,
								old_city : old_city,
								error : true,
								server_error : null
							};
							console.info("presenter: update_city: request2");
							globalPresenter.fireDataEvent("update_city", data);
							event_finish_func(data);

						} else {
							modelsContainer.getCitiesModel().updateCity(result);
							var data = {
								new_city : result,
								old_city : old_city,
								error : null,
								server_error : null
							};
							console.info("presenter: update_city: request3");
							globalPresenter.fireDataEvent("update_city", data);
							console.info("presenter: update_city: request err!!!");
							
							event_finish_func(data);
							
						}
					}, function() {
						
						var data = {
							new_city : null,
							old_city : old_city,
							error : true,
							server_error : null
						};
						globalPresenter.fireDataEvent("update_city", data);
					
					}, this);
			return request;
		},

		refreshCities : function(event_finish_func) {
			var cities_response = null;
			var lang_response = null;
			var citiesRequest = new bus.admin.net.CitiesRequest();
			var request = citiesRequest.getAllCities(function(responce) {
						var cities_response = responce.getContent();
						var result = cities_response;
						if (result == null || result.error != null) {
							this.__refresh_cities_failed(result, null,
									event_finish_func);
							return;
						}
						var langsRequest = new bus.admin.net.LangsRequest();
						langsRequest.getAllLanguages(function(responce) {
									lang_response = responce.getContent();
									var result = lang_response;
									if (result == null || result.error != null) {
										this.__refresh_cities_failed(null,
												result, event_finish_func);
										return;
									}
									this.__refresh_cities_ok(cities_response,
											lang_response, event_finish_func);
								}, function() {
									this.__refresh_cities_failed(null, null,
											event_finish_func);
								}, this);
					}, function() {
						this.__refresh_cities_failed(null, null,
								event_finish_func);

					}, this);
			return request;
		},

		__refresh_cities_ok : function(citiesData, langsData, event_finish_func) {
			var globalPresenter = qx.core.Init.getApplication().getPresenter();
			var modelsContainer = qx.core.Init.getApplication()
					.getModelsContainer();
			this.debug("CitiesManager:__refresh_cities_ok()");
			modelsContainer.getCitiesModel().setData(citiesData);
			modelsContainer.getLangsModel().setData(langsData);
			var data = {
				models : {
					cities : citiesData,
					langs : langsData
				},
				error : false,
				server_error : null,
				test : "test!!!"
			};
			globalPresenter.fireDataEvent("refresh_cities", data);
			event_finish_func(data);
		},

		__refresh_cities_failed : function(responce_cities, responce_langs,
				event_finish_func) {
			var globalPresenter = qx.core.Init.getApplication().getPresenter();
			var server_error = null;
			if (responce_cities != null && responce_cities.server_error != null) {
				server_error = responce_cities.server_error;
			} else if (responce_langs != null
					&& responce_langs.server_error != null) {
				server_error = responce_langs.server_error;
			}
			var data = {
				models : {
					cities : null,
					langs : null
				},

				error : true,
				server_error : server_error
			};
			globalPresenter.fireDataEvent("refresh_cities", data);
			event_finish_func(data);
		}
	}
});