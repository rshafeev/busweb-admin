

qx.Mixin.define("bus.admin.mvp.presenter.mng.CitiesManager", {
	members : {
		moveCity : function(old_city, new_city, fire_obj) {
			var globalPresenter = qx.core.Init.getApplication().getPresenter();
			var modelsContainer = qx.core.Init.getApplication()
					.getModelsContainer();

			var panel = this.__citiesPage.getCityLeftPanel();
			var map = this.__citiesPage.getCityMap();
			var marker = map.getMarkerByID(new_city.id);
			var citiesRequest = new bus.admin.net.CitiesRequest();
			var curr_city = this.__citiesPage.getCitiesModel()
					.getCityByID(new_city.id);

			var new_city_json = qx.lang.Json.stringify(new_city);
			citiesRequest.updateCity(new_city_json, function(response) {
						var result = response.getContent();
						if (result == null || result.error != null) {
							globalPresenter.fireDataEvent("update_city", {
										new_city : null,
										old_city : old_city,
										fire_obj : fire_obj,
										error : true,
										server_error : result.error
									});
						} else {
							var citiesModel = this.__modelsContainer
									.getCitiesModel();
							modelsContainer.getCitiesModel().updateCity(result);
							globalPresenter.fireDataEvent("update_city", {
										new_city : result,
										old_city : old_city,
										fire_obj : fire_obj,
										error : null
									});
						}
					}, function() {
						globalPresenter.fireDataEvent("update_city", {
									new_city : null,
									old_city : old_city,
									fire_obj : fire_obj,
									error : true,
									server_error : null
								});
					}, this);

		},

		refreshCities : function(fire_obj) {
			var globalPresenter = this;
			var modelsContainer = qx.core.Init.getApplication()
					.getModelsContainer();
			var citiesData = null;
			var langsData = null;

			var citiesRequest = new bus.admin.net.CitiesRequest();
			citiesRequest.getAllCities(function(response) {
						var result = response.getContent();

						if (result == null || result.error != null) {
							globalPresenter.fireDataEvent("refresh_cities", {
										models : {
											cities : citiesData,
											langs : langsData
										},
										fire_obj : fire_obj,
										error : true,
										server_error : null
									});
							return;
						}
						citiesData = result;
						var langsRequest = new bus.admin.net.LangsRequest();
						langsRequest.getAllLanguages(function(lang_response) {
									var result = response.getContent();
									if (result == null || result.error != null) {
										langsData = result;
										modelsContainer
												.setCitiesModel(citiesData);
										modelsContainer
												.setCitiesModel(langsData);

										globalPresenter.fireDataEvent(
												"refresh_cities", {
													models : {
														cities : citiesData,
														langs : langsData
													},
													fire_obj : fire_obj,
													error : true,
													server_error : result.error
												});
										return;
									}
									globalPresenter.fireDataEvent(
											"refresh_cities", {
												models : {
													cities : citiesData,
													langs : langsData
												},
												fire_obj : fire_obj,
												error : false,
												server_error : null
											});
								}, function() {
									globalPresenter.fireDataEvent(
											"refresh_cities", {
												models : {
													cities : citiesData,
													langs : langsData
												},
												fire_obj : fire_obj,
												error : true,
												server_error : result.error
											});
								}, this);
					}, function() {
						globalPresenter.fireDataEvent("refresh_cities", {
									models : {
										cities : null,
										langs : null
									},
									fire_obj : fire_obj,
									error : true,
									server_error : null
								});

					}, this);

		}
	}
});