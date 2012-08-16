/*
 * #asset(bus/admin/images/*)
 */
qx.Class.define("bus.admin.mvp.view.cities.CUCityForm", {
	extend : qx.ui.window.Window,

	construct : function(citiesPage, change_dialog, cityModel) {
		this.base(arguments);
		this.setChangeDialog(change_dialog);
		this.__cityModel = cityModel;
		this.__citiesPage = citiesPage;
		this.initWidgets();
		this.__setOptions();
	},
	properties : {
		changeDialog : {
			nullable : true
		}
	},
	members : {
		__citiesPage : null,
		__cityModel : null,
		btn_save : null,
		btn_cancel : null,
		editLat : null,
		editLon : null,
		editScale : null,
		table_names : null,
		on_save_click : function() {
			// validation
			for (var i = 0; i < this.table_names.getTableModel().getRowCount(); i++) {
				var rowData = this.table_names.getTableModel()
						.getRowDataAsMap(i);

				if (rowData.Name.toString().length <= 0) {
					alert("Please, push names for all languages");
					return;
				}
			}

			if (this.getChangeDialog()) {
				this.__updateCity();
			} else {
				this.__insertCity();
			}
		},

		__updateCity : function() {
			// model
			qx.core.Init.getApplication().setWaitingWindow(true);
			var update_city = {
				id : this.__cityModel.id,
				location : {
					lat : this.editLat.getValue(),
					lon : this.editLon.getValue()
				},
				scale : this.editScale.getValue(),
				name_key : this.__cityModel.name_key,
				names : []
			};
			for (var i = 0; i < this.table_names.getTableModel().getRowCount(); i++) {
				var rowData = this.table_names.getTableModel()
						.getRowDataAsMap(i);
				var lang = this.__citiesPage.getLanguagesModel()
						.getLangByName(rowData.Language);
				var stringValue = bus.admin.mvp.model.helpers.CitiesModelHelper
						.getCityStringValueByLang(this.__cityModel, lang.id);
				if (stringValue != null) {
					update_city.names.push({
								id : stringValue.id,
								key_id : stringValue.key_id,
								lang_id : lang.id,
								value : rowData.Name
							});
				} else {
					update_city.names.push({
								id : null,
								key_id : null,
								lang_id : lang.id,
								value : rowData.Name
							});
				}
			}
			var citiesRequest = new bus.admin.net.CitiesRequest();
			qx.core.Init.getApplication().setWaitingWindow(true);
			var update_city_json = qx.lang.Json.stringify(update_city);
			citiesRequest.updateCity(update_city_json, function(response) {
						var result = response.getContent();
						if (result == null || result.error != null) {
							alert(result.error);
						} else if (result != null) {
							this.__citiesPage.getPresenter().updateCity(result);
							this.close();
						}
						qx.core.Init.getApplication().setWaitingWindow(false);
					}, function() {
						alert("server responce error!");
						qx.core.Init.getApplication().setWaitingWindow(false);
					}, this);
			
		},

		__insertCity : function() {
			qx.core.Init.getApplication().setWaitingWindow(true);
			// create model
			var newCityModel = {
				location : {
					lat : this.editLat.getValue(),
					lon : this.editLon.getValue()
				},
				scale : this.editScale.getValue(),
				names : []
			};
			for (var i = 0; i < this.table_names.getTableModel().getRowCount(); i++) {
				var rowData = this.table_names.getTableModel()
						.getRowDataAsMap(i);
				var lang = this.__citiesPage.getLanguagesModel()
						.getLangByName(rowData.Language);
				newCityModel.names.push({
							lang_id : lang.id,
							value : rowData.Name
						});
			}

			// sent to the server
			var request = new bus.admin.net.CitiesRequest();
			var newCityModel_json = qx.lang.Json.stringify(newCityModel);
			request.insertCity(newCityModel_json, function(responce) {
						qx.core.Init.getApplication().setWaitingWindow(false);
						var result = responce.getContent();
						if (result.error != null) {
							alert(result.error.toString());
						} else if (result != null) {
							var insertedCity = result;
							this.__citiesPage.getPresenter()
									.insertCity(insertedCity);
							this.close();
						} else {
							alert("Request error!");
						}

					}, function() {
						qx.core.Init.getApplication().setWaitingWindow(false);
						alert("Request error!");
					}, this);
		},
		on_cancel_click : function() {
			this.close();
		},
		initWidgets : function() {
			this.setLayout(new qx.ui.layout.Canvas());

			var positionSettings = new qx.ui.groupbox.GroupBox("Position");
			positionSettings.setLayout(new qx.ui.layout.Canvas());

			var labelLat = new qx.ui.basic.Label("Lat:");
			var labelLon = new qx.ui.basic.Label("Lon:");
			var labelScale = new qx.ui.basic.Label("Scale(2-21):");
			this.editLat = new qx.ui.form.TextField(this.__cityModel.location.lat
					.toString());
			this.editLat.setWidth(110);
			this.editLon = new qx.ui.form.TextField(this.__cityModel.location.lon
					.toString());
			this.editLon.setWidth(110);

			this.editScale = new qx.ui.form.Spinner();
			this.editScale.set({
						maximum : 21,
						minimum : 2
					});
			this.editScale.setWidth(50);

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
			this.table_names.setHeight(130);
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

			positionSettings.add(labelScale, {
						left : 160,
						top : 10
					});
			positionSettings.add(this.editScale, {
						left : 240,
						top : 10
					});

			this.add(positionSettings, {
						left : 0,
						top : -15
					});
			this.add(this.table_names, {
						left : 10,
						top : 130
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
				this.setCaption("Change city");
			} else {

				this.setCaption("Insert new city");
			}

			if (this.__cityModel.location != null) {
				this.editLat.setValue(this.__cityModel.location.lat.toString());
				this.editLon.setValue(this.__cityModel.location.lon.toString());
			}
			this.editScale.setValue(this.__cityModel.scale);

			// fill table

			var langs = this.__citiesPage.getLanguagesModel().getData();
			this.debug(langs.length);
			var rowData = [];
			for (var i = 0; i < langs.length; i++) {
				var name = "";
				if (this.getChangeDialog()) {
					name = bus.admin.mvp.model.helpers.CitiesModelHelper
							.getCityNameByLang(this.__cityModel, langs[i].id);
				}
				rowData.push([langs[i].name, name]);
				this.debug(langs[i].name);
			}
			this.table_names.getTableModel().setData(rowData);

		}
	}

});