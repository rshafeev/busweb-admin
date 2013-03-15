
/**
 * Расширение класса {@link bus.admin.mvp.view.cities.CityLeftPanel}. В расширении размещаются методы обработки 
 * событий Presenter`а {@link bus.admin.mvp.presenter.CitiesPresenter}.
 */
 qx.Mixin.define("bus.admin.mvp.view.cities.mix.CityLeftPanelListeners", {

 	construct : function() {
 		var presenter = this._presenter;
 		presenter.addListener("refresh", this._onRefresh, this);
 		presenter.addListener("select_comboLangs", this._onSelectComboLangs, this);
 		presenter.addListener("select_city", this._onSelectCity, this);
 		/*presenter.addListener("update_city", this.on_update_city, this);
 		presenter.addListener("insert_city", this.on_insert_city, this);
 		presenter.addListener("delete_city", this.on_delete_city, this);*/
 	},
 	members : {
		/**
		 * Обработчик события {@link bus.admin.mvp.presenter.CitiesPresenter#refresh refresh}
		 * @param  e {qx.event.type.Data} Данные события. Структуру свойств смотрите в описании события.
		 */
		 _onRefresh : function(e) {
		 	this.debug("execute on_refresh() event handler");
		 	var data = this._presenter.getDataStorage();
		 	var citiesModel = data.getCitiesModel();
		 	var selectedCityID = data.getSelectedCityID();
		 	var langsModel = data.getLangsModel();
		 	var currNamesLangID = data.getCurrNamesLangID();
		 	this._fillComboLangs(langsModel, currNamesLangID);
		 	this._fillTableCities(citiesModel, selectedCityID);
		 },

		/**
		 * Обработчик события {@link bus.admin.mvp.presenter.CitiesPresenter#select_comboLangs select_comboLangs} 
		 * вызывается при выборе языка в выпадающем списке _comboLangs
		 * @param  {qx.event.type.Data} e Данные события. Структуру свойств смотрите в описании события.
		 */
		 _onSelectComboLangs : function(e){
		 	var data = this._presenter.getDataStorage();
		 	var currNamesLangID = data.getCurrNamesLangID();
		 	var citiesModel = data.getCitiesModel();
		 	this._fillTableCityNames(currNamesLangID, citiesModel);
		 },

		 _onSelectCity : function(e){
		 	var rowData = this._tableCities.getTableModel().getData();
		 	var selectedCityID = e.getData().city.getId();
		 	if(selectedCityID < 0)
		 		return;
		 	var selectedRow = -1;
		 	for(var i=0; i < rowData.length; i++){
		 		if(rowData[i][0] == selectedCityID){
		 			selectedRow = i;
		 		}
		 	}
		 	if(selectedRow >= 0 && this._tableCities.getSelectionModel().isSelectedIndex(selectedRow) == false){
		 		this._tableCities.resetSelectable();
		 		this._tableCities.resetSelection();
		 		this._tableCities.resetCellFocus();
		 		this._tableCities.resetShowCellFocusIndicator();
		 		//var selectionModel = new qx.ui.table.selection.Model()
		 		//this._tableCities.setSelectionModel(selectionModel);
		 		this._tableCities.getSelectionModel().setSelectionInterval(selectedRow, selectedRow);
		 	}
		 },

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


		 on_insert_city : function(e) {
		 	this.debug("on_insert_city()");
		 	var data = e.getData();

		 	if (data == null || data.error == true) {
		 		this.debug("on_refresh_cities() : event data has errors");
		 		return;
		 	}
		 	var locale = "c_" + qx.locale.Manager.getInstance().getLocale();
		 	var langName = bus.admin.helpers.WidgetHelper
		 	.getValueFromSelectBox(this.combo_langs);
		 	var lang = qx.core.Init.getApplication().getModelsContainer().getLangsModel()
		 	.getLangByName(langName);
		 	var name = bus.admin.mvp.model.helpers.CitiesModelHelper
		 	.getCityNameByLang(data.city, lang.id);
		 	var name_ru = bus.admin.mvp.model.helpers.CitiesModelHelper
		 	.getCityNameByLang(data.city, locale);
		 	var tableModel = this.citiesTable.getTableModel();
		 	tableModel.setRows([[data.city.id, name_ru, data.city.location.x,
		 		data.city.location.y, data.city.scale]],
		 		tableModel.getRowCount());
		 	tableModel = this.citiesLocalizationTable.getTableModel();
		 	tableModel.setRows([[data.city.id, name_ru, name]], tableModel
		 		.getRowCount());

		 },
		 on_update_city : function(e) {
		 	this.debug("on_updateCity() start");


			// update citiesTable
			var data = e.getData();
			if (data == null || data.error == true) {
				console.error("on_refresh_cities() : event data has errors");
				return;
			}
			
			var row = this.getCitiesTableRowIndexByID(data.old_city.id);
			if (row == null)
				return;
			var langName = bus.admin.helpers.WidgetHelper
			.getValueFromSelectBox(this.combo_langs);
			var modelsContainer = qx.core.Init.getApplication()
			.getModelsContainer();
			var lang = qx.core.Init.getApplication().getModelsContainer().getLangsModel()
			.getLangByName(langName);
			
			var locale = "c_" + qx.locale.Manager.getInstance().getLocale();
			var name = bus.admin.mvp.model.helpers.CitiesModelHelper
			.getCityNameByLang(data.new_city, lang.id);
			var name_ru = bus.admin.mvp.model.helpers.CitiesModelHelper
			.getCityNameByLang(data.new_city,locale);

			var tableModel = this.citiesTable.getTableModel();
			this.debug("on_update_city(): ");
			this.debug(data.new_city);
			tableModel.setValue(tableModel.getColumnIndexById("Id"), row,
				data.new_city.id);
			tableModel.setValue(1, row, name_ru);
			tableModel.setValue(tableModel.getColumnIndexById("Lat"), row,
				data.new_city.location.x);
			tableModel.setValue(tableModel.getColumnIndexById("Lon"), row,
				data.new_city.location.y);
			tableModel.setValue(tableModel.getColumnIndexById("Scale"), row,
				data.new_city.scale);
			tableModel.setValue(tableModel.getColumnIndexById("Visible"), row,
				data.new_city.isShow.toString());

			// update citiesLocalizationTable
			row = this.getCityLocalizationTableRowIndexByID(data.old_city.id);
			if (row == null)
				return;
			tableModel = this.citiesLocalizationTable.getTableModel();
			tableModel.setValue(0, row, data.new_city.id);
			tableModel.setValue(1, row, name_ru);
			tableModel.setValue(2, row, name);
			this.debug("on_updateCity() finish");
		}
		
	}
});