/*
 * #asset(bus/admin/images/*)
 */

 qx.Class.define("bus.admin.mvp.view.cities.CityLeftPanel", {
 	extend : qx.ui.container.Composite,
 	include : [bus.admin.mvp.view.cities.mix.CityLeftPanelListeners],
 	events : {
 		"load_finish" : "qx.event.type.Event"
 	},
 	construct : function(presenter) {
 		this._presenter = presenter;
 		this.base(arguments);
 		this.setOptions();
 		this.initWidgets();
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
 		 _btn_change : null,

 	    /**
 		 * Таблица отображения информации о городах.
 		 * @type {qx.ui.table.Table}
 		 */
 		 _tableCities : null,



 		 btn_delete : null,
 		 btn_refresh : null,
 		 btn_move : null,
 		 btn_save : null,
 		 btn_cancel : null,

 		 save_status : "none",

 		/**
 		 * Загружает в выпадающий список __comboLangs названия поддерживаемых языков.
 		 * @param  langsModel {bus.admin.mvp.model.LanguagesModel}   Модель хранит информацию о языках
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
 		 */
 		 _onClickBtnChange : function() {
 		 	var row = this._tableCities.getSelectionModel()
 		 	.getAnchorSelectionIndex();
 		 	if (row < 0)
 		 		return;
 		 	var cityID = this._tableCities.getTableModel().getData()[row][0];
 		 	var cityModel = this._presenter.getDataStorage().getCitiesModel().getCityByID(cityID);
 		 	var changeDialog = new bus.admin.mvp.view.cities.CUCityForm(this._presenter, true, cityModel);
 		 	changeDialog.open();
 		 },



 		 on_btn_save_click : function() {
 		 	this.btn_save.setVisibility("hidden");
 		 	this.btn_cancel.setVisibility("hidden");
 		 	this.btn_move.setVisibility("visible");
 		 	this._btn_change.setVisibility("visible");
 		 	this.btn_delete.setVisibility("visible");
 		 	this.btn_refresh.setEnabled(true);
 		 	if (this.save_status.toString() == "move") {
 		 		this._tableCities.setEnabled(true);
 		 		var row = this._tableCities.getSelectionModel()
 		 		.getAnchorSelectionIndex();
 		 		if (row < 0)
 		 			return;
 		 		var rowData = this._tableCities.getTableModel()
 		 		.getRowDataAsMap(row);
 		 		var map = this._citiesPage.getCityMap();
 		 		var marker = map.getMarkerByID(rowData.ID);

 		 		var old_city = qx.core.Init.getApplication().getModelsContainer()
 		 		.getCitiesModel().getCityByID(rowData.ID);
 		 		this.debug("on_cityTable_changeSelection(): move status");
 		 		var new_city = {
 		 			id : old_city.id,
 		 			location : {
 		 				x : marker.getPosition().lat(),
 		 				y : marker.getPosition().lng()
 		 			},
 		 			scale : map.getGoogleMap().getMapObject().getZoom(),
 		 			name_key : old_city.name_key,
 		 			names : old_city.names,
 		 			isShow : old_city.isShow
 		 		};
 		 		map.finishMoveMarker(rowData.ID);
 		 		qx.core.Init.getApplication().setWaitingWindow(true);

 		 		var event_finish_func = qx.lang.Function.bind(function(data) {
 		 			console.info("cityLeftPanel: on_update_city:  event_finish_func()");
 		 			qx.core.Init.getApplication()
 		 			.setWaitingWindow(false);
 		 		}, this);

 		 		this._citiesPage.getPresenter().updateCity(old_city, new_city,
 		 			event_finish_func);
 		 	}
 		 	this.save_status = "none";
 		 },

 		 getCitiesTableRowIndexByID : function(id) {
 		 	for (var i = 0; i < this._tableCities.getTableModel().getRowCount(); i++) {
 		 		var rowData = this._tableCities.getTableModel()
 		 		.getRowDataAsMap(i);
 		 		if (rowData.ID == id) {
 		 			return i;
 		 		}
 		 	}
 		 	return null;
 		 },
 		 getCityLocalizationTableRowIndexByID : function(id) {
 		 	for (var i = 0; i < this._tableCityNames.getTableModel()
 		 		.getRowCount(); i++) {
 		 		var rowData = this._tableCityNames.getTableModel()
 		 	.getRowDataAsMap(i);
 		 	if (rowData.ID == id) {
 		 		return i;
 		 	}
 		 }
 		 return null;
 		},

 		on_btn_cancel_click : function() {
 			this.btn_save.setVisibility("hidden");
 			this.btn_cancel.setVisibility("hidden");
 			this.btn_move.setVisibility("visible");
 			this.btn_refresh.setEnabled(true);
 			this._btn_change.setVisibility("visible");
 			this.btn_delete.setVisibility("visible");
 			if (this.save_status.toString() == "move") {
 				this._tableCities.setEnabled(true);
 				var row = this._tableCities.getSelectionModel()
 				.getAnchorSelectionIndex();
 				if (row >= 0) {
 					var rowData = this._tableCities.getTableModel()
 					.getRowDataAsMap(row);
 					var map = this._citiesPage.getCityMap();
 					map.finishMoveMarker(rowData.ID);
 					map.updateMarker(rowData.ID, rowData.Lat, rowData.Lon);
 				}
 			}
 			this.save_status = "none";
 		},

 		on_btn_move_click : function() {

 			var row = this._tableCities.getSelectionModel()
 			.getAnchorSelectionIndex();
 			if (row >= 0) {
 				this.btn_save.setVisibility("visible");
 				this.btn_cancel.setVisibility("visible");
 				this.btn_move.setVisibility("hidden");
 				this._btn_change.setVisibility("hidden");
 				this.btn_delete.setVisibility("hidden");
 				this.btn_refresh.setEnabled(false);
 				this._tableCities.setEnabled(false);
 				this.save_status = "move";
 				var rowData = this._tableCities.getTableModel()
 				.getRowDataAsMap(row);

 				var map = this._citiesPage.getCityMap();
 				map.startMoveMarker(rowData.ID);
 				map.getGoogleMap().setCenter(rowData.Lat, rowData.Lon,
 					rowData.Scale);
 			}

 		},



 		on_btn_delete_click : function() {
 			var row = this._tableCities.getSelectionModel()
 			.getAnchorSelectionIndex();
 			if (row < 0)
 				return;
 			var rowData = this._tableCities.getTableModel().getRowDataAsMap(row);

 			qx.core.Init.getApplication().setWaitingWindow(true);
 			var event_finish_func = qx.lang.Function.bind(function(data) {
 				qx.core.Init.getApplication().setWaitingWindow(false);
 			}, this);
 			this._citiesPage.getPresenter().deleteCity(rowData.ID,
 				event_finish_func);

 		},

 		on_btn_refresh_click : function() {
 			qx.core.Init.getApplication().setWaitingWindow(true);
 			var callback = qx.lang.Function.bind(function(data) {
 				qx.core.Init.getApplication().setWaitingWindow(false);
 			}, this);
 			this._presenter.refreshTrigger(callback);
 		},

 		_onChangeSelectionTableCities : function(e) {
 			this.debug("execute _onChangeSelectionTableCities()");
 			var row = -1;
 			if(this._tableCities.getSelectionModel() != undefined)
 				row = this._tableCities.getSelectionModel().getAnchorSelectionIndex();
 			
 			if (row >= 0) {
 				this.btn_delete.setEnabled(true);
 				this._btn_change.setEnabled(true);
 				this.btn_move.setEnabled(true);
 			} else {
 				this.btn_delete.setEnabled(false);
 				this._btn_change.setEnabled(false);
 				this.btn_move.setEnabled(false);
 			}
 		},

 		/**
 		 * [_onDblClickTableCities description]
 		 * @param  {[type]} e [description]
 		 */
 		 _onDblClickTableCities : function(e) {
 		 	this.debug("execute _onDblClickTableCities() event handler");
 		 	var selectedRow = this._tableCities.getSelectionModel().getAnchorSelectionIndex();
 		 	this.debug("selectedRow: ", selectedRow);
 		 	if (selectedRow >= 0) {
 		 		var rowsData = this._tableCities.getTableModel().getData();
 		 		var selectedCityID = rowsData[selectedRow][0];
 		 		this._presenter.selectCityTrigger(selectedCityID, null, this);
 		 	}
 		 },

 		 on_change__tableCityNames : function(eventData) {
 		 	return;
 		 	var data = eventData.getData();

 		 	this.debug(data.value);
 		 	this.debug(data.oldValue);
 		 	if (data == null || data.row < 0 || data.value == null
 		 		|| data.value.toString().length <= 0
 		 		|| data.value == data.oldValue) {
				// data.oldValue
				// setValue
				this._tableCityNames.getTableModel().setValue(data.col,
					data.row, data.oldValue);
				return;
			}

			this.debug("on__tableCityNames2");
			var row = data.row;
			var rowData = this._tableCities.getTableModel().getRowDataAsMap(row);

			var currCity = qx.core.Init.getApplication().getModelsContainer()
			.getCitiesModel().getCityByID(rowData.ID);
			// prepare Model
			var updateCity = bus.admin.helpers.ObjectHelper.clone(currCity);
			var lang_id = null;
			if (data.col == 1) {
				
				lang_id = "c_" + qx.locale.Manager.getInstance().getLocale();
			} else if (data.col == 2) {
				var langName = bus.admin.helpers.WidgetHelper
				.getValueFromSelectBox(this._comboLangs);
				var lang = qx.core.Init.getApplication().getModelsContainer()
				.getLangsModel().getLangByName(langName);
				lang_id = lang.id;
			}
			bus.admin.mvp.model.helpers.CitiesModelHelper.updateCityName(
				updateCity, lang_id, data.value);

			var globalPresenter = qx.core.Init.getApplication().getPresenter();
			qx.core.Init.getApplication().setWaitingWindow(true);
			var event_finish_func = qx.lang.Function.bind(function(data) {
				qx.core.Init.getApplication().setWaitingWindow(false);
			}, this);
			globalPresenter.updateCity(currCity, updateCity, event_finish_func);
		},

		_on_resize : function() {
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
			this.btn_save.setUserBounds(this.getBounds().width - 200, this
				.getBounds().height
				- 65, this.btn_save.getBounds().width,
				this.btn_save.getBounds().height);
			this.btn_cancel.setUserBounds(this.getBounds().width - 100, this
				.getBounds().height
				- 65, this.btn_cancel.getBounds().width,
				this.btn_cancel.getBounds().height);

			this._btn_change.setUserBounds(this.getBounds().width - 200, this
				.getBounds().height
				- 65, this._btn_change.getBounds().width,
				this._btn_change.getBounds().height);
			this.btn_delete.setUserBounds(this.getBounds().width - 100, this
				.getBounds().height
				- 65, this.btn_delete.getBounds().width,
				this.btn_delete.getBounds().height);
			this.btn_refresh.setUserBounds(10, this.getBounds().height - 65,
				this.btn_refresh.getBounds().width, this.btn_refresh
				.getBounds().height);
			this.btn_move.setUserBounds(this.getBounds().width - 300, this
				.getBounds().height
				- 65, this.btn_move.getBounds().width,
				this.btn_move.getBounds().height);

			this._comboLangs.setUserBounds(this.getBounds().width - 140,
				this._comboLangs.getBounds().top, this._comboLangs
				.getBounds().width,
				this._comboLangs.getBounds().height);
		},

		setOptions : function(){
			this.setLayout(new qx.ui.layout.Canvas());
			this.setWidth(360);
			this.setMinWidth(360);
			this.setAppearance("left-panel");
			this.addListener("resize", this._on_resize, this);
		},

		initWidgets : function() {

			// radiobuttons
			var radioButtonGroupHBox = new qx.ui.form.RadioButtonGroup();
			radioButtonGroupHBox.setLayout(new qx.ui.layout.HBox(5));
			var infoButton = new qx.ui.form.RadioButton(this.tr("Information"));
			var locButton = new qx.ui.form.RadioButton(this.tr("Localization"));
			infoButton.addListener("execute", function() {
				this._tableCities.setVisibility('visible');
				this._tableCityNames.setVisibility('hidden');
				this._comboLangs.setVisibility('hidden');
				this.btn_move.setVisibility("visible");
				this._btn_change.setVisibility("visible");
				this.btn_delete.setVisibility("visible");
			}, this);
			locButton.addListener("execute", function() {
				this._tableCities.setVisibility('hidden');
				this._tableCityNames.setVisibility('visible');
				this._comboLangs.setVisibility('visible');
				this.btn_move.setVisibility("hidden");
				this._btn_change.setVisibility("hidden");
				this.btn_delete.setVisibility("hidden");
			}, this);

			radioButtonGroupHBox.add(infoButton);
			radioButtonGroupHBox.add(locButton);

			this.add(radioButtonGroupHBox, {
				left : 10,
				top : 10
			});
			this._createTableCities();
			this._createTableCityNames();

			// buttons
			this._btn_change = new qx.ui.form.Button("Change",
				"bus/admin/images/btn/utilities-text-editor.png");
			this._btn_change.setWidth(90);
			this._btn_change.addListener("execute", this._onClickBtnChange,	this);


			this.btn_delete = new qx.ui.form.Button("Delete",
				"bus/admin/images/btn/edit-delete.png");
			this.btn_delete.setWidth(90);

			this.btn_move = new qx.ui.form.Button(this.tr("Move"),
				"bus/admin/images/btn/go-bottom.png");
			this.btn_move.setWidth(90);

			this.btn_save = new qx.ui.form.Button("Save",
				"bus/admin/images/btn/dialog-apply.png");
			this.btn_save.setWidth(90);

			this.btn_cancel = new qx.ui.form.Button("Cancel",
				"bus/admin/images/btn/dialog-cancel.png");
			this.btn_cancel.setWidth(90);

			this.btn_refresh = new qx.ui.form.Button("",
				"bus/admin/images/btn/view-refresh.png");
			this.btn_refresh.setWidth(35);

			this.btn_save.setVisibility("hidden");
			this.btn_cancel.setVisibility("hidden");

			this.btn_save.addListener("execute", this.on_btn_save_click, this);
			this.btn_cancel.addListener("execute", this.on_btn_cancel_click,
				this);
			
			this.btn_delete.addListener("execute", this.on_btn_delete_click,
				this);
			this.btn_move.addListener("execute", this.on_btn_move_click, this);
			this.btn_refresh.addListener("execute", this.on_btn_refresh_click,
				this);
			this.add(this.btn_save);
			this.add(this.btn_cancel);
			this.add(this._btn_change);
			this.add(this.btn_delete);
			this.add(this.btn_move);
			this.add(this.btn_refresh);

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
				this._on_resize();
			}, this);
			this._onChangeSelectionTableCities();
			this.debug("CityLeftPanel was initialized");
		},

		/**
		 * Создает таблицу для редактирования названий городов для разных языков
		 */
		 _createTableCityNames: function() {
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
				this.on_change__tableCityNames, this);
			this._tableCityNames = tableCityNames;
			this.add(this._tableCityNames, {
				top : 40,
				left : 10
			});
		},

		_createTableCities : function() {
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
