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
 #asset(qx/icon/${qx.icontheme}/16/apps/utilities-terminal.png)
 #asset(qx/icon/${qx.icontheme}/32/apps/utilities-terminal.png)
 #asset(qx/icon/${qx.icontheme}/16/apps/utilities-notes.png)
 #asset(qx/icon/${qx.icontheme}/16/apps/utilities-calculator.png)
 #asset(qx/icon/${qx.icontheme}/16/apps/utilities-help.png)
 */

/**
 * Левая боковая панель страницы "Stations"
 */
 qx.Class.define("bus.admin.mvp.view.stations.StationsLeftPanel", {
 	extend : qx.ui.container.Composite,
 	include : [bus.admin.mvp.view.stations.mix.StationsLeftPanelListeners],
 	events : {
 	},

 	/**
     * @param  presenter   {bus.admin.mvp.presenter.StationsPresenter}  Presenter   
     */
     construct : function(presenter) {
     	this._presenter = presenter;
     	this.base(arguments);
     	this.__initWidgets();
     	this.__setOptions();
     },

     members : {

  		/**
 		 * Presenter представления
 		 * @type {bus.admin.mvp.presenter.CitiesPresenter}
 		 */
 		 _presenter : null,

 		/**
 		 * Выпадающий список языков. При переключении языков изменяется язык названий городов в таблице _tableCityNames
 		 * @type {qx.ui.form.SelectBox}
 		 */
 		 _comboLangs : null,

 		/**
 		 * Выпадающий список городов. При переключении города загружает таблицу станций.
 		 * @type {qx.ui.form.SelectBox}
 		 */
 		 _comboCities : null,


 		/**
 		 * Таблица станций.
 		 * @type {qx.ui.table.Table}
 		 */
 		 _tableStations : null,

 		/**
 		 * Кнопка вызова диалогового окна редактирования модели выбранной остановки
 		 * @type {qx.ui.form.Button}
 		 */
 		 _btnChange : null,

		/**
 		 * Кнопка вызова диалогового окна редактирования модели выбранной остановки
 		 * @type {qx.ui.form.Button}
 		 */
 		 _btnRefresh : null,
 		 
 		 /**
 		  * Поле для фильтрации станций в таблице по назнанию
 		  * @type {qx.ui.form.TextField}
 		  */
 		  _filterField : null,


 		  _btnDelete : null,

 		/**
 		 * Загружает в выпадающий список __comboLangs названия поддерживаемых языков.
 		 * @param  langsModel {bus.admin.mvp.model.LanguagesModel}   Модель хранит информацию о языках
 		 * @param  currNamesLangID {String} ID языка, который нужно выбрать после заполнения списка.
 		 */
 		 _fillComboLangs : function(langsModel, currNamesLangID) {
 		 	this.debug("execute _fillComboLangs()");
 		 	var langs = langsModel.getLangs();
 		 	var selectedItem = null;
 		 	this._comboLangs.removeListener("changeSelection",	this.__onChangeComboLangs, this);
 		 	this._comboLangs.removeAll();
 		 	this.debug("currNamesLangID: ", currNamesLangID);
 		 	for (var i = 0; i < langs.length; i++) {
 		 		var item = new qx.ui.form.ListItem(langs[i].getName());
 		 		item.setUserData("langID", langs[i].getId());
 		 		this._comboLangs.add(item);
 		 		if (selectedItem == null || currNamesLangID.toString() == langs[i].getId().toString()) {
 		 			selectedItem = item;
 		 		}
 		 	}

 		 	if (selectedItem != null) {
 		 		this.debug("selected item into _comboLangs");
 		 		this._comboLangs.setSelection([selectedItem]);
 		 	}

 		 	this._comboLangs.addListener("changeSelection",	this.__onChangeComboLangs, this);
 		 },


  		/**
 		 * Загружает в выпадающий список __comboCities названия городов.
 		 * @param  citiesModel {bus.admin.mvp.model.CitiesModel}   Модель хранит информацию о городах
 		 * @param  selectedCityID {Integer} ID города, который нужно выбрать после заполнения списка.
 		 */
 		 _fillComboCities : function(citiesModel, selectedCityID) {
 		 	this.debug("execute _fillComboLangs()");
 		 	var locale = qx.core.Init.getApplication().getDataStorage().getLocale();
 		 	var cities = citiesModel.getAllCities();
 		 	var selectedItem = null;
 		 	this._comboCities.removeListener("changeSelection", this.__onChangeComboCities, this);
 		 	this._comboCities.removeAll();
 		 	for (var i = 0; i < cities.length; i++) {
 		 		var item = new qx.ui.form.ListItem(cities[i].getName(locale));
 		 		item.setUserData("cityID", cities[i].getId());
 		 		this._comboCities.add(item);
 		 		if (selectedItem == null && selectedCityID == cities[i].getId()) {
 		 			selectedItem = item;
 		 		}
 		 	}

 		 	if (selectedItem != null) {
 		 		this.debug("selected item into _comboCities");
 		 		this._comboCities.setSelection([selectedItem]);
 		 	}
 		 	this._comboCities.addListener("changeSelection", this.__onChangeComboCities, this);

 		 },

  		/**
 		 * Загружает данные в таблицу станций.
 		 * @param  stationsList {bus.admin.mvp.model.StationsListModel}   Список станций
 		 */
 		 _fillTableStations : function(stationsList){
 		 	this.debug("execute _fillTableStations() event handler");
 		 	var rowsData = [];
 		 	var stations = stationsList.getAll();
 		 	for(var i = 0; i <  stations.length; i++){
 		 		rowsData.push([stations[i].getId(), stations[i].getName()]);
 		 	}
 		 	this._tableStations.getTableModel().setData(rowsData);
 		 },

 		/**
 		 * Обработчик события нажатия на кнопку "Refresh"
 		 * @param e {qx.event.type.Event} Объект события.
 		 */
 		 __onClickBtnRefresh : function(e) {
 		 	this.debug("execute __onClickBtnRefresh() event handler");
 		 	qx.core.Init.getApplication().setWaitingWindow(true);
 		 	var callback = qx.lang.Function.bind(function(data) {
 		 		qx.core.Init.getApplication().setWaitingWindow(false);
 		 	}, this);
 		 	this._presenter.refreshTrigger(callback);
 		 },

 		/**
 		 * Обработчик события выбора элемента в выпадающем списке городов
 		 * @param e {qx.event.type.Event} Объект события.
 		 */
 		 __onChangeComboCities : function(e) {
 		 	this.debug("__onChangeComboCities()");

 		 	var selections = this._comboCities.getSelection();
 		 	if (selections == null || selections == []
 		 		|| selections.length <= 0) 
 		 	{
 		 		return;
 		 	}
 		 	var selectItem = selections[0];
 		 	if (selectItem == null)
 		 		return;

 		 	var cityID = selectItem.getUserData("cityID");
 		 	var langID = this._presenter.getDataStorage().getCurrNamesLangID();

 		 	qx.core.Init.getApplication().setWaitingWindow(true);
 		 	var callback = qx.lang.Function.bind(function(data) {
 		 		qx.core.Init.getApplication().setWaitingWindow(false);
 		 		if (data.error == true) {
 		 			var msg = data.errorInfo != undefined ? this.tr("Error! ") + data.errorInfo : 
 		 			this.tr("Error! Can not load stations list. Please, refresh page.");
 		 			bus.admin.widget.MsgDlg.error(msg);
 		 			return;
 		 		}
 		 	}, this);
 		 	this._presenter.loadStationsListTrigger(cityID, langID, callback, this);
 		 	this._presenter.selectCityTrigger(cityID, true);
 		 	this._comboCities.close();

 		 },

 		/**
 		 * Обработчик события выбора элемента в выпадающем списке языков
 		 * @param e {qx.event.type.Event} Объект события.
 		 */
 		 __onChangeComboLangs : function(e) {
 		 	this.debug("__onChangeComboLangs()");
 		 	var selections = this._comboLangs.getSelection();
 		 	if (selections == null || selections == []
 		 		|| selections.length <= 0) 
 		 	{
 		 		return;
 		 	}
 		 	var selectItem = selections[0];
 		 	if (selectItem == null)
 		 		return;

 		 	var langID = selectItem.getUserData("langID");
 		 	var cityID = this._presenter.getDataStorage().getSelectedCityID();
 		 	qx.core.Init.getApplication().setWaitingWindow(true);
 		 	var callback = qx.lang.Function.bind(function(data) {
 		 		qx.core.Init.getApplication().setWaitingWindow(false);
 		 		if (data.error == true) {
 		 			var msg = data.errorInfo != undefined ? this.tr("Error! ") + data.errorInfo : 
 		 			this.tr("Error! Can not load stations list. Please, refresh page.");
 		 			bus.admin.widget.MsgDlg.error(msg);
 		 			return;
 		 		}
 		 	}, this);
 		 	this._presenter.loadStationsListTrigger(cityID, langID, callback, this);
 		 	this._comboLangs.close();

 		 },

 		/**
 		 *  Обработчик события двойного нажатия на строку  в таблице _tableCities
 		 * @param  e {qx.ui.table.pane.CellEvent} Объект события
 		 */
 		 __onDblClickTableStations : function(e) {
 		 	var rowIndex = this._tableStations.getSelectionModel()
 		 	.getAnchorSelectionIndex();
 		 	if (rowIndex >= 0) {
 		 		var rowData = this._tableStations.getTableModel().getRowDataAsMap(rowIndex);
 		 		this._presenter.selectStationTrigger(rowData.ID, true);
 		 	}
 		 },

 		/**
 		 * Обработчик события нажатия кнопки "Change"
 		 * @param e {qx.event.type.Event} Объект события.
 		 */
 		 __onClickBtnChange : function(e) {
 		 	var rowIndex = this._tableStations.getSelectionModel().getAnchorSelectionIndex();
 		 	if(rowIndex < 0)
 		 		return;
 		 	var rowData = this._tableStations.getTableModel().getRowDataAsMap(rowIndex);
 		 	var self = this;
 		 	var callback = function(data){
 		 		if(data.error == true || data.station == undefined)
 		 			return;
 		 		var dlg = new bus.admin.mvp.view.stations.CUStationForm(self._presenter, data.station, true);
 		 		dlg.open();
 		 	};
 		 	this._presenter.getStation(rowData.ID, callback);
 		 },

 		/**
 		 * Обработчик события выделения строки в таблице станций
 		 * @param e {qx.event.type.Event} Объект события.
 		 */
 		 __onChangeSelectionTableStations : function(e) {
 		 	var model = this._tableStations.getTableModel();
 		 	if (model.getRowCount() <= 0) {
 		 		this._presenter.selectStationTrigger(-1, false);
 		 		this._btnChange.setEnabled(false);
 		 		this._btnDelete.setEnabled(false);
 		 	}else{
 		 		this._btnChange.setEnabled(true);
 		 		this._btnDelete.setEnabled(true);		 		
 		 	}
 		 },

 		/**
 		 * Обработчик нажатия кнопки Enter после ввода данных в поле фильтрации станций.
 		 * @param e {qx.event.type.Event} Объект события.
 		 */
 		 __onChangeFilterField : function(e) {
 		 	var fieldValue = this._filterField.getValue();
 		 	var model = this._tableStations.getTableModel();
 		 	if (fieldValue.length > 0) {
 		 		this.debug("__onChangeFilterField(): " + fieldValue);
 		 		model.resetHiddenRows();
 		 		model.addNotRegex(fieldValue, "Name", true);
 		 		model.applyFilters();
 		 	} else {
 		 		model.resetHiddenRows();
 		 	}
 		 },

		/**
		 * Возвращает номер строки в таблице, которая соотетствует станции с идентификатором, равным id
		 * @param  id {Integer}  ID остановки
		 * @return {Integer}    Номер строки
		 */
		 _getTableRowIndexByStationID : function(id) {
		 	var tableModel = this._tableStations.getTableModel();
		 	for (var i = 0; i < tableModel.getRowCount(); i++) {
		 		var rowData = tableModel.getRowDataAsMap(i);
		 		if (rowData.ID == id) {
		 			return i;
		 		}
		 	}
		 	return -1;
		 },

 		/**
 		 * Обработчик события нажатия кнопки "Delete"
 		 * @param e {qx.event.type.Event} Объект события.
 		 */
 		 __onClickBtnDelete : function(e) {
 		 	this.debug("execute __onClickBtnDelete() event handler");
 		 	var rowIndex = this._tableStations.getSelectionModel().getAnchorSelectionIndex();
 		 	if (rowIndex < 0)
 		 		return;
 		 	var rowData = this._tableStations.getTableModel().getRowDataAsMap(rowIndex);
 		 	qx.core.Init.getApplication().setWaitingWindow(true);
 		 	var callback = qx.lang.Function.bind(function(data) {
 		 		qx.core.Init.getApplication().setWaitingWindow(false);
 		 		if (data.error == true) {
 		 			var msg = data.errorInfo != undefined ? this.tr("Error! ") + data.errorInfo : 
 		 			this.tr("Error! Can not delete the station. Other objects depends of it.");
 		 			bus.admin.widget.MsgDlg.info(msg);
 		 			return;
 		 		}
 		 	}, this);
 		 	this._presenter.removeStationTrigger(rowData.ID, callback);

 		 },

 		/**
 		 * Обработчик события вызывается при изменении размеров панели.
 		 */
 		 __onResize : function() {
 		 	if (this._tableStations) {
 		 		this._tableStations.setWidth(this.getBounds().width
 		 			- this._tableStations.getBounds().left - 10);
 		 		this._tableStations.setHeight(this.getBounds().height
 		 			- this._tableStations.getBounds().top - 70);
 		 	}

 		 	this._btnChange.setUserBounds(this.getBounds().width - 200, this
 		 		.getBounds().height
 		 		- 65, this._btnChange.getBounds().width,
 		 		this._btnChange.getBounds().height);
 		 	this._btnDelete.setUserBounds(this.getBounds().width - 100, this
 		 		.getBounds().height
 		 		- 65, this._btnDelete.getBounds().width,
 		 		this._btnDelete.getBounds().height);
 		 	this._btnRefresh.setUserBounds(10, this.getBounds().height - 65,
 		 		this._btnRefresh.getBounds().width, this._btnRefresh
 		 		.getBounds().height);

 		 },

 		/**
 		 * Инициализирует дочерние виджеты.
 		 */
 		 __initWidgets : function() {

 		 	this.setLayout(new qx.ui.layout.Canvas());
 		 	this.setAppearance("left-panel");

 		 	this.addListenerOnce("appear", function() {
 		 		this.__onResize();
 		 	});


			// table
			this._filterField = new qx.ui.form.TextField();
			this._tableStations = this.__createStationsTable();

			this.add(this._filterField, {
				left : 10,
				top : 70
			});
			this.add(this._tableStations, {
				left : 10,
				top : 110
			});

			// buttons

			this._btnChange = new qx.ui.form.Button("Change",
				"bus/admin/images/btn/utilities-text-editor.png");
			this._btnChange.setWidth(90);

			this._btnDelete = new qx.ui.form.Button("Delete",
				"bus/admin/images/btn/edit-delete.png");
			this._btnDelete.setWidth(90);

			this._btnRefresh = new qx.ui.form.Button("",
				"bus/admin/images/btn/view-refresh.png");
			this._btnRefresh.setWidth(35);

			this._btnChange.setEnabled(false);
			this._btnDelete.setEnabled(false);

			this.add(this._btnChange);
			this.add(this._btnDelete);
			this.add(this._btnRefresh);

			// _comboLangs
			var labelCity = new qx.ui.basic.Label("City:");
			this._comboCities = new qx.ui.form.SelectBox();
			this._comboCities.setHeight(25);
			this._comboCities.setWidth(170);

			this.add(labelCity, {
				left : 10,
				top : 10
			});
			this.add(this._comboCities, {
				left : 40,
				top : 10
			});
			var labelLang = new qx.ui.basic.Label("Language:");
			this._comboLangs = new qx.ui.form.SelectBox();
			this._comboLangs.setHeight(25);

			this.add(labelLang, {
				left : 220,
				top : 10
			});
			this.add(this._comboLangs, {
				left : 300,
				top : 10
			});

		},

		/**
		 * Создает таблицу остановок
		 * @return {qx.ui.table.Table} Таблица для отображения списка остановок
		 */
		 __createStationsTable : function() {
			// table model
			var tableModel = new qx.ui.table.model.Filtered();
			tableModel.setColumns(["ID", "Name"]);
			tableModel.setColumnEditable(0, false);
			tableModel.setColumnEditable(1, false);

			// table
			var routesTable = new qx.ui.table.Table(tableModel).set({
				decorator : null
			});
			routesTable.setBackgroundColor('white');
			routesTable.setStatusBarVisible(false);
			routesTable.setHeight(150);

			return routesTable;

		},

 		/**
 		 * Устанока начальных опций панели.
 		 */
 		 __setOptions : function(){
 		 	this.setWidth(460);
 		 	this.setMinWidth(380);
 		 	this.addListener("resize", this.__onResize, this);
 		 	this._filterField.addListener("changeValue", this.__onChangeFilterField, this);
 		 	this._tableStations.addListener("cellDblclick",	this.__onDblClickTableStations, this);
 		 	this._tableStations.getSelectionModel().addListener("changeSelection", this.__onChangeSelectionTableStations, this);

 		 	this._btnChange.addListener("click", this.__onClickBtnChange, this);
 		 	this._btnDelete.addListener("click", this.__onClickBtnDelete, this);
 		 	this._btnRefresh.addListener("click", this.__onClickBtnRefresh,	this);
 		 }

 		}
 	});