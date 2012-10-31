qx.Mixin.define("bus.admin.mvp.view.stations.mix.StationsLeftPanelListeners", {
	construct : function() {
		var presenter = qx.core.Init.getApplication().getPresenter();
		presenter.addListener("update_city", this.on_update_city, this);
		presenter.addListener("insert_city", this.on_insert_city, this);
		presenter.addListener("delete_city", this.on_delete_city, this);
		presenter.addListener("refresh_cities", this.on_refresh_cities, this);
		presenter = this._stationsPage.getPresenter();
		presenter.addListener("load_stations", this.on_load_stations, this);
		presenter.addListener("insert_station", this.on_insert_station, this);
		presenter.addListener("update_station", this.on_update_station, this);
		presenter.addListener("delete_station", this.on_delete_station, this);
	},
	members : {
		on_update_station : function(e) {
			this.debug("on_update_station()");
			var data = e.getData();
			if (data == null || data.error == true) {
				this.debug("on_update_station() : event data has errors");
				return;
			}
			var isHasTransport = bus.admin.mvp.model.helpers.StationsModelHelper
					.isHasTransport(data.new_station, this.getTransportType());
			if (isHasTransport == false) {
				var e_del = {
					getData : function() {
						return data.new_station.id;
					}
				};
				this.on_delete_station(e_del);
			}
			var langName = bus.admin.helpers.WidgetHelper
					.getValueFromSelectBox(this.combo_langs);
			var lang = qx.core.Init.getApplication().getModelsContainer().getLangsModel()
					.getLangByName(langName);

			this.getStationsModel().updateStation(data.new_station);

			var row = this.getStationsTableRowIndexByID(data.old_station.id);
			if (row == null)
				return;
			var name = bus.admin.mvp.model.helpers.StationsModelHelper
					.getStationNameByLang(data.new_station, lang.id);
			var name_default = bus.admin.mvp.model.helpers.StationsModelHelper
					.getStationNameByLang(data.new_station, "c_"
									+ qx.locale.Manager.getInstance()
											.getLocale());

			var tableModel = this._stationsTable.getTableModel();
			tableModel.setValue(0, row, data.new_station.id);
			tableModel.setValue(1, row, name_default);
			tableModel.setValue(2, row, name);
		},
		on_delete_station : function(e) {
			this.debug("on_delete_station()");
			var data = e.getData();
			if (data == null || data.error == true) {
				this.debug("load_stations() : event data has errors");
				return;
			}
			var row = this.getStationsTableRowIndexByID(data.station_id);
			if (row >= 0) {
				this._stationsTable.getTableModel().removeRows(row, 1);
			}

		},
		on_load_stations : function(e) {
			this.debug("on_load_stations()");
			var data = e.getData();
			if (data == null || data.error == true) {
				this.debug("load_stations() : event data has errors");
				return;
			}

			// refresh stationsModel

			this.getStationsModel().setData(data.stations);

			var langName = bus.admin.helpers.WidgetHelper
					.getValueFromSelectBox(this.combo_langs);
			if (langName == null)
				return;
			var languagesModel = qx.core.Init.getApplication().getModelsContainer()
					.getLangsModel();
			var lang = languagesModel.getLangByName(langName);
			this.loadStationTable(data.stations, lang);

		},

		on_insert_station : function(e) {
			this.debug("on_insert_station()");
			var data = e.getData();

			if (data == null || data.error == true) {
				this.debug("on_insert_station() : event data has errors");
				return;
			}
			this.getStationsModel().insertStation(data.station);
			var langName = bus.admin.helpers.WidgetHelper
					.getValueFromSelectBox(this.combo_langs);
			var lang = qx.core.Init.getApplication().getModelsContainer().getLangsModel()
					.getLangByName(langName);
			var name = bus.admin.mvp.model.helpers.StationsModelHelper
					.getStationNameByLang(data.station, lang.id);
			var name_default = bus.admin.mvp.model.helpers.StationsModelHelper
					.getStationNameByLang(data.station, "c_"
									+ qx.locale.Manager.getInstance()
											.getLocale());

			var tableModel = this._stationsTable.getTableModel();
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
					.getItemFromSelectBoxByID(this.combo_cities, data.city_id);
			if (cityComboItem != null) {
				this.combo_cities.remove(cityComboItem);
			}
		},
		on_refresh_cities : function(e) {
			var data = e.getData();
			if (data == null || data.error == true) {
				this.debug("on_refresh_cities() : event data has errors");
				return;
			}
			this.loadLanguagesToComboBox(data.models.langs);
			this.loadCitiesToComboBox(data.models.cities);
		},

		on_insert_city : function(e) {
			this.debug("on_insert_city()");
			var data = e.getData();

			if (data == null || data.error == true) {
				this.debug("on_refresh_cities() : event data has errors");
				return;
			}
			var name_default = bus.admin.mvp.model.helpers.CitiesModelHelper
					.getCityNameByLang(data.city, "c_"
									+ qx.locale.Manager.getInstance()
											.getLocale());
			var item = new qx.ui.form.ListItem(name_default);
			item.setUserData("id", data.city.id);
			this.combo_cities.add(item);

		},
		on_update_city : function(e) {
			this.debug("on_insert_city()");
			var data = e.getData();

			if (data == null || data.error == true) {
				this.debug("on_refresh_cities() : event data has errors");
				return;
			}
			var name_default = bus.admin.mvp.model.helpers.CitiesModelHelper
					.getCityNameByLang(data.new_city, "c_"
									+ qx.locale.Manager.getInstance()
											.getLocale());
			var cityComboItem = bus.admin.helpers.WidgetHelper
					.getItemFromSelectBoxByID(this.combo_cities,
							data.old_city.id);
			if (cityComboItem != null) {
				cityComboItem.setLabel(name_default);

			}
		}

	}
});