/*************************************************************************
 *
 * Copyright:
 * Bus.Admin-lib is copyright (c) 2012, {@link http://ways.in.ua} Inc. All Rights Reserved. 
 *
 * License:
 * Bus.Admin-lib is free software, licensed under the MIT license. 
 * See the file {@link http://api.ways.in.ua/license.txt license.txt} in this distribution for more details.
 *
 * Authors:
 * Roman Shafeyev (rs@premiumgis.com)
 *
 *************************************************************************/
 
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
 		presenter.addListener("update_city", this._onUpdateCity, this);
 		presenter.addListener("insert_city", this._onInsertCity, this);
 		presenter.addListener("remove_city", this._onRemoveCity, this);
 		presenter.addListener("change_state", this._onChangeState, this);

 	},
 	
 	members : {
		/**
		 * Обработчик события {@link bus.admin.mvp.presenter.CitiesPresenter#refresh refresh}
		 * @param  e {qx.event.type.Data} Данные события. Структуру свойств смотрите в описании события.
		 */
		 _onRefresh : function(e) {
		 	this.debug("execute _onRefresh() event handler");
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
		 * вызывается при выборе пользователем языка в выпадающем списке _comboLangs
		 * @param e  {qx.event.type.Data} Данные события. Структуру свойств смотрите в описании события.
		 */
		 _onSelectComboLangs : function(e){
		 	this.debug("execute _onSelectComboLangs() event handler");
		 	var data = this._presenter.getDataStorage();
		 	var currNamesLangID = data.getCurrNamesLangID();
		 	var citiesModel = data.getCitiesModel();
		 	this._fillTableCityNames(currNamesLangID, citiesModel);
		 },

		 /**
		  * Обработчик события  {@link bus.admin.mvp.presenter.CitiesPresenter#select_city select_city} вызывается при выборе пользователем города.
		  * @param  e {qx.event.type.Data} Данные события. Структуру свойств смотрите в описании события.
		  */
		  _onSelectCity : function(e){
		  	this.debug("execute _onSelectCity() event handler");
		  	var rowData = this._tableCities.getTableModel().getData();
		  	var selectedCityID = e.getData().city != undefined ? e.getData().city.getId() : -1;

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
		  		this._tableCities.getSelectionModel().setSelectionInterval(selectedRow, selectedRow);
		  	}

		  },

		 /**
		  * Обработчик события  {@link bus.admin.mvp.presenter.CitiesPresenter#update_city update_city} вызывается при изменении модели города.
		  * @param  e {qx.event.type.Data} Данные события. Структуру свойств смотрите в описании события.
		  */
		  _onUpdateCity : function(e) {
		  	this.debug("execute _onUpdateCity() event handler");
		  	var oldCityModel = e.getData().oldCity;
		  	var newCityModel = e.getData().newCity;

		  	this.updateTableCitiesModel(oldCityModel, newCityModel);
		  	this.updateTableCityNamesModel(oldCityModel, newCityModel);

		  },

		 /**
		  * Обработчик события  {@link bus.admin.mvp.presenter.CitiesPresenter#insert_city insert_city} вызывается при добавлении нового города.
		  * @param  e {qx.event.type.Data} Данные события. Структуру свойств смотрите в описании события.
		  */
		  _onInsertCity : function(e) {
		  	if(e.getData().sender == this)
		  		return;
		  	this.debug("execute _onInsertCity() event handler");
		  	var cityModel = e.getData().city;
		  	var locale = qx.core.Init.getApplication().getDataStorage().getLocale();
		  	var currLangID = this._presenter.getDataStorage().getCurrNamesLangID();

 		  	// Добавим город в таблицу _tableCities
 		  	var citiesTableModel = this._tableCities.getTableModel();
 		  	citiesTableModel.setRows([[cityModel.getId(), cityModel.getName(locale), cityModel.getLocation().getLat(),
 		  		cityModel.getLocation().getLon(), cityModel.getScale(), cityModel.getShow().toString()]], citiesTableModel.getRowCount());

		  	// Добавим город в таблицу _tableCityNames
		  	var cityNamesTableModel = this._tableCityNames.getTableModel();
		  	cityNamesTableModel.setRows([[cityModel.getId(), cityModel.getName(locale), cityModel.getName(currLangID) ]], 
		  		cityNamesTableModel.getRowCount()); 	

		  },

		 /**
		  * Обработчик события  {@link bus.admin.mvp.presenter.CitiesPresenter#remove_city remove_city} вызывается при удалении города.
		  * @param  e {qx.event.type.Data} Данные события. Структуру свойств смотрите в описании события.
		  */
		  _onRemoveCity : function(e) {
		  	this.debug("execute _onRemoveCity() event handler");
		  	var rowIndex = this.getRowIndexByIdIntoTableCities(e.getData().cityID);
		  	if (rowIndex >= 0) {
		  		this._tableCities.getTableModel().removeRows(rowIndex, 1);
		  	}

		  	rowIndex = this.getRowIndexByIdIntoTableCityNames(e.getData().cityID);
		  	if (rowIndex >= 0) {
		  		this._tableCityNames.getTableModel().removeRows(rowIndex, 1);
		  	}
		  	this._tableCities.resetSelectable();
		  	this._tableCities.resetSelection();
		  	this._tableCities.resetCellFocus();
		  	this._tableCities.resetShowCellFocusIndicator();
		  	this._tableCities.getSelectionModel().setSelectionInterval(-1,-1);
		  },

		 /**
		  * Обработчик события  {@link bus.admin.mvp.presenter.CitiesPresenter#remove_city remove_city} вызывается при изменении состояния страницы.
		  * @param  e {qx.event.type.Data} Данные события. Структуру свойств смотрите в описании события.
		  */
		  _onChangeState : function(e){
		  	this.debug("execute _onChangeState() event handler");
		  	if(e.getData().newState == "none" ){
		  		this._btnSave.setVisibility("hidden");
		  		this._btnCancel.setVisibility("hidden");
		  		this._btnMove.setVisibility("visible");
		  		this._btnRefresh.setEnabled(true);
		  		this._btnChange.setVisibility("visible");
		  		this._btnDelete.setVisibility("visible");
		  		this._tableCities.setEnabled(true);
		  		this._radioBtnGroup.setEnabled(true);
		  	}
		  	else 
		  		if(e.getData().newState == "move"){
		  			this._btnSave.setVisibility("visible");
		  			this._btnCancel.setVisibility("visible");
		  			this._btnMove.setVisibility("hidden");
		  			this._btnChange.setVisibility("hidden");
		  			this._btnDelete.setVisibility("hidden");
		  			this._btnRefresh.setEnabled(false);
		  			this._tableCities.setEnabled(false);
		  			this._radioBtnGroup.setEnabled(false);
		  		}

		  	}

		  }
		});