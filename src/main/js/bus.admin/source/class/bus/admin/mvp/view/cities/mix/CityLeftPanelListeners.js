qx.Mixin.define("bus.admin.mvp.view.cities.mix.CityLeftPanelListeners", {
	construct : function() {
		var presenter = qx.core.Init.getApplication().getPresenter();
		presenter.addListener("update_city", this.on_update_city, this);
		presenter.addListener("insert_city", this.on_insert_city, this);
		presenter.addListener("delete_city", this.on_delete_city, this);
		presenter.addListener("refresh_cities", this.on_refresh_cities, this);
	},
	members : {

		on_delete_city : function(e) {
			var data = e.getData();
			if (data == null || data.error == true) {
				this.debug("on_delete_city() : event data has errors");
				return;
			}
			var row = this.getCitiesTableRowIndexByID(data.city_id);
			if (row >= 0) {
				this.citiesTable.getTableModel().removeRows(row, 1);
			}
			row = this.getCityLocalizationTableRowIndexByID(data.city_id);
			if (row >= 0) {
				this.citiesLocalizationTable.getTableModel().removeRows(row, 1);
			}

		},
		on_refresh_cities : function(e) {
			var data = e.getData();
			if (data == null || data.error == true) {
				this.debug("on_refresh_cities() : event data has errors");
				return;
			}
			this.on_loadLanguagesToComboBox(data.models.langs);
			this.on_loadDataToCityTable(data.models.cities);
		},

		on_insert_city : function(e) {
			this.debug("on_insert_city()");
			var data = e.getData();

			if (data == null || data.error == true) {
				this.debug("on_refresh_cities() : event data has errors");
				return;
			}

			var langName = bus.admin.helpers.WidgetHelper
					.getValueFromSelectBox(this.combo_langs);
			var lang = this.__citiesPage.getModelsContainer().getLangsModel()
					.getLangByName(langName);
			var name = bus.admin.mvp.model.helpers.CitiesModelHelper
					.getCityNameByLang(data.city, lang.id);
			var name_ru = bus.admin.mvp.model.helpers.CitiesModelHelper
					.getCityNameByLang(data.city, "c_ru");
			var tableModel = this.citiesTable.getTableModel();
			tableModel.setRows([[data.city.id, name_ru, data.city.location.lat,
							data.city.location.lon, data.city.scale]],
					tableModel.getRowCount() - 1);
			tableModel = this.citiesLocalizationTable.getTableModel();
			tableModel.setRows([[data.city.id, name_ru, name]], tableModel
							.getRowCount()
							- 1);

		},
		on_update_city : function(e) {
			this.debug("on_updateCity() start");
			// update citiesTable
			var data = e.getData();
			if (data == null || data.error == true) {
				this.debug("on_refresh_cities() : event data has errors");
			}
			var row = this.getCitiesTableRowIndexByID(data.old_city.id);
			if (row == null)
				return;
			var langName = bus.admin.helpers.WidgetHelper
					.getValueFromSelectBox(this.combo_langs);
			var lang = this.__citiesPage.getModelsContainer().getLangsModel()
					.getLangByName(langName);
			var name = bus.admin.mvp.model.helpers.CitiesModelHelper
					.getCityNameByLang(data.new_city, lang.id);
			var name_ru = bus.admin.mvp.model.helpers.CitiesModelHelper
					.getCityNameByLang(data.new_city, "c_ru");

			var tableModel = this.citiesTable.getTableModel();
			tableModel.setValue(tableModel.getColumnIndexById("Id"), row,
					data.new_city.id);
			tableModel.setValue(1, row, name_ru);
			tableModel.setValue(tableModel.getColumnIndexById("Lat"), row,
					data.new_city.location.lat);
			tableModel.setValue(tableModel.getColumnIndexById("Lon"), row,
					data.new_city.location.lon);
			tableModel.setValue(tableModel.getColumnIndexById("Scale"), row,
					data.new_city.scale);
			// update citiesLocalizationTable
			row = this.getCityLocalizationTableRowIndexByID(data.old_city.id);
			if (row == null)
				return;
			tableModel = this.citiesLocalizationTable.getTableModel();
			tableModel.setValue(0, row, data.new_city.id);
			tableModel.setValue(1, row, name_ru);
			tableModel.setValue(2, row, name);
			this.debug("on_updateCity() finish");
		},
		on_deleteCity : function(city_id) {
			var row = this.getCitiesTableRowIndexByID(city_id);
			if (row >= 0) {
				this.citiesTable.getTableModel().removeRows(row, 1);
			}
			row = this.getCityLocalizationTableRowIndexByID(city_id);
			if (row >= 0) {
				this.citiesLocalizationTable.getTableModel().removeRows(row, 1);
			}

		}
		
	}
});