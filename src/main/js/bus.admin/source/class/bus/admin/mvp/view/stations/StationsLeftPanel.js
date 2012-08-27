/*
 * #asset(qx/icon/${qx.icontheme}/16/apps/utilities-terminal.png)
 * #asset(qx/icon/${qx.icontheme}/32/apps/utilities-terminal.png)
 * #asset(qx/icon/${qx.icontheme}/16/apps/utilities-notes.png)
 * #asset(qx/icon/${qx.icontheme}/16/apps/utilities-calculator.png)
 * #asset(qx/icon/${qx.icontheme}/16/apps/utilities-help.png)
 * 
 * 
 * 
 */

qx.Class.define("bus.admin.mvp.view.stations.StationsLeftPanel", {
	extend : qx.ui.container.Composite,
	include : [bus.admin.mvp.view.stations.mix.StationsLeftPanelListeners],
	events : {
		"load_finish" : "qx.event.type.Event"
	},
	construct : function(stationsPage) {

		this._stationsPage = stationsPage;
		this.base(arguments);
		this.setLayout(new qx.ui.layout.Canvas());
		this.setWidth(460);
		this.setMinWidth(380);
		this.setAppearance("left-panel");
		this.setTransportType("c_bus");

		this.addListener("resize", this.on_resize_panel, this);
		this.initWidgets();

	},
	properties : {
		transportType : {
			nullable : true
		}
	},
	members : {
		/**
		 * data
		 */
		_stations : null,
		/**
		 * widgets
		 */

		combo_cities : null,
		radioButtonGroup : null,
		__stationsTable : null,
		__filterField : null,
		btn_change : null,
		btn_delete : null,
		btn_refresh : null,
		btn_move : null,
		btn_save : null,
		btn_cancel : null,
		combo_langs : null,
		save_status : "none",

		initialize : function() {

		},
		getSelectableCityID : function() {
			var cityComboItem = bus.admin.helpers.WidgetHelper
					.getSelectionItemFromSelectBox(this.combo_cities);
			if (cityComboItem == null)
				return null;
			return cityComboItem.getUserData("id");
		},
		on_btn_save_click : function() {
			this.btn_save.setVisibility("hidden");
			this.btn_cancel.setVisibility("hidden");
			this.btn_move.setVisibility("visible");
			this.btn_change.setVisibility("visible");
			this.btn_delete.setVisibility("visible");
			this.btn_refresh.setEnabled(true);
			if (this.save_status.toString() == "move") {
				this.__stationsTable.setEnabled(true);
				var row = this.__stationsTable.getSelectionModel()
						.getAnchorSelectionIndex();
				if (row < 0)
					return;
				/*
				 * var rowData = this.citiesTable.getTableModel()
				 * .getRowDataAsMap(row); var map =
				 * this._citiesPage.getCityMap(); var marker =
				 * map.getMarkerByID(rowData.ID);
				 * 
				 * var old_city = this._citiesPage.getModelsContainer()
				 * .getCitiesModel().getCityByID(rowData.ID);
				 * this.debug("on_cityTable_changeSelection(): move status");
				 * var new_city = { id : old_city.id, location : { lat :
				 * marker.getPosition().lat(), lon : marker.getPosition().lng() },
				 * scale : map.getGoogleMap().getMapObject().getZoom(), name_key :
				 * old_city.name_key, names : old_city.names };
				 * map.finishMoveMarker(rowData.ID);
				 * qx.core.Init.getApplication().setWaitingWindow(true);
				 * 
				 * var event_finish_func = qx.lang.Function.bind(function(data) {
				 * console .info("cityLeftPanel: on_update_city:
				 * event_finish_func()");
				 * qx.core.Init.getApplication().setWaitingWindow(false); },
				 * this);
				 * 
				 * this._citiesPage.getPresenter().updateCity(old_city,
				 * new_city, event_finish_func);
				 */
			}
			this.save_status = "none";
		},
		on_btn_cancel_click : function() {
			this.btn_save.setVisibility("hidden");
			this.btn_cancel.setVisibility("hidden");
			this.btn_move.setVisibility("visible");
			this.btn_refresh.setEnabled(true);
			this.btn_change.setVisibility("visible");
			this.btn_delete.setVisibility("visible");
			if (this.save_status.toString() == "move") {
				this.__stationsTable.setEnabled(true);
				var row = this.__stationsTable.getSelectionModel()
						.getAnchorSelectionIndex();
				if (row >= 0) {
					/*
					 * var rowData = this.citiesTable.getTableModel()
					 * .getRowDataAsMap(row); var map =
					 * this._citiesPage.getCityMap();
					 * map.finishMoveMarker(rowData.ID);
					 * map.updateMarker(rowData.ID, rowData.Lat, rowData.Lon);
					 */
				}
			}
			this.save_status = "none";
		},
		
		on_btn_move_click : function() {

			var row = this.__stationsTable.getSelectionModel()
					.getAnchorSelectionIndex();
			if (row >= 0) {
				this.btn_save.setVisibility("visible");
				this.btn_cancel.setVisibility("visible");
				this.btn_move.setVisibility("hidden");
				this.btn_change.setVisibility("hidden");
				this.btn_delete.setVisibility("hidden");
				this.btn_refresh.setEnabled(false);
				this.__stationsTable.setEnabled(false);
				this.save_status = "move";
				/*
				 * var rowData = this.citiesTable.getTableModel()
				 * .getRowDataAsMap(row);
				 * 
				 * var map = this._citiesPage.getCityMap();
				 * map.startMoveMarker(rowData.ID);
				 * map.getGoogleMap().setCenter(rowData.Lat, rowData.Lon,
				 * rowData.Scale);
				 */
			}

		},

		on_btn_change_click : function() {

			var row = this.__stationsTable.getSelectionModel()
					.getAnchorSelectionIndex();
			if (row < 0)
				return;
			var rowData = this.__stationsTable.getTableModel()
					.getRowDataAsMap(row);
			var stationModel = null;
		
			for (var i = 0; i < this._stations.length; i++) {
				if (rowData.ID == this._stations[i].id) {
					stationModel = this._stations[i];
					break;
				}
			}

			var changeStationDlg = new bus.admin.mvp.view.stations.CUStationForm(
					true, stationModel);
			changeStationDlg.open();

		},

		on_btn_delete_click : function() {
			var row = this.__stationsTable.getSelectionModel()
					.getAnchorSelectionIndex();
			if (row < 0)
				return;
			/*
			 * var rowData =
			 * this.citiesTable.getTableModel().getRowDataAsMap(row);
			 * 
			 * qx.core.Init.getApplication().setWaitingWindow(true); var
			 * event_finish_func = qx.lang.Function.bind(function(data) {
			 * qx.core.Init.getApplication().setWaitingWindow(false); }, this);
			 * this._citiesPage.getPresenter().deleteCity(rowData.ID,
			 * event_finish_func);
			 */

		},

		on_btn_refresh_click : function() {
			this.refreshStations();
		

		},
		on_resize_panel : function(e) {
			if (this.__stationsTable) {
				this.__stationsTable.setWidth(this.getBounds().width
						- this.__stationsTable.getBounds().left - 10);
				this.__stationsTable.setHeight(this.getBounds().height
						- this.__stationsTable.getBounds().top - 70);
			}

			this.btn_save.setUserBounds(this.getBounds().width - 200, this
							.getBounds().height
							- 65, this.btn_save.getBounds().width,
					this.btn_save.getBounds().height);
			this.btn_cancel.setUserBounds(this.getBounds().width - 100, this
							.getBounds().height
							- 65, this.btn_cancel.getBounds().width,
					this.btn_cancel.getBounds().height);

			this.btn_change.setUserBounds(this.getBounds().width - 200, this
							.getBounds().height
							- 65, this.btn_change.getBounds().width,
					this.btn_change.getBounds().height);
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

		},
		on_change_CitiesComboBox : function(e) {
			var map = this._stationsPage.getStationsMap();

			var cityName = bus.admin.helpers.WidgetHelper
					.getValueFromSelectBox(this.combo_cities);
			var langName = bus.admin.AppProperties.DEFAULT_LANGUAGE;
			var city = this._stationsPage.getModelsContainer().getCitiesModel()
					.getCityByName(cityName, langName);

			if (city) {
				map.getGoogleMap().setCenter(city.location.lat,
						city.location.lon, city.scale);
				this.on_btn_refresh_click();
			}

		},
		on_change_LanguageComboBox : function() {
			this.debug("on_change_LanguageComboBox()");
			var langName = bus.admin.helpers.WidgetHelper
					.getValueFromSelectBox(this.combo_langs);
			if (langName == null)
				return;
			var languagesModel = this._stationsPage.getModelsContainer()
					.getLangsModel();

			this.debug(langName);
			var lang = languagesModel.getLangByName(langName);

			this.loadStationTable(this._stations, lang);

		},
		initWidgets : function() {

			this.addListenerOnce("appear", function() {
						this.on_resize_panel();
					});
			// radio group
			this.radioButtonGroup = this.__createRadioGroup();
			this.add(this.radioButtonGroup, {
						left : 10,
						top : 40
					});

			// table
			this.__filterField = new qx.ui.form.TextField();
			this.__filterField.addListener("input", this.on_change_filterField,
					this);
			this.__stationsTable = this.__createStationsTable();

			this.add(this.__filterField, {
						left : 10,
						top : 70
					});
			this.add(this.__stationsTable, {
						left : 10,
						top : 110
					});

			// buttons

			this.btn_change = new qx.ui.form.Button("Change",
					"bus/admin/images/btn/utilities-text-editor.png");
			this.btn_change.setWidth(90);

			this.btn_delete = new qx.ui.form.Button("Delete",
					"bus/admin/images/btn/edit-delete.png");
			this.btn_delete.setWidth(90);

			this.btn_move = new qx.ui.form.Button("Move",
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
			this.btn_change.addListener("execute", this.on_btn_change_click,
					this);
			this.btn_delete.addListener("execute", this.on_btn_delete_click,
					this);
			this.btn_move.addListener("execute", this.on_btn_move_click, this);
			this.btn_refresh.addListener("execute", this.on_btn_refresh_click,
					this);
			this.add(this.btn_save);
			this.add(this.btn_cancel);
			this.add(this.btn_change);
			this.add(this.btn_delete);
			this.add(this.btn_move);
			this.add(this.btn_refresh);

			// combo_langs
			var labelCity = new qx.ui.basic.Label("City:");
			this.combo_cities = new qx.ui.form.SelectBox();
			this.combo_cities.setHeight(25);
			this.combo_cities.setWidth(170);
			this.combo_cities.addListener("changeSelection",
					this.on_change_CitiesComboBox, this);
			this.add(labelCity, {
						left : 10,
						top : 10
					});
			this.add(this.combo_cities, {
						left : 40,
						top : 10
					});
			var labelLang = new qx.ui.basic.Label("Language:");
			this.combo_langs = new qx.ui.form.SelectBox();
			this.combo_langs.setHeight(25);
			this.combo_langs.addListener("changeSelection",
					this.on_change_LanguageComboBox, this);
			this.add(labelLang, {
						left : 220,
						top : 10
					});
			this.add(this.combo_langs, {
						left : 300,
						top : 10
					});

		},
		loadLanguagesToComboBox : function(langs) {
			this.debug("loadLanguagesToComboBox()");
			var rawData = [];
			var defaultItem = null;

			this.combo_langs.removeAll();
			for (var i = 0; i < langs.length; i++) {
				if (langs[i].id.toString() != bus.admin.AppProperties.DEFAULT_LANGUAGE) {
					if (defaultItem != null) {
						this.combo_langs
								.add(new qx.ui.form.ListItem(langs[i].name));
					} else {
						defaultItem = new qx.ui.form.ListItem(langs[i].name);
						this.combo_langs.add(defaultItem);
					}
					rawData.push(langs[i].name);
				}
			}
			if (defaultItem != null) {
				//this.combo_langs.setSelection([defaultItem]);
			}

		},
		loadCitiesToComboBox : function(cities) {
			this.debug("loadCitiesToComboBox()");
			var defaultItem = null;

			this.combo_cities.removeAll();
			for (var i = 0; i < cities.length; i++) {
				var name = bus.admin.mvp.model.helpers.CitiesModelHelper
						.getCityNameByLang(cities[i],
								bus.admin.AppProperties.DEFAULT_LANGUAGE);
				var item = new qx.ui.form.ListItem(name);
				item.setUserData("id", cities[i].id);
				if (defaultItem != null) {
					this.combo_cities.add(item);
				} else {
					defaultItem = item;
					this.combo_cities.add(item);
				}
			}
			if (defaultItem != null) {
				//this.combo_cities.setSelection([defaultItem]);
			}

		},
		loadStationTable : function(stations, curr_lang) {
			var rowData = [];
			this.debug("loadStationTable1()");
			if (stations != null && stations.length > 0 && curr_lang != null) {
				this.debug("loadStationTable1()");
				for (var i = 0; i < stations.length; i++) {
					var name = bus.admin.mvp.model.helpers.StationsModelHelper
							.getStationNameByLang(stations[i], curr_lang.id);
					var name_default = bus.admin.mvp.model.helpers.StationsModelHelper
							.getStationNameByLang(stations[i],
									bus.admin.AppProperties.DEFAULT_LANGUAGE);
					rowData.push([stations[i].id, name_default, name]);
				}
				this.__stationsTable.getTableModel().setData(rowData);
			}
			this.debug("loadStationTable2()");
		},
		__createStationsTable : function() {
			// table model
			var tableModel = new qx.ui.table.model.Filtered();
			tableModel.setColumns(["ID", "Name", "Name(lang)"]);
			tableModel.setColumnEditable(0, false);
			tableModel.setColumnEditable(1, false);
			tableModel.setColumnEditable(2, false);

			// table
			var routesTable = new qx.ui.table.Table(tableModel).set({
						decorator : null
					});
			routesTable.setBackgroundColor('white');
			routesTable.setStatusBarVisible(false);
			routesTable.addListener("cellDblclick",
					this.on_stationsTable_Dblclick, this);
			routesTable.setHeight(150);

			return routesTable;

		},
		__createRadioGroup : function() {
			var radioButtonGroup = new qx.ui.form.RadioButtonGroup();
			radioButtonGroup.setLayout(new qx.ui.layout.HBox(5));
			var radioBus = new qx.ui.form.RadioButton("Bus");
			var radioTrolley = new qx.ui.form.RadioButton("Trolley");
			var radioTram = new qx.ui.form.RadioButton("Tram");
			var radioMetro = new qx.ui.form.RadioButton("Metro");

			radioBus.addListener("execute", this.on_btn_bus_click, this);
			radioTrolley
					.addListener("execute", this.on_btn_trolley_click, this);
			radioTram.addListener("execute", this.on_btn_tram_click, this);
			radioMetro.addListener("execute", this.on_btn_metro_click, this);

			radioButtonGroup.add(radioBus);
			radioButtonGroup.add(radioTrolley);
			radioButtonGroup.add(radioTram);
			radioButtonGroup.add(radioMetro);
			return radioButtonGroup;
		},
		on_stationsTable_Dblclick : function(e) {
			var row = this.__stationsTable.getSelectionModel()
					.getAnchorSelectionIndex();
			if (row >= 0) {
				var rowData = this.__stationsTable.getTableModel()
						.getRowDataAsMap(row);
				var station_id = rowData.ID;
				var station = null;
				for (var i = 0; i < this._stations.length; i++) {
					if (this._stations[i].id == station_id) {
						station = this._stations[i];
						break;
					}
				}
				if (station != null) {
					var mapWidget = this._stationsPage.getStationsMap();
					mapWidget.selectStationMarker(station_id);
					mapWidget.getGoogleMap().setCenter(station.location.lat,
							station.location.lon, null);
				}

			}
		},
		on_change_filterField : function(e) {
			var fieldValue = this.__filterField.getValue();
			var model = this.__stationsTable.getTableModel();

			if (fieldValue.length > 0) {
				this.debug("on_change_filterField(): " + fieldValue);
				model.resetHiddenRows();
				model.addNotRegex(fieldValue, "Name", true);
				model.applyFilters();
			} else {
				model.resetHiddenRows();
			}

		},
		on_btn_bus_click : function(e) {
			this.setTransportType("c_bus");
			this.on_btn_refresh_click();
			/*
			 * this._routesTabPage.refreshWidgets();
			 * this._newTabPage.refreshWidgets();
			 */
		},
		on_btn_trolley_click : function(e) {
			this.setTransportType("c_trolley");
			this.on_btn_refresh_click();
			/*
			 * this._routesTabPage.refreshWidgets();
			 * this._newTabPage.refreshWidgets();
			 */
		},
		on_btn_tram_click : function(e) {
			this.setTransportType("c_tram");
			this.on_btn_refresh_click();
			/*
			 * this._routesTabPage.refreshWidgets();
			 * this._newTabPage.refreshWidgets();
			 */
		},
		on_btn_metro_click : function(e) {
			this.setTransportType("c_metro");
			this.on_btn_refresh_click();
			/*
			 * this._routesTabPage.refreshWidgets();
			 * this._newTabPage.refreshWidgets();
			 */
		},

		loadStationsTable : function() {
			var rowData = [];
			for (var i = 0; i < 10; i++) {
				rowData.push([i, "test_" + i.toString(), "test_lang"]);
			}

			this.__stationsTable.getTableModel().setData(rowData);

		},
		
		
		refreshStations : function(){
			/*qx.core.Init.getApplication().setWaitingWindow(true);
			var loadStations_finish_func = qx.lang.Function.bind(
					function(data) {
						qx.core.Init.getApplication().setWaitingWindow(false);
					}, this);
			var city_id = this.getSelectableCityID();
			var transport_type_id = this.getTransportType();
			this._stationsPage.getPresenter().loadStations(city_id,
					transport_type_id, loadStations_finish_func);*/
		}
		
		

	}
});