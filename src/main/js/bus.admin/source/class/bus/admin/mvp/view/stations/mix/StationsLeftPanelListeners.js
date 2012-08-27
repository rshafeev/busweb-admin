qx.Mixin.define("bus.admin.mvp.view.stations.mix.StationsLeftPanelListeners", {
			construct : function() {
				var presenter = qx.core.Init.getApplication().getPresenter();
				presenter.addListener("update_city", this.on_update_city, this);
				presenter.addListener("insert_city", this.on_insert_city, this);
				presenter.addListener("delete_city", this.on_delete_city, this);
				presenter.addListener("refresh_cities", this.on_refresh_cities,
						this);
				presenter
						.addListener("load_stations", this.on_load_stations, this);
				presenter.addListener("insert_station", this.on_insert_station,
						this);

			},
			members : {

				on_load_stations : function(e) {
					this.debug("on_load_stations()");
					var data = e.getData();
					if (data == null || data.error == true) {
						this.debug("load_stations() : event data has errors");
						return;
					}
					this._stations = data.stations;

					var langName = bus.admin.helpers.WidgetHelper
							.getValueFromSelectBox(this.combo_langs);
					if (langName == null)
						return;
					var languagesModel = this._stationsPage
							.getModelsContainer().getLangsModel();
					var lang = languagesModel.getLangByName(langName);
					this.loadStationTable(data.stations, lang);

				},

				on_insert_station : function(e) {
					this.debug("on_insert_station()");
					var data = e.getData();

					if (data == null || data.error == true) {
						this
								.debug("on_insert_station() : event data has errors");
						return;
					}

					var langName = bus.admin.helpers.WidgetHelper
							.getValueFromSelectBox(this.combo_langs);
					var lang = this._stationsPage.getModelsContainer()
							.getLangsModel().getLangByName(langName);
					var name = bus.admin.mvp.model.helpers.StationsModelHelper
							.getStationNameByLang(data.station, lang.id);
					var name_default = bus.admin.mvp.model.helpers.StationsModelHelper
							.getStationNameByLang(data.station,
									bus.admin.AppProperties.DEFAULT_LANGUAGE);
					
					var tableModel = this.__stationsTable.getTableModel();
					tableModel.setRows([[data.station.id, name_default, name]],
							tableModel.getRowCount());

				},

				// *****************************************
				on_delete_city : function(e) {
					var data = e.getData();
					if (data == null || data.error == true) {
						this.debug("on_delete_city() : event data has errors");
						return;
					}
					var cityComboItem = bus.admin.helpers.WidgetHelper
							.getItemFromSelectBoxByID(this.combo_cities,
									data.city_id);
					if (cityComboItem != null) {
						this.combo_cities.remove(cityComboItem);
					}
				},
				on_refresh_cities : function(e) {
					var data = e.getData();
					if (data == null || data.error == true) {
						this
								.debug("on_refresh_cities() : event data has errors");
						return;
					}
					this.loadLanguagesToComboBox(data.models.langs);
					this.loadCitiesToComboBox(data.models.cities);
				},

				on_insert_city : function(e) {
					this.debug("on_insert_city()");
					var data = e.getData();

					if (data == null || data.error == true) {
						this
								.debug("on_refresh_cities() : event data has errors");
						return;
					}
					var name_default = bus.admin.mvp.model.helpers.CitiesModelHelper
							.getCityNameByLang(data.city,
									bus.admin.AppProperties.DEFAULT_LANGUAGE);
					var item = new qx.ui.form.ListItem(name_default);
					item.setUserData("id", data.city.id);
					this.combo_cities.add(item);

				},
				on_update_city : function(e) {
					this.debug("on_insert_city()");
					var data = e.getData();

					if (data == null || data.error == true) {
						this
								.debug("on_refresh_cities() : event data has errors");
						return;
					}
					var name_default = bus.admin.mvp.model.helpers.CitiesModelHelper
							.getCityNameByLang(data.new_city,
									bus.admin.AppProperties.DEFAULT_LANGUAGE);
					var cityComboItem = bus.admin.helpers.WidgetHelper
							.getItemFromSelectBoxByID(this.combo_cities,
									data.old_city.id);
					if (cityComboItem != null) {
						cityComboItem.setLabel(name_default);

					}
				}

			}
		});