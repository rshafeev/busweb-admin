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

/*
 * #asset(bus/admin/images/*)
 */

/**
 * Левая панель страницы {@link bus.admin.mvp.view.Cities Cities}
 */
 qx.Class.define("bus.admin.mvp.view.cities.CityLeftPanel", {
 	extend : qx.ui.container.Composite,
 	include : [bus.admin.mvp.view.cities.mix.CityLeftPanelListeners],
 	events : {
 	},
 	/**
 	 * @param  presenter {bus.admin.mvp.presenter.CitiesPresenter}  Presenter
 	 */
 	construct : function(presenter) {
 		this._presenter = presenter;
 		this.base(arguments);
 		this.__setOptions();
 		this.__initWidgets();
 	},

 	destruct : function() {
 		
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
 		 * Виджет "Таблица". Позволяет редактировать навания городов для разных языков.
 		 * @type {qx.ui.table.Table}
 		 */
 		 _tableCityNames : null,

 		/**
 		 * Кнопка вызова диалогового окна редактирования модели выбранного города
 		 * @type {qx.ui.form.Button}
 		 */
 		 _btnChange : null,

 	    /**
 		 * Таблица отображения информации о городах.
 		 * @type {qx.ui.table.Table}
 		 */
 		 _tableCities : null,


 		 /**
 		  * Кнопка для изменения масштаба отображения и местоположения города на карте.
 		  * @type {qx.ui.form.Button}
 		  */
 		  _btnMove : null,

 		  /**
 		   * Кнопка сохранения изменений
 		   * @type {qx.ui.form.Button}
 		   */
 		   _btnSave : null,

 		  /**
 		   * Кнопка удаления города
 		   * @type {qx.ui.form.Button}
 		   */
 		   _btnDelete : null,

 		  /**
 		   * Кнопка обновления страницы
 		   * @type {qx.ui.form.Button}
 		   */ 		   
 		   _btnRefresh : null,

 		  /**
 		   * Кнопка отмены изменений.
 		   * @type {qx.ui.form.Button}
 		   */
 		   _btnCancel : null,


 		  /**
 		   * Группа radio-кнопок для переключения между таблицей городов _tableCities и таблицей названий городов _tableCityNames
 		   * @type {qx.ui.form.RadioButtonGroup}
 		   */
 		   _radioBtnGroup : null,

 		/**
 		 * Загружает в выпадающий список __comboLangs названия поддерживаемых языков.
 		 * @param  langsModel {bus.admin.mvp.model.LanguagesModel}   Модель хранит информацию о языках
 		 * @param  currNamesLangID {String} ID языка, который нужно выбрать после заполнения списка.
 		 */
 		 _fillComboLangs : function(langsModel, currNamesLangID) {
 		 	this.debug("execute _fillComboLangs()");
 		 	var locale = bus.admin.AppProperties.getLocale();
 		 	var langs = langsModel.getLangs();
 		 	var selectedItem = null;

 		 	this._comboLangs.removeAll();
 		 	this.debug("currNamesLangID: ", currNamesLangID);
 		 	for (var i = 0; i < langs.length; i++) {
 		 		if (langs[i].getId().toString() != locale) {
 		 			var item = new qx.ui.form.ListItem(langs[i].getName());
 		 			item.setUserData("langID", langs[i].getId());
 		 			this._comboLangs.add(item);
 		 			if (selectedItem == null || currNamesLangID.toString() == langs[i].getId().toString()) {
 		 				selectedItem = item;
 		 			}
 		 		}
 		 	}

 		 	if (selectedItem != null) {
 		 		this.debug("selected item into _comboLangs");
 		 		this._comboLangs.setSelection([selectedItem]);
 		 	}

 		 },

 		 /**
 		  * Заполняет таблицу _tableCityNames
 		  * @param  langID {String} ID языка
 		  * @param  citiesModel {bus.admin.mvp.model.CitiesModel} Города.
 		  */
 		  _fillTableCityNames : function(langID, citiesModel) {
 		  	var rowData = [];
 		  	this.debug("execute _fillTableCityNames()");
 		  	var cities  = citiesModel.getAllCities();
 		  	var locale = bus.admin.AppProperties.getLocale();
 		  	for (var i = 0; i < cities.length; i++) {
 		  		var localeName = cities[i].getName(locale);
 		  		var name = cities[i].getName(langID);
 		  		rowData.push([cities[i].getId(), localeName, name]);
 		  	}
 		  	this._tableCityNames.getTableModel().setData(rowData);
 		  },

 		/**
 		 * Обработчик события изменения выбранного элемента в выпадающем списке _comboLangs
 		 * @param  e {qx.event.type.Data} Объект события
 		 */
 		 _onChangeComboLangs : function(e) {
 		 	this.debug("execute _onChangeComboLangs()");
 		 	var selectedItimes = e.getData();
 		 	if(selectedItimes == undefined || selectedItimes.length == undefined ||
 		 		selectedItimes.length <=0)
 		 	{
 		 		return;
 		 	}
 		 	var langID = selectedItimes[0].getUserData("langID");
 		 	this._presenter.comboLangsSelectionItemTrigger(langID);
 		 },


 		/**
 		 * Заполняет таблицу городов
 		 * @param citiesModel  {bus.admin.mvp.model.CitiesModel} Модель хранит информацию о городах
 		 * @param selectedCityID {Integer} ID города, который нужно выделить в таблице.
 		 */
 		 _fillTableCities : function(citiesModel, selectedCityID) {
 		 	this.debug("execute _loadDataToCityTable()");
 		 	var rowData = [];
 		 	var cities = citiesModel.getAllCities();
 		 	if (cities.length != null) {
 		 		var locale = bus.admin.AppProperties.getLocale();
 		 		for (var i = 0; i < cities.length; i++) {
 		 			var name = cities[i].getName(locale);
 		 			rowData.push([cities[i].getId(), name, cities[i].getLocation().getLat(),
 		 				cities[i].getLocation().getLon(), cities[i].getScale(), cities[i].getShow().toString()]);
 		 		}
 		 		this._tableCities.getTableModel().setData(rowData);

 		 	}
 		 },

 		/**
 		 * Обработчик события нажатия кнопки "Change"
 		 * @param e {qx.event.type.Event} Объект события.
 		 */
 		 _onClickBtnChange : function(e) {
 		 	var row = this._tableCities.getSelectionModel()
 		 	.getAnchorSelectionIndex();
 		 	if (row < 0)
 		 		return;
 		 	var cityID = this._tableCities.getTableModel().getData()[row][0];
 		 	var cityModel = this._presenter.getDataStorage().getCitiesModel().getCityByID(cityID);
 		 	var changeDialog = new bus.admin.mvp.view.cities.CUCityForm(this._presenter, true, cityModel);
 		 	changeDialog.open();
 		 },


 		 /**
 		  * Обновляет данные города в таблице tableCities
 		  * @param  oldCityModel {bus.admin.mvp.model.CityModel}  Старая модель города.
 		  * @param  newCityModel {bus.admin.mvp.model.CityModel}  Новая модель города.
 		  */
 		  updateTableCitiesModel : function(oldCityModel, newCityModel){
 		  	var rowIndex = this.getRowIndexByIdIntoTableCities(oldCityModel.getId());
 		  	this.debug("updateTableCitiesModel() :: rowIndex :  ", rowIndex, oldCityModel.getId());
 		  	if(rowIndex < 0)
 		  		return;
 		  	var tableModel = this._tableCities.getTableModel();
 		  	var locale = bus.admin.AppProperties.getLocale();
 		  	
 		  	tableModel.setValue(0, rowIndex, newCityModel.getId());
 		  	tableModel.setValue(1, rowIndex, newCityModel.getName(locale));
 		  	tableModel.setValue(2, rowIndex, newCityModel.getLocation().getLat());
 		  	tableModel.setValue(3, rowIndex, newCityModel.getLocation().getLon());
 		  	tableModel.setValue(4, rowIndex, newCityModel.getScale());
 		  	tableModel.setValue(5, rowIndex, newCityModel.getShow().toString());
 		  },

 		 /**
 		  * Обновляет данные города в таблице tableCityNames
 		  * @param  oldCityModel {bus.admin.mvp.model.CityModel}  Старая модель города.
 		  * @param  newCityModel {bus.admin.mvp.model.CityModel}  Новая модель города.
 		  */
 		  updateTableCityNamesModel : function(oldCityModel, newCityModel){
 		  	var rowIndex = this.getRowIndexByIdIntoTableCityNames(oldCityModel.getId());
 		  	this.debug("updateTableCityNamesModel() :: rowIndex :  ", rowIndex, oldCityModel.getId());
 		  	if(rowIndex < 0)
 		  		return;
 		  	var tableModel = this._tableCityNames.getTableModel();
 		  	var locale = bus.admin.AppProperties.getLocale();
 		  	var currLangID = this._presenter.getDataStorage().getCurrNamesLangID();
 		  	tableModel.setValue(0, rowIndex,newCityModel.getId());
 		  	tableModel.setValue(1, rowIndex, newCityModel.getName(locale));
 		  	tableModel.setValue(2, rowIndex, newCityModel.getName(currLangID));
 		  },

 		 /**
 		  * Возвращает индекс строки таблицы tableCities, в которой расположены данные города с данным cityID
 		  * @param cityID {Integer} ID города
 		  * @return {Integer}    Индекс строки таблицы tableCities
 		  */
 		  getRowIndexByIdIntoTableCities : function(cityID) {
 		  	for (var i = 0; i < this._tableCities.getTableModel().getRowCount(); i++) {
 		  		var id = this._tableCities.getTableModel().getData()[i][0];
 		  		if (cityID == id) {
 		  			return i;
 		  		}
 		  	}
 		  	return -1;
 		  },

 		 /**
 		  * Возвращает индекс строки таблицы tableCityNames, в которой расположены данные города с данным cityID
 		  * @param cityID {Integer} ID города
 		  * @return {Integer}    Индекс строки таблицы tableCities
 		  */
 		  getRowIndexByIdIntoTableCityNames : function(cityID) {
 		  	for (var i = 0; i < this._tableCityNames.getTableModel().getRowCount(); i++) {
 		  		var id = this._tableCityNames.getTableModel().getData()[i][0];
 		  		if (cityID == id) {
 		  			return i;
 		  		}
 		  	}
 		  	return -1;
 		  },

 		  /**
 		   * Обработчик события выделения строк в таблице _tableCities
 		   */
 		   _onChangeSelectionTableCities : function() {
 		   	this.debug("execute _onChangeSelectionTableCities()");
 		   	var rowIndex = -1;
 		   	if(this._tableCities.getSelectionModel() != undefined)
 		   		rowIndex = this._tableCities.getSelectionModel().getAnchorSelectionIndex();
 		   	this.debug("rowIndex: ", rowIndex);
 		   	if(rowIndex < 0){
 		   		this._btnDelete.setEnabled(false);
 		   		this._btnChange.setEnabled(false);
 		   		this._btnMove.setEnabled(false);
 		   	}else
 		   	{
 		   		this._btnDelete.setEnabled(true);
 		   		this._btnChange.setEnabled(true);
 		   		this._btnMove.setEnabled(true);
 		   	}
 		   },

 		/**
 		 *  Обработчик события двойного нажатия на строку  в таблице _tableCities
 		 * @param  e {qx.ui.table.pane.CellEvent} Объект события
 		 */
 		 _onDblClickTableCities : function(e) {
 		 	this.debug("execute _onDblClickTableCities() event handler");
 		 	var selectedRow = this._tableCities.getSelectionModel().getAnchorSelectionIndex();
 		 	this.debug("selectedRow: ", selectedRow);
 		 	if (selectedRow >= 0) {
 		 		var rowsData = this._tableCities.getTableModel().getData();
 		 		var selectedCityID = rowsData[selectedRow][0];
 		 		this._presenter.selectCityTrigger(selectedCityID, true, null, this);
 		 	}
 		 },

 		/**
 		 * Обработчик события нажатия на кнопку "Move"
 		 * @param e {qx.event.type.Event} Объект события.
 		 */
 		 __onClickBtnMove : function(e) {
 		 	var rowIndex = this._tableCities.getSelectionModel().getAnchorSelectionIndex();
 		 	if (rowIndex >= 0) {
 		 		bus.admin.widget.MsgDlg.info(this.tr("Please, fix map scale and position for selected city"));
 		 		this._presenter.changeStateTrigger("move");
 		 	}

 		 },

 		/**
 		 * Обработчик события нажатия на кнопку "Delete"
 		 * @param e {qx.event.type.Event} Объект события.
 		 */
 		 __onClickBtnDelete : function(e) {
 		 	var rowIndex = this._tableCities.getSelectionModel().getAnchorSelectionIndex();
 		 	if (rowIndex < 0)
 		 		return;
 		 	var cityID = this._tableCities.getTableModel().getData()[rowIndex][0];
 		 	qx.core.Init.getApplication().setWaitingWindow(true);
 		 	var callback = qx.lang.Function.bind(function(data) {
 		 		qx.core.Init.getApplication().setWaitingWindow(false);
 		 		if (data.error == true) {
 		 			var msg = data.errorInfo != undefined ? this.tr("Error") + data.errorInfo : 
 		 			this.tr("Error! Can not delete city. Please, check input data.");
 		 			bus.admin.widget.MsgDlg.error(msg);
 		 			return;
 		 		}
 		 	}, this);
 		 	this._presenter.removeCityTrigger(cityID, callback, this);

 		 },

 		/**
 		 * Обработчик события нажатия на кнопку "Save"
 		 * @param e {qx.event.type.Event} Объект события.
 		 */
 		 __onClickBtnSave : function(e) {
 		 	if( this._presenter.getDataStorage().getState() == "move"){
 		 		var oldCityModel = this._presenter.getDataStorage().getSelectedCity();
 		 		var mapCenter = this._presenter.getDataStorage().getMapCenter();
 		 		var newCityModel = oldCityModel.clone();
 		 		newCityModel.setLocation(mapCenter.lat, mapCenter.lon);
 		 		newCityModel.setScale(mapCenter.scale);

 		 		qx.core.Init.getApplication().setWaitingWindow(true);
 		 		var callback = qx.lang.Function.bind(function(data) {
 		 			qx.core.Init.getApplication().setWaitingWindow(false);
 		 			this._presenter.changeStateTrigger("none");
 		 			if (data.error == true) {
 		 				var msg = data.errorInfo != undefined ? this.tr("Error") + data.errorInfo : 
 		 				this.tr("Error! Can not update city.");
 		 				bus.admin.widget.MsgDlg.error(msg);
 		 				return;
 		 			}
 		 		}, this);
 		 		this._presenter.updateCityTrigger(oldCityModel, newCityModel, callback, this);

 		 	}
 		 },

 		/**
 		 * Обработчик события нажатия на кнопку "Cancel"
 		 * @param e {qx.event.type.Event} Объект события.
 		 */
 		 __onClickBtnCancel : function(e) {
 		 	this._presenter.changeStateTrigger("none");
 		 	this._presenter.selectCityTrigger(this._presenter.getDataStorage().getSelectedCityID(), true);
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
 		  * Обработчик события изменения данных  ячейке таблицы названий городов.
 		  * @param  e {qx.ui.table.pane.CellEvent} Объект события.
 		  */
 		  __onChangeTableCityNames : function(e) {
 		  	this.debug("execute __onChangeTableCityNames() event handler");
 		  	var data = e.getData();
 		  	this.debug(data.value);
 		  	this.debug(data.oldValue);
 		  	if (data == null || data.row < 0 || data.value == null
 		  		|| data.value.toString().length <= 0
 		  		|| data.value == data.oldValue) {
 		  		this._tableCityNames.getTableModel().setValue(data.col,
 		  			data.row, data.oldValue);
 		  	return;
 		  }

 		  var rowIndex = data.row;
 		  var rowData = this._tableCities.getTableModel().getRowDataAsMap(rowIndex);

 		  var oldCityModel = this._presenter.getDataStorage().getCitiesModel().getCityByID(rowData.ID);
 		  var newCityModel = oldCityModel.clone();

 		  var langID = null;
 		  if(data.col == 1){
 		  	langID = bus.admin.AppProperties.getLocale();
 		  }else
 		  if(data.col == 2){
 		  	langID = this._presenter.getDataStorage().getCurrNamesLangID();
 		  }

 		  if(langID != null){
 		  	newCityModel.setName(langID, data.value);
 		  	qx.core.Init.getApplication().setWaitingWindow(true);
 		  	var callback = qx.lang.Function.bind(function(data) {
 		  		qx.core.Init.getApplication().setWaitingWindow(false);
 		  		if (data.error == true) {
 		  			var msg = data.errorInfo != undefined ? this.tr("Error") + data.errorInfo : 
 		  			this.tr("Error! Can not update city.");
 		  			bus.admin.widget.MsgDlg.error(msg);
 		  			return;
 		  		}
 		  	}, this);
 		  	this._presenter.updateCityTrigger(oldCityModel, newCityModel, callback, this);
 		  }

 		},

 		/**
 		 * Обработчик события вызывается при изменении размеров панели.
 		 */
 		__onResize : function() {
 			if (this._tableCities) {
 				this._tableCities.setWidth(this.getBounds().width
 					- this._tableCities.getBounds().left - 10);
 				this._tableCities.setHeight(this.getBounds().height
 					- this._tableCities.getBounds().top - 70);
 			}
 			if (this._tableCityNames) {
 				this._tableCityNames.setWidth(this.getBounds().width
 					- this._tableCityNames.getBounds().left - 10);
 				this._tableCityNames.setHeight(this.getBounds().height
 					- this._tableCityNames.getBounds().top - 70);
 			}
 			this._btnSave.setUserBounds(this.getBounds().width - 200, this
 				.getBounds().height
 				- 65, this._btnSave.getBounds().width,
 				this._btnSave.getBounds().height);
 			this._btnCancel.setUserBounds(this.getBounds().width - 100, this
 				.getBounds().height
 				- 65, this._btnCancel.getBounds().width,
 				this._btnCancel.getBounds().height);

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
 			this._btnMove.setUserBounds(this.getBounds().width - 300, this
 				.getBounds().height
 				- 65, this._btnMove.getBounds().width,
 				this._btnMove.getBounds().height);

 			this._comboLangs.setUserBounds(this.getBounds().width - 140,
 				this._comboLangs.getBounds().top, this._comboLangs
 				.getBounds().width,
 				this._comboLangs.getBounds().height);
 		},

 		/**
 		 * Устанока начальных опций панели.
 		 */
 		 __setOptions : function(){
 		 	this.setLayout(new qx.ui.layout.Canvas());
 		 	this.setWidth(360);
 		 	this.setMinWidth(360);
 		 	this.setAppearance("left-panel");
 		 	this.addListener("resize", this.__onResize, this);
 		 },

 		/**
 		 * Инициализирует дочерние виджеты.
 		 */
 		 __initWidgets : function() {

			// radiobuttons
			this._radioBtnGroup = new qx.ui.form.RadioButtonGroup();
			this._radioBtnGroup.setLayout(new qx.ui.layout.HBox(5));
			var infoButton = new qx.ui.form.RadioButton(this.tr("Information"));
			var locButton = new qx.ui.form.RadioButton(this.tr("Localization"));
			infoButton.addListener("execute", function() {
				this._tableCities.setVisibility('visible');
				this._tableCityNames.setVisibility('hidden');
				this._comboLangs.setVisibility('hidden');
				this._btnMove.setVisibility("visible");
				this._btnChange.setVisibility("visible");
				this._btnDelete.setVisibility("visible");
			}, this);
			locButton.addListener("execute", function() {
				this._tableCities.setVisibility('hidden');
				this._tableCityNames.setVisibility('visible');
				this._comboLangs.setVisibility('visible');
				this._btnMove.setVisibility("hidden");
				this._btnChange.setVisibility("hidden");
				this._btnDelete.setVisibility("hidden");
			}, this);

			this._radioBtnGroup.add(infoButton);
			this._radioBtnGroup.add(locButton);

			this.add(this._radioBtnGroup, {
				left : 10,
				top : 10
			});
			this.__createTableCities();
			this.__createTableCityNames();

			// buttons
			this._btnChange = new qx.ui.form.Button("Change",
				"bus/admin/images/btn/utilities-text-editor.png");
			this._btnChange.setWidth(90);
			this._btnChange.addListener("execute", this._onClickBtnChange,	this);


			this._btnDelete = new qx.ui.form.Button("Delete",
				"bus/admin/images/btn/edit-delete.png");
			this._btnDelete.setWidth(90);

			this._btnMove = new qx.ui.form.Button(this.tr("Move"),
				"bus/admin/images/btn/go-bottom.png");
			this._btnMove.setWidth(90);

			this._btnSave = new qx.ui.form.Button("Save",
				"bus/admin/images/btn/dialog-apply.png");
			this._btnSave.setWidth(90);

			this._btnCancel = new qx.ui.form.Button("Cancel",
				"bus/admin/images/btn/dialog-cancel.png");
			this._btnCancel.setWidth(90);

			this._btnRefresh = new qx.ui.form.Button("",
				"bus/admin/images/btn/view-refresh.png");
			this._btnRefresh.setWidth(35);

			this._btnSave.setVisibility("hidden");
			this._btnCancel.setVisibility("hidden");

			this._btnSave.addListener("execute", this.__onClickBtnSave, this);
			this._btnCancel.addListener("execute", this.__onClickBtnCancel,
				this);
			
			this._btnDelete.addListener("execute", this.__onClickBtnDelete,this);
			this._btnMove.addListener("execute", this.__onClickBtnMove, this);
			this._btnRefresh.addListener("execute", this.__onClickBtnRefresh,
				this);
			this.add(this._btnSave);
			this.add(this._btnCancel);
			this.add(this._btnChange);
			this.add(this._btnDelete);
			this.add(this._btnMove);
			this.add(this._btnRefresh);

			this._comboLangs = new qx.ui.form.SelectBox();
			this._comboLangs.setVisibility('hidden');
			this._comboLangs.setHeight(25);
			this._comboLangs.addListener("changeSelection",
				this._onChangeComboLangs, this);
			this.add(this._comboLangs, {
				left : 220,
				top : 10
			});

			this.addListenerOnce("appear", function() {
				this.__onResize();
			}, this);
			this._tableCities.getSelectionModel().setSelectionInterval(-1,-1);
			this.debug("CityLeftPanel was initialized");
		},

		/**
		 * Создает таблицу редактирования названий городов для разных языков
		 */
		 __createTableCityNames: function() {
		 	this.debug("execute  _createTableCityNames()");
		 	var tableModel = new qx.ui.table.model.Simple();
		 	tableModel.setColumns(["ID", "Name", "Name(lang)"]);
		 	tableModel.setColumnEditable(0, false);
		 	tableModel.setColumnEditable(1, true);
		 	tableModel.setColumnEditable(2, true);

			// table
			var tableCityNames = new qx.ui.table.Table(tableModel)
			.set({
				decorator : null
			});
			tableCityNames.setBackgroundColor('white');
			tableCityNames.setStatusBarVisible(false);
			tableCityNames.setVisibility('hidden');
			tableCityNames.addListener("dataEdited",
				this.__onChangeTableCityNames, this);
			this._tableCityNames = tableCityNames;
			this.add(this._tableCityNames, {
				top : 40,
				left : 10
			});
		},

		/**
		 * Создает таблицу городов
		 */
		 __createTableCities : function() {
		 	this.debug("execute  __createTableCities()");
			// table model
			var tableModel = new qx.ui.table.model.Simple();
			tableModel.setColumns(["ID", "Name", "Lat", "Lon", "Scale","Visible"]);
			tableModel.setColumnEditable(0, false);
			tableModel.setColumnEditable(1, false);
			tableModel.setColumnEditable(2, false);
			tableModel.setColumnEditable(3, false);
			tableModel.setColumnEditable(4, false);
			tableModel.setColumnEditable(5, false);

			// table
			var _tableCities = new qx.ui.table.Table(tableModel).set({
				decorator : null
			});
			_tableCities.setBackgroundColor('white');
			_tableCities.setStatusBarVisible(false);
			_tableCities.addListener("cellDblclick", this._onDblClickTableCities, this);
			_tableCities.getSelectionModel().addListener("changeSelection", this._onChangeSelectionTableCities, this);

			this._tableCities = _tableCities;
			this.add(this._tableCities, {
				top : 40,
				left : 10
			});
		}

	}
});
