/*
 * #asset(bus/admin/images/*)
 */
qx.Class.define("bus.admin.mvp.view.stations.CUStationForm", {
	extend : qx.ui.window.Window,

	construct : function(change_dialog, stationModel, presenter) {
		this.base(arguments);
		this.__stationModel = stationModel;
		this.setChangeDialog(change_dialog);
		this._presenter = presenter;
		this.initWidgets();
		this.__setOptions();
	},
	properties : {
		changeDialog : {
			nullable : true
		}
	},
	members : {
		_presenter : null,
		__stationModel : null,
		btn_save : null,
		btn_cancel : null,
		editLat : null,
		editLon : null,
		check_trolley : null,
		check_tram : null,
		check_metro : null,
		check_bus : null,

		table_names : null,
		on_save_click : function() {
			// validation
			for (var i = 0; i < this.table_names.getTableModel().getRowCount(); i++) {
				var rowData = this.table_names.getTableModel()
						.getRowDataAsMap(i);

				if (rowData.Name==null || rowData.Name.toString().length <= 0) {
					alert("Please, push names for all languages");
					return;
				}
			}
			
			if (this.getChangeDialog()) {
				this.__updateStation();
			} else {
				this.__insertStation();
			}
		},

		on_cancel_click : function() {
			this.close();
		},

		__insertStation : function() {
			// model
			qx.core.Init.getApplication().setWaitingWindow(true);
			var new_station = {
				id : this.__stationModel.id,
				city_id : this.__stationModel.city_id,
				location : {
					x : this.editLat.getValue(),
					y : this.editLon.getValue()
				},
				name_key : this.__stationModel.name_key,
				names : this.__getNames()
			};
			this.debug(qx.lang.Json.stringify(new_station));
			var event_finish_func = qx.lang.Function.bind(function(data) {
						qx.core.Init.getApplication().setWaitingWindow(false);
						if (data == null || data.error == true) {
							this.debug("__insertStation: request error");
							return;
						}
						this.close();
					}, this);
			this._presenter.insertStation(new_station, event_finish_func);

		},

		__updateStation : function() {
			qx.core.Init.getApplication().setWaitingWindow(true);
			// create model
			var updateStationModel = {
				id : this.__stationModel.id,
				city_id : this.__stationModel.city_id,
				location : {
					x : this.editLat.getValue(),
					y : this.editLon.getValue()
				},
				name_key : this.__stationModel.name_key,
				names : this.__getNames()
			};

			var event_finish_func = qx.lang.Function.bind(function(data) {
						qx.core.Init.getApplication().setWaitingWindow(false);
						if (data == null || data.error == true) {
							this.debug("__updateStation: request error");
							alert(data.server_error);
							return;
						}
						this.close();
					}, this);
			this._presenter.updateStation(this.__stationModel,
					updateStationModel, event_finish_func);

		},

		__getNames : function() {
			var names = [];
			for (var i = 0; i < this.table_names.getTableModel().getRowCount(); i++) {
				var rowData = this.table_names.getTableModel()
						.getRowDataAsMap(i);
				var modelsContainer = qx.core.Init.getApplication()
						.getModelsContainer();
				var lang = modelsContainer.getLangsModel()
						.getLangByName(rowData.Language);
				names.push({
							lang_id : lang.id,
							value : rowData.Name
						});
			}
			return names;
		},

		initWidgets : function() {
			var citiesModel = qx.core.Init.getApplication()
					.getModelsContainer().getCitiesModel();
			var city = citiesModel.getCityByID(this.__stationModel.city_id);
			var city_name = bus.admin.mvp.model.helpers.CitiesModelHelper
					.getCityNameByLang(city, "c_"
									+ qx.locale.Manager.getInstance()
											.getLocale());

			this.setLayout(new qx.ui.layout.Canvas());

			var positionSettings = new qx.ui.groupbox.GroupBox("Location:");
			positionSettings.setLayout(new qx.ui.layout.Canvas());

			var labelCity = new qx.ui.basic.Label("City:");
			var labelCityName = new qx.ui.basic.Label(city_name);
			var labelLat = new qx.ui.basic.Label("Lat:");
			var labelLon = new qx.ui.basic.Label("Lon:");

			this.editLat = new qx.ui.form.TextField(this.__stationModel.location.x
					.toString());
			this.editLat.setWidth(110);
			this.editLon = new qx.ui.form.TextField(this.__stationModel.location.y
					.toString());
			this.editLon.setWidth(110);

			this.btn_save = new qx.ui.form.Button("Save",
					"bus/admin/images/btn/dialog-apply.png");
			this.btn_save.addListener("execute", this.on_save_click, this);
			this.btn_save.setWidth(90);

			this.btn_cancel = new qx.ui.form.Button("Cancel",
					"bus/admin/images/btn/dialog-cancel.png");
			this.btn_cancel.addListener("execute", this.on_cancel_click, this);
			this.btn_cancel.setWidth(90);

			// names table

			var tableModel = new qx.ui.table.model.Simple();
			tableModel.setColumns(["Language", "Name"]);
			tableModel.setColumnEditable(0, false);
			tableModel.setColumnEditable(1, true);

			// table
			this.table_names = new qx.ui.table.Table(tableModel).set({
						decorator : null
					});
			this.table_names.setBackgroundColor('gray');

			this.table_names.setStatusBarVisible(false);
			this.table_names.setWidth(300);
			this.table_names.setHeight(120);
			this.table_names.setColumnWidth(0, 100);
			this.table_names.setColumnWidth(1, 180);

			// add to cantainer
			positionSettings.add(labelLat, {
						left : 10,
						top : 10
					});
			positionSettings.add(this.editLat, {
						left : 40,
						top : 10
					});
			positionSettings.add(labelLon, {
						left : 10,
						top : 50
					});
			positionSettings.add(this.editLon, {
						left : 40,
						top : 50
					});

			this.add(labelCity, {
						left : 10,
						top : 120
					});
			this.add(labelCityName, {
						left : 40,
						top : 120
					});
			this.add(positionSettings, {
						left : 0,
						top : -15
					});
			this.add(this.table_names, {
						left : 10,
						top : 140
					});

			this.add(this.btn_save, {
						left : 50,
						top : 265
					});
			this.add(this.btn_cancel, {
						left : 160,
						top : 265
					});

		},

		__setOptions : function() {
			this.setHeight(350);
			this.setWidth(350);
			this.setModal(true);
			this.setAllowMaximize(false);
			this.setShowMaximize(false);
			this.setShowMinimize(false);
			this.setResizable(false, false, false, false);
			this.center();
			if (this.getChangeDialog()) {
				this.setCaption("Change station");
			} else {

				this.setCaption("Insert new station");
			}

			if (this.__stationModel.location != null) {
				this.editLat
						.setValue(this.__stationModel.location.x.toString());
				this.editLon
						.setValue(this.__stationModel.location.y.toString());
			}

			// fill table
			var modelsContainer = qx.core.Init.getApplication()
					.getModelsContainer();
			var langs = modelsContainer.getLangsModel().getData();
			var rowData = [];

			for (var i = 0; i < langs.length; i++) {
				var name = "";
				if (this.getChangeDialog()) {
					name = bus.admin.mvp.model.helpers.StationsModelHelper
							.getStationNameByLang(this.__stationModel,
									langs[i].id);
				}
				rowData.push([langs[i].name, name]);
				this.debug(langs[i].name);
			}
			this.table_names.getTableModel().setData(rowData);

		}
	}

});