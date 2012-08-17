/*
 * #asset(bus/admin/images/*)
 */

qx.Class.define("bus.admin.mvp.view.cities.CityLeftPanel", {
	extend : qx.ui.container.Composite,
	events : {
		"load_finish" : "qx.event.type.Event"
	},
	construct : function(citiesPage) {
		var presenter = citiesPage.getPresenter();
		this.__citiesPage = citiesPage;
		this.base(arguments);
		this.setLayout(new qx.ui.layout.Canvas());
		this.setWidth(360);
		this.setMinWidth(360);
		this.setAppearance("left-panel");
		this.addListener("resize", this.on_resize_panel, this);
		presenter.addListener("moveCity", this.on_move_city, this);
		this.initWidgets();

	},

	members : {
		__citiesPage : null,
		citiesTable : null,
		citiesLocalizationTable : null,
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

		on_loadLanguagesToComboBox : function(langs) {
			this.debug("on_loadLanguagesToComboBox()");
			var rawData = [];
			var defaultItem = null;

			this.combo_langs.removeAll();
			for (var i = 0; i < langs.length; i++) {
				if (langs[i].id.toString() != "c_ru") {
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
				this.combo_langs.setSelection([defaultItem]);
			}

		},

		on_loadDataToCityLocalizationTable : function(curr_lang, cities) {
			var rowData = [];
			this.debug("loadDataToCityLocalizationTable1");
			if (cities.length != null && curr_lang != null) {
				this.debug("loadDataToCityLocalizationTable2");

				for (var i = 0; i < cities.length; i++) {
					var name = bus.admin.mvp.model.helpers.CitiesModelHelper
							.getCityNameByLang(cities[i], curr_lang.id);
					var name_ru = bus.admin.mvp.model.helpers.CitiesModelHelper
							.getCityNameByLang(cities[i], "c_ru");
					rowData.push([cities[i].id, name_ru, name]);
				}
				this.citiesLocalizationTable.getTableModel().setData(rowData);
			}
		},

		on_loadDataToCityTable : function(cities) {
			var rowData = [];
			if (cities.length != null) {
				// this.__cityMap.deleteAllMarkers();
				for (var i = 0; i < cities.length; i++) {
					var name = bus.admin.mvp.model.helpers.CitiesModelHelper
							.getCityNameByLang(cities[i], "c_ru");
					rowData.push([cities[i].id, name, cities[i].location.lat,
							cities[i].location.lon, cities[i].scale]);
				}
				this.citiesTable.getTableModel().setData(rowData);
			}
		},

		on_btn_save_click : function() {
			this.btn_save.setVisibility("hidden");
			this.btn_cancel.setVisibility("hidden");
			this.btn_move.setVisibility("visible");
			this.btn_change.setVisibility("visible");
			this.btn_delete.setVisibility("visible");
			this.btn_refresh.setEnabled(true);
			if (this.save_status.toString() == "move") {
				this.citiesTable.setEnabled(true);
				var row = this.citiesTable.getSelectionModel()
						.getAnchorSelectionIndex();
				if (row < 0)
					return;
				var rowData = this.citiesTable.getTableModel()
						.getRowDataAsMap(row);
				var map = this.__citiesPage.getCityMap();
				var marker = map.getMarkerByID(rowData.ID);
				var old_city = this.__citiesPage.getCitiesModel()
						.getCityByID(rowData.ID);
				var new_city = {
					id : old_city.id,
					location : {
						lat : marker.getPosition().lat(),
						lon : marker.getPosition().lng()
					},
					scale : map.getGoogleMap().getMapObject().getZoom(),
					name_key : old_city.name_key,
					names : old_city.names
				};

				map.finishMoveMarker(rowData.ID);
				qx.core.Init.getApplication().setWaitingWindow(true);
				this.__citiesPage.getDataManager().moveCity(old_city, new_city,
						this);
			}
			this.save_status = "none";
		},

		getCitiesTableRowIndexByID : function(id) {
			for (var i = 0; i < this.citiesTable.getTableModel().getRowCount(); i++) {
				var rowData = this.citiesTable.getTableModel()
						.getRowDataAsMap(i);
				if (rowData.ID == id) {
					return i;
				}
			}
			return null;
		},
		getCityLocalizationTableRowIndexByID : function(id) {
			for (var i = 0; i < this.citiesLocalizationTable.getTableModel()
					.getRowCount(); i++) {
				var rowData = this.citiesLocalizationTable.getTableModel()
						.getRowDataAsMap(i);
				if (rowData.ID == id) {
					return i;
				}
			}
			return null;
		},
		on_refresh_cities : function(e){
		
		},
		on_move_city : function(e) {
			if (e.fire_obj == this) {
				qx.core.Init.getApplication().setWaitingWindow(false);
			}
			if (e.error != null) {
				return;
			} else {
				var row = this.getCitiesTableRowIndexByID(e.new_city.id);
				if (row == null)
					return;
				var tableModel = this.citiesTable.getTableModel();
				tableModel.setValue(tableModel.getColumnIndexById("Id"), row,
						e.new_city.id);
				//tableModel.setValue(1, row, name_ru);
				tableModel.setValue(tableModel.getColumnIndexById("Lat"), row,
						e.new_city.location.lat);
				tableModel.setValue(tableModel.getColumnIndexById("Lon"), row,
						e.new_city.location.lon);
				tableModel.setValue(tableModel.getColumnIndexById("Scale"),
						row, e.new_city.scale);

			}

		},
		on_insertCity : function(city) {
			var langName = bus.admin.helpers.WidgetHelper
					.getValueFromSelectBox(this.combo_langs);
			var lang = this.__citiesPage.getLanguagesModel()
					.getLangByName(langName);
			var name = bus.admin.mvp.model.helpers.CitiesModelHelper
					.getCityNameByLang(city, lang.id);
			var name_ru = bus.admin.mvp.model.helpers.CitiesModelHelper
					.getCityNameByLang(city, "c_ru");
			var tableModel = this.citiesTable.getTableModel();
			tableModel.setRows([[city.id, name_ru, city.location.lat,
							city.location.lon, city.scale]], tableModel
							.getRowCount()
							- 1);
			tableModel = this.citiesLocalizationTable.getTableModel();
			tableModel.setRows([[city.id, name_ru, name]], tableModel
							.getRowCount()
							- 1);

		},
		on_updateCity : function(old_id, city) {
			// update citiesTable
			var row = this.getCitiesTableRowIndexByID(old_id);
			if (row == null)
				return;
			var langName = bus.admin.helpers.WidgetHelper
					.getValueFromSelectBox(this.combo_langs);
			var lang = this.__citiesPage.getLanguagesModel()
					.getLangByName(langName);
			var name = bus.admin.mvp.model.helpers.CitiesModelHelper
					.getCityNameByLang(city, lang.id);
			var name_ru = bus.admin.mvp.model.helpers.CitiesModelHelper
					.getCityNameByLang(city, "c_ru");

			var tableModel = this.citiesTable.getTableModel();
			tableModel.setValue(tableModel.getColumnIndexById("Id"), row,
					city.id);
			tableModel.setValue(1, row, name_ru);
			tableModel.setValue(tableModel.getColumnIndexById("Lat"), row,
					city.location.lat);
			tableModel.setValue(tableModel.getColumnIndexById("Lon"), row,
					city.location.lon);
			tableModel.setValue(tableModel.getColumnIndexById("Scale"), row,
					city.scale);
			// update citiesLocalizationTable
			row = this.getCityLocalizationTableRowIndexByID(old_id);
			if (row == null)
				return;
			tableModel = this.citiesLocalizationTable.getTableModel();
			tableModel.setValue(0, row, city.id);
			tableModel.setValue(1, row, name_ru);
			tableModel.setValue(2, row, name);

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

		},
		on_change_LanguageComboBox : function() {
			this.debug("on_change_LanguageComboBox()");
			var langName = bus.admin.helpers.WidgetHelper
					.getValueFromSelectBox(this.combo_langs);
			if (langName == null)
				return;
			var languagesModel = this.__citiesPage.getLanguagesModel();
			this.debug(langName);
			var lang = languagesModel.getLangByName(langName);
			var citiesData = this.__citiesPage.getCitiesModel().getData();
			this.on_loadDataToCityLocalizationTable(lang, citiesData);

		},
		on_btn_cancel_click : function() {
			this.btn_save.setVisibility("hidden");
			this.btn_cancel.setVisibility("hidden");
			this.btn_move.setVisibility("visible");
			this.btn_refresh.setEnabled(true);
			this.btn_change.setVisibility("visible");
			this.btn_delete.setVisibility("visible");
			if (this.save_status.toString() == "move") {
				this.citiesTable.setEnabled(true);
				var row = this.citiesTable.getSelectionModel()
						.getAnchorSelectionIndex();
				if (row >= 0) {
					var rowData = this.citiesTable.getTableModel()
							.getRowDataAsMap(row);
					var map = this.__citiesPage.getCityMap();
					map.finishMoveMarker(rowData.ID);
					map.updateMarker(rowData.ID, rowData.Lat, rowData.Lon);
				}
			}
			this.save_status = "none";
		},

		on_btn_move_click : function() {

			var row = this.citiesTable.getSelectionModel()
					.getAnchorSelectionIndex();
			if (row >= 0) {
				this.btn_save.setVisibility("visible");
				this.btn_cancel.setVisibility("visible");
				this.btn_move.setVisibility("hidden");
				this.btn_change.setVisibility("hidden");
				this.btn_delete.setVisibility("hidden");
				this.btn_refresh.setEnabled(false);
				this.citiesTable.setEnabled(false);
				this.save_status = "move";
				var rowData = this.citiesTable.getTableModel()
						.getRowDataAsMap(row);

				var map = this.__citiesPage.getCityMap();
				map.startMoveMarker(rowData.ID);
				map.getGoogleMap().setCenter(rowData.Lat, rowData.Lon,
						rowData.Scale);
			}

		},

		on_btn_change_click : function() {

			var row = this.citiesTable.getSelectionModel()
					.getAnchorSelectionIndex();
			if (row < 0)
				return;
			var rowData = this.citiesTable.getTableModel().getRowDataAsMap(row);
			var cityModel = this.__citiesPage.getCitiesModel()
					.getCityByID(rowData.ID);
			var changeDialog = new bus.admin.mvp.view.cities.CUCityForm(
					this.__citiesPage, true, cityModel);
			changeDialog.open();
		},

		on_btn_delete_click : function() {
			var row = this.citiesTable.getSelectionModel()
					.getAnchorSelectionIndex();
			if (row < 0)
				return;
			var rowData = this.citiesTable.getTableModel().getRowDataAsMap(row);
			var city_id = rowData.ID;
			var city_id_json = city_id.toString();
			var citiesRequest = new bus.admin.net.CitiesRequest();
			qx.core.Init.getApplication().setWaitingWindow(true);
			citiesRequest.deleteCity(city_id_json, function(response) {
						var result = response.getContent();
						if (result == null || result.error != null) {
							alert(result.error.toString());
						} else if (result.toString() == "ok") {
							this.__citiesPage.getPresenter()
									.deleteCity(city_id);
						}
						qx.core.Init.getApplication().setWaitingWindow(false);
					}, function() {
						qx.core.Init.getApplication().setWaitingWindow(false);
						alert("server responce error!");
					}, this);

		},

		on_btn_refresh_click : function() {
			this.__citiesPage.getPresenter().refreshCities();
		},

		on_cityTable_changeSelection : function(e) {
			var row = this.citiesTable.getSelectionModel()
					.getAnchorSelectionIndex();
			this.debug("on_cityTable_changeSelection()");
			if (row >= 0) {
				this.btn_delete.setEnabled(true);
				this.btn_change.setEnabled(true);
				this.btn_move.setEnabled(true);
			} else {
				this.btn_delete.setEnabled(false);
				this.btn_change.setEnabled(false);
				this.btn_move.setEnabled(false);
			}

		},

		on_cityTable_click : function(e) {

		},

		on_cityTable_Dblclick : function(e) {

			var row = this.citiesTable.getSelectionModel()
					.getAnchorSelectionIndex();

			if (row >= 0) {
				var rowData = this.citiesTable.getTableModel()
						.getRowDataAsMap(row);
				var map = this.__citiesPage.getCityMap().getGoogleMap();
				map.setCenter(rowData.Lat, rowData.Lon, rowData.Scale);
			}
		},
		on_change_citiesLocalizationTable : function(eventData) {
			var data = eventData.getData();

			this.debug(data.value);
			this.debug(data.oldValue);
			if (data == null || data.row < 0 || data.value == null
					|| data.value.toString().length <= 0
					|| data.value == data.oldValue) {
				// data.oldValue
				// setValue
				this.citiesLocalizationTable.getTableModel().setValue(data.col,
						data.row, data.oldValue);
				return;
			}

			this.debug("on_citiesLocalizationTable2");
			var row = data.row;
			var rowData = this.citiesTable.getTableModel().getRowDataAsMap(row);

			var currCity = this.__citiesPage.getCitiesModel()
					.getCityByID(rowData.ID);
			// prepare Model
			var update_city = bus.admin.helpers.ObjectHelper.clone(currCity);
			var lang_id = null;
			if (data.col == 1) {
				lang_id = "c_ru";
			} else if (data.col == 2) {
				var langName = bus.admin.helpers.WidgetHelper
						.getValueFromSelectBox(this.combo_langs);
				var lang = this.__citiesPage.getLanguagesModel()
						.getLangByName(langName);
				lang_id = lang.id;
			}
			bus.admin.mvp.model.helpers.CitiesModelHelper.updateCityName(
					update_city, lang_id, data.value);

			// send model to the server
			var citiesRequest = new bus.admin.net.CitiesRequest();
			var update_city_json = qx.lang.Json.stringify(update_city);
			qx.core.Init.getApplication().setWaitingWindow(true);
			citiesRequest.updateCity(update_city_json, function(response) {
						var result = response.getContent();
						if (result == null || result.error != null) {
							alert(result.error);
						} else if (result != null) {
							this.__citiesPage.getPresenter().updateCity(result);
							// this.citiesLocalizationTable.setSelectionModel(null);
						}
						qx.core.Init.getApplication().setWaitingWindow(false);
					}, function() {
						alert("server responce error!");
						qx.core.Init.getApplication().setWaitingWindow(false);
					}, this);
		},

		on_resize_panel : function() {
			if (this.citiesTable) {
				this.citiesTable.setWidth(this.getBounds().width
						- this.citiesTable.getBounds().left - 10);
				this.citiesTable.setHeight(this.getBounds().height
						- this.citiesTable.getBounds().top - 70);
			}
			if (this.citiesLocalizationTable) {
				this.citiesLocalizationTable.setWidth(this.getBounds().width
						- this.citiesLocalizationTable.getBounds().left - 10);
				this.citiesLocalizationTable.setHeight(this.getBounds().height
						- this.citiesLocalizationTable.getBounds().top - 70);
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

			this.combo_langs.setUserBounds(this.getBounds().width - 140,
					this.combo_langs.getBounds().top, this.combo_langs
							.getBounds().width,
					this.combo_langs.getBounds().height);
		},

		initWidgets : function() {

			// radiobuttons
			var radioButtonGroupHBox = new qx.ui.form.RadioButtonGroup();
			radioButtonGroupHBox.setLayout(new qx.ui.layout.HBox(5));
			var infoButton = new qx.ui.form.RadioButton("Information");
			var locButton = new qx.ui.form.RadioButton("Localization");
			infoButton.addListener("execute", function() {
						this.citiesTable.setVisibility('visible');
						this.citiesLocalizationTable.setVisibility('hidden');
						this.combo_langs.setVisibility('hidden');
						this.btn_move.setVisibility("visible");
						this.btn_change.setVisibility("visible");
						this.btn_delete.setVisibility("visible");
					}, this);
			locButton.addListener("execute", function() {
						this.citiesTable.setVisibility('hidden');
						this.citiesLocalizationTable.setVisibility('visible');
						this.combo_langs.setVisibility('visible');
						this.btn_move.setVisibility("hidden");
						this.btn_change.setVisibility("hidden");
						this.btn_delete.setVisibility("hidden");
					}, this);

			radioButtonGroupHBox.add(infoButton);
			radioButtonGroupHBox.add(locButton);

			this.add(radioButtonGroupHBox, {
						left : 10,
						top : 10
					});
			this.__createCitiesTable();
			this.__createCitiesLocalizationTable();

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

			/*
			 * this.btn_delete.setEnabled(false);
			 * this.btn_change.setEnabled(false);
			 */
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

			this.combo_langs = new qx.ui.form.SelectBox();
			this.combo_langs.setVisibility('hidden');
			this.combo_langs.setHeight(25);
			this.combo_langs.addListener("changeSelection",
					this.on_change_LanguageComboBox, this);
			this.add(this.combo_langs, {
						left : 220,
						top : 10
					});

			this.addListenerOnce("appear", function() {
						this.on_resize_panel();
					});

			this.on_cityTable_changeSelection();
			this.debug("CityLeftPanel was initialized");
		},

		__createCitiesLocalizationTable : function() {
			var tableModel = new qx.ui.table.model.Simple();
			tableModel.setColumns(["ID", "Name(ru)", "Name(lang)"]);
			tableModel.setColumnEditable(0, false);
			tableModel.setColumnEditable(1, true);
			tableModel.setColumnEditable(2, true);

			// table
			var citiesLocalizationTable = new qx.ui.table.Table(tableModel)
					.set({
								decorator : null
							});
			citiesLocalizationTable.setBackgroundColor('white');
			citiesLocalizationTable.setStatusBarVisible(false);
			citiesLocalizationTable.setVisibility('hidden');
			citiesLocalizationTable.addListener("dataEdited",
					this.on_change_citiesLocalizationTable, this);
			this.citiesLocalizationTable = citiesLocalizationTable;
			this.add(this.citiesLocalizationTable, {
						top : 40,
						left : 10
					});
			//
		},

		__createCitiesTable : function() {
			// table model
			var tableModel = new qx.ui.table.model.Simple();
			tableModel.setColumns(["ID", "Name", "Lat", "Lon", "Scale"]);
			tableModel.setColumnEditable(0, false);
			tableModel.setColumnEditable(1, false);
			tableModel.setColumnEditable(2, false);
			tableModel.setColumnEditable(3, false);
			tableModel.setColumnEditable(4, false);

			// table
			var citiesTable = new qx.ui.table.Table(tableModel).set({
						decorator : null
					});
			citiesTable.setBackgroundColor('white');
			citiesTable.setStatusBarVisible(false);
			citiesTable.addListener("cellClick", this.on_cityTable_click, this);
			citiesTable.addListener("cellDblclick", this.on_cityTable_Dblclick,
					this);
			citiesTable.getSelectionModel().addListener("changeSelection",
					this.on_cityTable_changeSelection, this);

			this.citiesTable = citiesTable;
			this.add(this.citiesTable, {
						top : 40,
						left : 10
					});
		}

	}
});
