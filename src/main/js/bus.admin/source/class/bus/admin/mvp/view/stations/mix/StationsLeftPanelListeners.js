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
 * Расширение класса {@link bus.admin.mvp.view.stations.StationsLeftPanel}. В расширении размещаются методы обработки 
 * событий Presenter`а {@link bus.admin.mvp.presenter.StationsPresenter}.
 */
qx.Mixin.define("bus.admin.mvp.view.stations.mix.StationsLeftPanelListeners", {
	construct : function() {
		var presenter = this._presenter;
		presenter.addListener("refresh", this._onRefresh, this);
		presenter.addListener("load_stations_list", this._onLoadStationsList, this);
		presenter.addListener("select_station", this._onSelectStation, this);
		presenter.addListener("insert_station", this._onInsertStation, this);
		presenter.addListener("update_station", this._onUpdateStation, this);
		presenter.addListener("remove_station", this._onRemoveStation, this);

	},
	members : {

		/**
		 * Обработчик события {@link bus.admin.mvp.presenter.StationsPresenter#refresh refresh}
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
		 	this._fillComboCities(citiesModel, selectedCityID);
		 },

		/**
		 * Обработчик события {@link bus.admin.mvp.presenter.StationsPresenter#load_stations_list load_stations_list}
		 * @param  e {qx.event.type.Data} Данные события. Структуру свойств смотрите в описании события.
		 */
		 _onLoadStationsList : function(e){
		 	this.debug("execute _onLoadStationsList() event handler");
		 	this._fillTableStations(e.getData().stList);
		 },

		/**
		 * Обработчик события {@link bus.admin.mvp.presenter.StationsPresenter#select_station select_station}
		 * @param  e {qx.event.type.Data} Данные события. Структуру свойств смотрите в описании события.
		 */
		 _onSelectStation : function(e){
		 	if (e.getData().station != undefined ) {
		 		this._btnChange.setEnabled(true);
		 		this._btnDelete.setEnabled(true);
		 	} else {
		 		this._btnChange.setEnabled(false);
		 		this._btnDelete.setEnabled(false);
		 	}
		 },

		/**
		 * Обработчик события {@link bus.admin.mvp.presenter.StationsPresenter#insert_station insert_station}
		 * @param  e {qx.event.type.Data} Данные события. Структуру свойств смотрите в описании события.
		 */
		_onInsertStation : function(e) {
			this.debug("execute _onInsertStation() event handler");
			var station = e.getData().station;
			var langID = this._presenter.getDataStorage().getCurrNamesLangID();
			var tableModel = this._tableStations.getTableModel();
			tableModel.setRows([[station.getId(), station.getName(langID)]], tableModel.getRowCount());

		},

		/**
		 * Обработчик события {@link bus.admin.mvp.presenter.StationsPresenter#update_station update_station}
		 * @param  e {qx.event.type.Data} Данные события. Структуру свойств смотрите в описании события.
		 */
		 _onUpdateStation : function(e) {
		 	this.debug("execute _onInsertStation() event handler");
		 	var newStation = e.getData().newStation;
		 	var langID = this._presenter.getDataStorage().getCurrNamesLangID();
		 	var rowIndex = this._getTableRowIndexByStationID(newStation.getId());
		 	if(rowIndex < 0)
		 		return;

		 	var tableModel = this._tableStations.getTableModel();
		 	tableModel.setValue(0, rowIndex, newStation.getId());
		 	tableModel.setValue(1, rowIndex, newStation.getName(langID));

		 },

		/**
		 * Обработчик события {@link bus.admin.mvp.presenter.StationsPresenter#remove_station remove_station}
		 * @param  e {qx.event.type.Data} Данные события. Структуру свойств смотрите в описании события.
		 */
		 _onRemoveStation : function(e) {
		 	this.debug("execute _onRemoveStation() event handler");
		 	var rowIndex = this._getTableRowIndexByStationID(e.getData().stationID);
		 	if(rowIndex < 0)
		 		return;
		 	this._tableStations.getTableModel().removeRows(rowIndex, 1);

		 }


	}
});