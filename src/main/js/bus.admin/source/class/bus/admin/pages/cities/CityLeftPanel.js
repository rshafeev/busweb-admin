/*
  #asset(bus/admin/images/*)
 */

qx.Class.define("bus.admin.pages.cities.CityLeftPanel", {
	extend : qx.ui.container.Composite,
	events : {
		"received_all_responces" : "qx.event.type.Event"
	},
	construct : function(cityMap) {
		this.__cityMap = cityMap;
		this.base(arguments);
		this.setLayout(new qx.ui.layout.Canvas());
		this.setWidth(360);
		this.setMinWidth(360);
		this.setAppearance("left-panel");
		this.addListener("resize", this.__resize_event);
		this.initWidgets();
		this.citiesData = new bus.admin.pages.cities.CitiesData();

	},

	members : {
		__cityMap : null,
		citiesData : null,
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
			this.addListener("received_all_responces", function() {
				this.debug("received_all_responces - execute");
				if (this.citiesData.isCitiesResponceComplete()) {
					this.loadDataToCityTable();
				}
				if (this.citiesData.isLangsResponceComplete()) {
					this.loadLanguagesToComboBox();
					this.loadDataToCityLocalizationTable();
				}
				this.citiesData.refresh();
				qx.core.Init.getApplication().setWaitingWindow(false);
			}, this);

			this.loadData();
		},
		loadLanguagesToComboBox : function() {
			var langs = this.citiesData.getLangsModel();
			var rawData = [];
			for ( var i = 0; i < langs.length; i++) {
				if (langs[i].id.toString() != "c_ru") {
					rawData.push(langs[i].name);
				}
			}
			var model = qx.data.marshal.Json.createModel(rawData);
			this.combo_langs.setModel(model);
			if (rawData.length > 0)
				this.combo_langs.setValue(rawData[0]);
		},
		loadDataToCityLocalizationTable : function() {
			var langName = this.combo_langs.getValue();
			this.debug(langName);
			var lang = this.citiesData.getLangByName(langName);
			var cities = this.citiesData.getCitiesModel();
			var rowData = [];
			this.debug("loadDataToCityLocalizationTable1");
			if (cities.length != null && lang != null) {
				this.debug("loadDataToCityLocalizationTable2");

				for ( var i = 0; i < cities.length; i++) {
					var name = bus.admin.helpers.CitiesModelHelper.getCityNameByLang(cities[i], lang.id);
					var name_ru = bus.admin.helpers.CitiesModelHelper.getCityNameByLang(cities[i], "c_ru");
					rowData.push([ cities[i].id, name_ru, name ]);
				}
				this.citiesLocalizationTable.getTableModel().setData(rowData);
			}
		},
		loadDataToCityTable : function() {
			var rowData = [];
			var cities = this.citiesData.getCitiesModel();
			if (cities.length != null) {
				this.__cityMap.deleteAllMarkers();
				for ( var i = 0; i < cities.length; i++) {
					var name = bus.admin.helpers.CitiesModelHelper.getCityNameByLang(cities[i], "c_ru");
					rowData.push([ cities[i].id, name, cities[i].location.lat, cities[i].location.lon, cities[i].scale ]);
					this.__cityMap.insertCityMarker(cities[i].id, cities[i].location.lat, cities[i].location.lon);
				}
				this.citiesTable.getTableModel().setData(rowData);
			}
		},
		__resize_event : function() {
			if (this.citiesTable) {
				this.citiesTable.setWidth(this.getBounds().width - this.citiesTable.getBounds().left - 10);
				this.citiesTable.setHeight(this.getBounds().height - this.citiesTable.getBounds().top - 70);
			}
			if (this.citiesLocalizationTable) {
				this.citiesLocalizationTable.setWidth(this.getBounds().width - this.citiesLocalizationTable.getBounds().left - 10);
				this.citiesLocalizationTable.setHeight(this.getBounds().height - this.citiesLocalizationTable.getBounds().top - 70);
			}
			this.btn_save.setUserBounds(this.getBounds().width - 200, this.getBounds().height - 65, this.btn_save.getBounds().width,
					this.btn_save.getBounds().height);
			this.btn_cancel.setUserBounds(this.getBounds().width - 100, this.getBounds().height - 65, this.btn_cancel.getBounds().width,
					this.btn_cancel.getBounds().height);

			this.btn_change.setUserBounds(this.getBounds().width - 200, this.getBounds().height - 65, this.btn_change.getBounds().width,
					this.btn_change.getBounds().height);
			this.btn_delete.setUserBounds(this.getBounds().width - 100, this.getBounds().height - 65, this.btn_delete.getBounds().width,
					this.btn_delete.getBounds().height);
			this.btn_refresh.setUserBounds(10, this.getBounds().height - 65, this.btn_refresh.getBounds().width,
					this.btn_refresh.getBounds().height);
			this.btn_move.setUserBounds(this.getBounds().width - 300, this.getBounds().height - 65, this.btn_move.getBounds().width,
					this.btn_move.getBounds().height);

			this.combo_langs.setUserBounds(this.getBounds().width - 140, this.combo_langs.getBounds().top, this.combo_langs.getBounds().width,
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
			}, this);
			locButton.addListener("execute", function() {
				this.citiesTable.setVisibility('hidden');
				this.citiesLocalizationTable.setVisibility('visible');
				this.combo_langs.setVisibility('visible');
			}, this);

			radioButtonGroupHBox.add(infoButton);
			radioButtonGroupHBox.add(locButton);

			this.add(radioButtonGroupHBox, {
				left : 10,
				top : 10
			});
			this.createCitiesTable();
			this.createCitiesLocalizationTable();

			// buttons

			this.btn_change = new qx.ui.form.Button("Change", "bus/admin/images/btn/utilities-text-editor.png");
			this.btn_change.setWidth(90);

			this.btn_delete = new qx.ui.form.Button("Delete", "bus/admin/images/btn/edit-delete.png");
			this.btn_delete.setWidth(90);

			this.btn_move = new qx.ui.form.Button("Move", "bus/admin/images/btn/go-bottom.png");
			this.btn_move.setWidth(90);

			this.btn_save = new qx.ui.form.Button("Save", "bus/admin/images/btn/dialog-apply.png");
			this.btn_save.setWidth(90);

			this.btn_cancel = new qx.ui.form.Button("Cancel", "bus/admin/images/btn/dialog-cancel.png");
			this.btn_cancel.setWidth(90);

			this.btn_refresh = new qx.ui.form.Button("", "bus/admin/images/btn/view-refresh.png");
			this.btn_refresh.setWidth(35);

			/*
			 * this.btn_delete.setEnabled(false);
			 * this.btn_change.setEnabled(false);
			 */
			this.btn_save.setVisibility("hidden");
			this.btn_cancel.setVisibility("hidden");

			this.btn_save.addListener("execute", this.on_btn_save_click, this);
			this.btn_cancel.addListener("execute", this.on_btn_cancel_click, this);
			this.btn_change.addListener("execute", this.on_btn_change_click, this);
			this.btn_delete.addListener("execute", this.on_btn_delete_click, this);
			this.btn_move.addListener("execute", this.on_btn_move_click, this);
			this.btn_refresh.addListener("execute", this.on_btn_refresh_click, this);
			this.add(this.btn_save);
			this.add(this.btn_cancel);
			this.add(this.btn_change);
			this.add(this.btn_delete);
			this.add(this.btn_move);
			this.add(this.btn_refresh);

			this.combo_langs = new qx.ui.form.VirtualComboBox();
			this.combo_langs.setVisibility('hidden');
			this.add(this.combo_langs, {
				left : 220,
				top : 10
			});

			this.addListenerOnce("appear", function() {
				this.__resize_event();
			});
			this.on_cityTable_changeSelection();
			this.debug("CityLeftPanel was initialized");
		},

		createCitiesLocalizationTable : function() {
			var tableModel = new qx.ui.table.model.Simple();
			tableModel.setColumns([ "ID", "Name(ru)", "Name(lang)" ]);
			tableModel.setColumnEditable(0, false);
			tableModel.setColumnEditable(1, true);
			tableModel.setColumnEditable(2, true);

			// table
			var citiesLocalizationTable = new qx.ui.table.Table(tableModel).set({
				decorator : null
			});
			citiesLocalizationTable.setBackgroundColor('white');
			citiesLocalizationTable.setStatusBarVisible(false);
			citiesLocalizationTable.setVisibility('hidden');

			this.citiesLocalizationTable = citiesLocalizationTable;
			this.add(this.citiesLocalizationTable, {
				top : 40,
				left : 10
			});

		},

		createCitiesTable : function() {
			// table model
			var tableModel = new qx.ui.table.model.Simple();
			tableModel.setColumns([ "ID", "Name", "Lat", "Lon", "Scale" ]);
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
			citiesTable.addListener("cellDblclick", this.on_cityTable_Dblclick, this);
			citiesTable.getSelectionModel().addListener("changeSelection", this.on_cityTable_changeSelection, this);

			this.citiesTable = citiesTable;
			this.add(this.citiesTable, {
				top : 40,
				left : 10
			});
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
				var row = this.citiesTable.getSelectionModel().getAnchorSelectionIndex();
				if (row < 0)
					return;

				var rowData = this.citiesTable.getTableModel().getRowDataAsMap(row);
				this.__cityMap.finishMoveMarker(rowData.ID);

				// // update city on the server

				qx.core.Init.getApplication().setWaitingWindow(true);
				var citiesRequest = new bus.admin.net.CitiesRequest();

				var marker = this.__cityMap.getMarkerByID(rowData.ID);

				var update_city = {
					id : rowData.ID,
					location : {
						lat : marker.getPosition().lat(),
						lon : marker.getPosition().lng()
					},
					scale : rowData.Scale,
					name_key : this.citiesData.getCityByID(rowData.ID).name_key,
					names : this.citiesData.getCityByID(rowData.ID).names
				};
				var update_city_json = qx.lang.Json.stringify(update_city);

				citiesRequest.updateCity(update_city_json, function(response) {
					var result = response.getContent();
					if (result != null && result.toString() == "ok") {
						this.citiesData.changeCity(update_city.id, update_city);
						this.__cityMap.updateMarker(update_city.id, update_city.location.lat, update_city.location.lon);
						var tableModel = this.citiesTable.getTableModel();
						tableModel.setValue(tableModel.getColumnIndexById("Lat"),row,update_city.location.lat);
						tableModel.setValue(tableModel.getColumnIndexById("Lon"),row,update_city.location.lon);
						//this.citiesTable.setTableModel(tableModel);
						
					} else {
						var curr_city = this.citiesData.getCityByID(update_city.id);
						this.__cityMap.updateMarker(curr_city.id, curr_city.lat, curr_city.lon);
					}
					qx.core.Init.getApplication().setWaitingWindow(false);
				}, function() {
					qx.core.Init.getApplication().setWaitingWindow(false);
					var rowData = this.citiesTable.getTableModel().getRowDataAsMap(row);
					this.__cityMap.updateMarker(rowData.ID, rowData.Lat, rowData.Lon);
				}, this);

			}
			this.save_status = "none";
		},
		update_city : function(city){
			
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
				var row = this.citiesTable.getSelectionModel().getAnchorSelectionIndex();
				if (row >= 0) {
					var rowData = this.citiesTable.getTableModel().getRowDataAsMap(row);
					this.__cityMap.finishMoveMarker(rowData.ID);
					this.__cityMap.updateMarker(rowData.ID, rowData.Lat, rowData.Lon);
				}
			}
			this.save_status = "none";
		},

		on_btn_move_click : function() {

			var row = this.citiesTable.getSelectionModel().getAnchorSelectionIndex();
			if (row >= 0) {
				this.btn_save.setVisibility("visible");
				this.btn_cancel.setVisibility("visible");
				this.btn_move.setVisibility("hidden");
				this.btn_change.setVisibility("hidden");
				this.btn_delete.setVisibility("hidden");
				this.btn_refresh.setEnabled(false);
				this.citiesTable.setEnabled(false);
				this.save_status = "move";
				var rowData = this.citiesTable.getTableModel().getRowDataAsMap(row);

				this.__cityMap.startMoveMarker(rowData.ID);
			}

		},
		on_btn_change_click : function() {
			
			var row = this.citiesTable.getSelectionModel().getAnchorSelectionIndex();
				if (row < 0)
					return;
			var rowData = this.citiesTable.getTableModel().getRowDataAsMap(row);
			var cityModel = this.citiesData.getCityByID(rowData.ID)			
			var changeDialog = new bus.admin.pages.cities.CUCityForm(this,true,cityModel);
			changeDialog.open();
		},
		on_btn_delete_click : function() {
		},
		on_btn_refresh_click : function() {
			this.loadData();
		},
		on_cityTable_changeSelection : function(e) {
			var row = this.citiesTable.getSelectionModel().getAnchorSelectionIndex();
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

			var row = this.citiesTable.getSelectionModel().getAnchorSelectionIndex();

			if (row >= 0) {
				var rowData = this.citiesTable.getTableModel().getRowDataAsMap(row);
				var map = this.__cityMap.getGoogleMap();
				map.setCenter(rowData.Lat, rowData.Lon, rowData.Scale);
			}
		},
		loadData : function() {
			qx.core.Init.getApplication().setWaitingWindow(true);
			var citiesRequest = new bus.admin.net.CitiesRequest();

			citiesRequest.getAllCities(function(response) {
				var cities = response.getContent();
				if (cities != null) {
					this.citiesData.setCitiesModel(cities);
					this.citiesData.setCitiesResponceComplete(true);
				} else
					this.citiesData.setCitiesResponceComplete(false);
				if (this.citiesData.isAllResponcesReceived() == true)
					this.fireEvent("received_all_responces");
			}, function() {
				this.citiesData.setCitiesResponceComplete(false);
				if (this.citiesData.isAllResponcesReceived() == true)
					this.fireEvent("received_all_responces");
			}, this);

			var langsRequest = new bus.admin.net.LangsRequest();
			langsRequest.getAllLanguages(function(response) {
				var langs = response.getContent();
				if (langs != null) {
					this.citiesData.setLangsModel(langs);
					this.citiesData.setLangsResponceComplete(true);
				} else {

					this.citiesData.setLangsResponceComplete(false);
				}
				this.debug("getAllLanguages - complete");
				if (this.citiesData.isAllResponcesReceived() == true)
					this.fireEvent("received_all_responces");

			}, function() {
				this.debug("getAllLanguages - failed");
				this.citiesData.setLangsResponceComplete(false);

				if (this.citiesData.isAllResponcesReceived() == true)
					this.fireEvent("received_all_responces");

			}, this);

		}
	}
});
