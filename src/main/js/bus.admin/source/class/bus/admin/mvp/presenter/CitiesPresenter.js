qx.Class.define("bus.admin.mvp.presenter.CitiesPresenter", {
			extend : qx.core.Object,

			construct : function(citiesPage) {
				this.base(arguments);
				this.__citiesPage = citiesPage;
				this.__globalPresenter = qx.core.Init.getApplication()
						.getPresenter();
				this.__modelsContainer = qx.core.Init.getApplication()
						.getModelsContainer();
				this.__globalPresenter.addListener("insertCity",
						this.__on_insertCity, this);
				this.__globalPresenter.addListener("updateCity",
						this.__on_updateCity, this);
				this.__globalPresenter.addListener("deleteCity",
						this.__on_deleteCity, this);
			},
			members : {
				__citiesPage : null,
				__globalPresenter : null,
				__modelsContainer : null,
				refreshData : function() {
					qx.core.Init.getApplication().setWaitingWindow(true);
					var citiesRequest = new bus.admin.net.CitiesRequest();
					var langsRequest = new bus.admin.net.LangsRequest();
					var citiesData = null;
					var langsData = null;
					var request_count = 0;
					citiesRequest.getAllCities(function(response) {
								citiesData = response.getContent();
								request_count = request_count + 1;
								if (request_count == 2) {
									this.__refreshView(citiesData, langsData);
								}
							}, function() {
								request_count = request_count + 1;
								if (request_count == 2) {
									this.__refreshView(citiesData, langsData);
								}
							}, this);
					langsRequest.getAllLanguages(function(response) {
								langsData = response.getContent();
								request_count = request_count + 1;
								if (request_count == 2) {
									this.__refreshView(citiesData, langsData);
								}
							}, function() {
								request_count = request_count + 1;
								if (request_count == 2) {
									this.__refreshView(citiesData, langsData);
								}
							}, this);

				},
/*
				moveCity : function(city_id) {
					var panel = this.__citiesPage.getCityLeftPanel();
					var map = this.__citiesPage.getCityMap();
					var marker = map.getMarkerByID(city_id);
					var citiesRequest = new bus.admin.net.CitiesRequest();
					var curr_city = this.__citiesPage.getCitiesModel()
							.getCityByID(city_id);

					qx.core.Init.getApplication().setWaitingWindow(true);

					var update_city = {
						id : curr_city.id,
						location : {
							lat : marker.getPosition().lat(),
							lon : marker.getPosition().lng()
						},
						scale : map.getGoogleMap().getMapObject().getZoom(),
						name_key : curr_city.name_key,
						names : curr_city.names
					};
					var update_city_json = qx.lang.Json.stringify(update_city);
					citiesRequest.updateCity(update_city_json, function(
									response) {
								var result = response.getContent();
								if (result == null || result.error != null) {
									alert(result.error.toString());
									map.updateMarker(curr_city.id,
											curr_city.lat, curr_city.lon);
								} else if (result != null) {
									var citiesModel = this.__citiesPage
											.getCitiesModel();
									citiesModel.updateCity(result);
									panel.on_updateCity(result.id, result);
								} else {

								}
								qx.core.Init.getApplication()
										.setWaitingWindow(false);

							}, function() {
								map.updateMarker(curr_city.id, curr_city.lat,
										curr_city.lon);
								alert("server responce error!");
								qx.core.Init.getApplication()
										.setWaitingWindow(false);
							}, this);

				},
*/
				/*
				 * 
				 * @param {} city @param {} props : { is_refresh_panel :
				 * boolean, }
				 */

				updateCity : function(city, props) {
					var panel = this.__citiesPage.getCityLeftPanel();
					var map = this.__citiesPage.getCityMap();
					var citiesModel = this.__citiesPage.getCitiesModel();

					citiesModel.updateCity(city);
					panel.on_updateCity(city.id, city, props);
					map.updateMarker(city.id, city.location.lat,
							city.location.lon);
					this.__globalPresenter.fireDataEvent("update_city", {
								city : city
							});
				},

				insertCity : function(city) {
					this.debug("Presenter: insertCity()");
					// change model
					this.__modelsContainer.getCitiesModel().insertCity(city);
					// fire event to refresh all views
					this.__globalPresenter.fireDataEvent("insert_city", {
								city : city
							});
				},
				deleteCity : function(city_id) {
					this.__modelsContainer.getCitiesModel().deleteCity(city_id);
					this.__globalPresenter.fireDataEvent("delete_city", {
								city_id : city_id
							});

				},

				//****************
				//call events
				//*****************
				__on_insertCity : function(e) {
					var city = e.getData();
					this.__citiesPage.getCityMap().insertCityMarker(city.id,
							city.location.lat, city.location.lon);
					this.__citiesPage.getCityLeftPanel().on_insertCity(city);
				},

				__on_updateCity : function(e) {
					var city = e.getData();
				},

				__on_deleteCity : function(e) {
					var city_id = e.getData();
					this.__citiesPage.getCityMap().deleteMarker(city_id);
					this.__citiesPage.getCityLeftPanel().on_deleteCity(city_id);
				},

				__refreshView : function(citiesData, langsData) {
					if (citiesData != null && langsData != null) {
						var citiesModel = new bus.admin.mvp.model.CitiesModel();
						citiesModel.setData(citiesData);
						var languagesModel = new bus.admin.mvp.model.LanguagesModel();
						languagesModel.setData(langsData);
						this.__citiesPage.setCitiesModel(citiesModel);
						this.__citiesPage.setLanguagesModel(languagesModel);

						// fill model to widgets
						var panel = this.__citiesPage.getCityLeftPanel();
						var map = this.__citiesPage.getCityMap();

						panel.on_loadLanguagesToComboBox(languagesModel
								.getData());
						panel.on_loadDataToCityTable(citiesModel.getData());

						/*
						 * var langName = bus.admin.helpers.WidgetHelper
						 * .getValueFromSelectBox(panel.combo_langs);
						 * this.debug(langName); var lang =
						 * languagesModel.getLangByName(langName);
						 * panel.on_loadDataToCityLocalizationTable(lang,
						 * citiesModel.getData());
						 */
						// add marker to the map
						map.deleteAllMarkers();
						for (var i = 0; i < citiesData.length; i++) {
							map.insertCityMarker(citiesData[i].id,
									citiesData[i].location.lat,
									citiesData[i].location.lon);
						}
					} else {
						alert("server error!Please, refresh page");
					}
					qx.core.Init.getApplication().setWaitingWindow(false);
					this.__citiesPage.showApplication();
				}

			}
		});