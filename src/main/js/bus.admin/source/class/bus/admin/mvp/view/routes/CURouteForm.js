/*
 * #asset(bus/admin/images/*)
 */
qx.Class.define("bus.admin.mvp.view.routes.CURouteForm", {
	extend : qx.ui.window.Window,

	construct : function(change_dialog, routeModel, routesPresenter) {
		this.base(arguments);
		this.setChangeDialog(change_dialog);
		this._routesPresenter = routesPresenter;
		this._routeModel = routeModel;
		this.initWidgets();
		this.__setOptions();
	},
	properties : {
		changeDialog : {
			nullable : true
		}
	},
	members : {
		_routesPresenter : null,
		_routeModel : null,
		btn_save : null,
		btn_cancel : null,
		check_names : null,
		editNumber : null,
		editCost : null,
		table_names : null,
		on_save_click : function() {
			// validation
			var number = this.editNumber.getValue();
			var cost = parseFloat(this.editCost.getValue());

			// validation
			if (isNaN(cost)) {
				alert("The cost must be a number");
				return;
			}

			if (this.check_names.getValue() == true) {
				for (var i = 0; i < this.table_names.getTableModel()
						.getRowCount(); i++) {
					var rowData = this.table_names.getTableModel()
							.getRowDataAsMap(i);

					if (rowData.Name == null
							|| rowData.Name.toString().length <= 0) {
						alert("Please, push names for all languages");
						return;
					}
				}
			} else if (number == null || number.toString().length <= 0) {
				alert("Please, set a number of route");
				return;

			}

			// create/edit routeModel
			if (this.getChangeDialog()) {
				this.__updateRoute();
			} else {
				this.__insertRoute(number, cost);
			}
		},

		on_cancel_click : function() {
			this.close();
		},

		__updateRoute : function() {
			// model
			qx.core.Init.getApplication().setWaitingWindow(true);
			var update_city = {
				id : this.__cityModel.id,
				location : {
					x : this.editLat.getValue(),
					y : this.editLon.getValue()
				},
				scale : this.editScale.getValue(),
				isShow : this.check_show.getValue(),
				name_key : this.__cityModel.name_key,
				names : []
			};
			console.log("__updateCity check:");
			console.log(this.check_show.getValue());
			for (var i = 0; i < this.table_names.getTableModel().getRowCount(); i++) {
				var rowData = this.table_names.getTableModel()
						.getRowDataAsMap(i);
				var modelsContainer = qx.core.Init.getApplication()
						.getModelsContainer();
				var lang = modelsContainer.getLangsModel()
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
			var globalPresenter = qx.core.Init.getApplication().getPresenter();
			var event_finish_func = qx.lang.Function.bind(function(data) {
						qx.core.Init.getApplication().setWaitingWindow(false);
						if (data == null || data.error == true) {
							this.debug("__update_city: request error");
							return;
						}
						this.close();
					}, this);
			globalPresenter.updateCity(this.__cityModel, update_city,
					event_finish_func);

		},

		__insertRoute : function(number, cost) {

			// create model
			this._routeModel.number = number;
			this._routeModel.cost = cost;
			this._routeModel.name = [];
			if (this.check_names.getValue() == true) {

				for (var i = 0; i < this.table_names.getTableModel()
						.getRowCount(); i++) {
					var rowData = this.table_names.getTableModel()
							.getRowDataAsMap(i);
					var modelsContainer = qx.core.Init.getApplication()
							.getModelsContainer();
					var lang = modelsContainer.getLangsModel()
							.getLangByName(rowData.Language);
					this._routeModel.name.push({
								lang_id : lang.id,
								value : rowData.Name
							});
				}
			}
			var event_finish_func = qx.lang.Function.bind(function(data) {
						this.close();
					}, this);
			this._routesPresenter.startCreateNewRoute(this._routeModel,
					event_finish_func);

		},

		initWidgets : function() {
			this.setLayout(new qx.ui.layout.Canvas());

			var mainSettings = new qx.ui.groupbox.GroupBox("Main info");
			mainSettings.setLayout(new qx.ui.layout.Canvas());

			var labelNumber = new qx.ui.basic.Label("Number:");
			var labelCost = new qx.ui.basic.Label("Cost:");
			this.editNumber = new qx.ui.form.TextField("1");
			this.editNumber.setWidth(130);
			this.editCost = new qx.ui.form.TextField("2.50");
			this.editCost.setWidth(130);

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
			mainSettings.add(labelNumber, {
						left : 10,
						top : 10
					});
			mainSettings.add(this.editNumber, {
						left : 70,
						top : 10
					});
			mainSettings.add(labelCost, {
						left : 10,
						top : 50
					});
			mainSettings.add(this.editCost, {
						left : 70,
						top : 50
					});

			this.check_names = new qx.ui.form.CheckBox("Names");
			this.check_names.addListener("changeValue", this.on_check_names,
					this);
			this.check_names.setValue(false);
			this.on_check_names();
			this.add(mainSettings, {
						left : 0,
						top : -15
					});

			this.add(this.check_names, {
						left : 10,
						top : 130
					});

			this.add(this.table_names, {
						left : 10,
						top : 150
					});

			this.add(this.btn_save, {
						left : 50,
						top : 285
					});
			this.add(this.btn_cancel, {
						left : 160,
						top : 285
					});

		},
		on_check_names : function(e) {
			var checked = this.check_names.getValue();
			if (checked == true) {
				this.table_names.setEnabled(true);
			} else {
				this.table_names.setEnabled(false);
			}

		},

		__setOptions : function() {
			this.setHeight(370);
			this.setWidth(350);
			this.setModal(true);
			this.setAllowMaximize(false);
			this.setShowMaximize(false);
			this.setShowMinimize(false);
			this.setResizable(false, false, false, false);
			this.center();
			if (this.getChangeDialog()) {
				this.setCaption("Change route");
			} else {

				this.setCaption("Insert new route");
			}

			// this.editLat.setValue(this.__cityModel.location.x.toString());
			// this.editLon.setValue(this.__cityModel.location.y.toString());

			// this.editScale.setValue(this.__cityModel.scale);

			// fill table
			var modelsContainer = qx.core.Init.getApplication()
					.getModelsContainer();
			var langs = modelsContainer.getLangsModel().getData();
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