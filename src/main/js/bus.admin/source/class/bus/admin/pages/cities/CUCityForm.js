/*
 * #asset(bus/admin/images/*)
 */
qx.Class.define("bus.admin.pages.cities.CUCityForm", {
	extend : qx.ui.window.Window,

	construct : function(cityLeftPanel, change_dialog, cityModel) {
		this.base(arguments);
		this.setChangeDialog(change_dialog);
		this.__cityModel = cityModel;
		this.__cityLeftPanel = cityLeftPanel;
		this.initWidgets();
		this.__setOptions();
	},
	properties : {
		changeDialog : {
			nullable : true
		}
	},
	members : {
		__cityModel : null,
		__cityLeftPanel : null,
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
			qx.core.Init.getApplication().setWaitingWindow(true);

			if (this.getChangeDialog()) {

			} else {
				// create model
				var newCityModel = {
					location : {
						lat : this.editLat.getValue(),
						lon : this.editLon.getValue()
					},
					scale : editScale.getValue(),
					names : []
				};
				for (var i = 0; i < this.table_names.getTableModel()
						.getRowCount(); i++) {
					var rowData = this.table_names.getTableModel()
							.getRowDataAsMap(i);
					newCityModel.names.push(rowData.Language, rowData.Name);
				}
				// sent to the server

				var request = bus.admin.net.CitiesRequest();
				request.insertCity(newCityModel, function(responce) {
					qx.core.Init.getApplication().setWaitingWindow(false);
					var insertedCity = response.getContent();
					if (insertedCity != null ) {
						this.__cityLeftPanel.insertCity(insertedCity);
						this.close();
						/*this.citiesData.changeCity(update_city.id, update_city);
						this.__cityMap.updateMarker(update_city.id,
								update_city.location.lat,
								update_city.location.lon);
						var tableModel = this.citiesTable.getTableModel();
						tableModel.setValue(tableModel
										.getColumnIndexById("Lat"), row,
								update_city.location.lat);
						tableModel.setValue(tableModel
										.getColumnIndexById("Lon"), row,
								update_city.location.lon);*/

					} else {
						alert("Request error!");
					}
					

				}, function() {
					qx.core.Init.getApplication().setWaitingWindow(false);
					alert("Request error!");
				}, this);
			}
			/*
			 * var cityModel = { id : this.__cityModel, name_key : location : {
			 * lat : this.editLat.getValue(), lon : this.editLon.getValue() },
			 * scale : editScale.getValue() };
			 */

			// this.close();
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
			var labelScale = new qx.ui.basic.Label("Scale(2-16):");
			this.editLat = new qx.ui.form.TextField(this.__cityModel.location.lat
					.toString());
			this.editLat.setWidth(110);
			this.editLon = new qx.ui.form.TextField(this.__cityModel.location.lon
					.toString());
			this.editLon.setWidth(110);

			this.editScale = new qx.ui.form.Spinner();
			this.editScale.set({
						maximum : 16,
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
			tableModel.setColumnEditable(0, true);
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
			if (this.__cityLeftPanel.citiesData != null) {
				var langsModel = this.__cityLeftPanel.citiesData
						.getLangsModel();

				var rowData = [];
				for (var i = 0; i < langsModel.length; i++) {
					var lang_name = langsModel[i].name;
					var name = "";
					if (this.getChangeDialog()) {
						name = bus.admin.helpers.CitiesModelHelper
								.getCityNameByLang(this.__cityModel,
										langsModel[i].id);
					}
					rowData.push([lang_name, name]);
					this.debug(lang_name);
				}
				this.table_names.getTableModel().setData(rowData);
			}

		}
	}

});