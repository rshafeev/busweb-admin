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
		check_sameDirections : null,
		editNumber : null,
		editCost : null,
		editTimeA : null,
		editTimeB : null,
		editFrequency : null,
		table_names : null,
		on_save_click : function() {
			var schedule = null;
			var number = null;
			var cost = null;
			// validation
			number = this.editNumber.getValue();
			cost = parseFloat(this.editCost.getValue());

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
			if (this.getChangeDialog() == false) {
				var timeAvalue = this.editTimeA.getValue();
				var timeBvalue = this.editTimeB.getValue();
				var freqValue = this.editFrequency.getValue();
				var schedule = this._createScheduleObj(timeAvalue, timeBvalue,
						freqValue);
				if (schedule == null) {
					alert("Please, set valid time and frequency");
					return;
				}
			}

			// create/edit routeModel
			if (this.getChangeDialog()) {
				this.__updateRoute();
			} else {
				this.__insertRoute(number, cost, schedule,
						this.check_sameDirections.getValue());
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

		__insertRoute : function(number, cost, schedule, sameDirections) {

			// create model
			this._routeModel.number = number;
			this._routeModel.cost = cost;
			this._routeModel.name = [];
			if (sameDirections == false) {
				this._routeModel.directRouteWay = {
					schedule : schedule
				};

				this._routeModel.reverseRouteWay = {
					schedule : bus.admin.helpers.ObjectHelper.clone(schedule)
				};
			} else {
				this._routeModel.directRouteWay = {
					schedule : schedule
				};
				this._routeModel.reverseRouteWay = null;
			}
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
			this.editNumber.setWidth(80);
			this.editCost = new qx.ui.form.TextField("2.50");
			this.editCost.setWidth(80);

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
			// ////////
			var timeSettings = new qx.ui.groupbox.GroupBox("Timetable");
			timeSettings.setLayout(new qx.ui.layout.Canvas());
			var labelTimeA = new qx.ui.basic.Label("Time(start):");
			this.editTimeA = new qx.ui.form.TextField("06:00");
			this.editTimeA.setWidth(80);

			var labelTimeB = new qx.ui.basic.Label("Time(finish):");
			this.editTimeB = new qx.ui.form.TextField("22:00");
			this.editTimeB.setWidth(80);

			var labelTimeB = new qx.ui.basic.Label("Time(finish):");
			this.editTimeB = new qx.ui.form.TextField("22:00");
			this.editTimeB.setWidth(80);

			var labelFreq = new qx.ui.basic.Label("Frequency(min):");
			this.editFrequency = new qx.ui.form.TextField("15");
			this.editFrequency.setWidth(80);

			// bus.admin.helpers.ObjectHelper.validateTime
			timeSettings.add(labelTimeA, {
						left : 10,
						top : 10
					});
			timeSettings.add(this.editTimeA, {
						left : 110,
						top : 10
					});
			timeSettings.add(labelTimeB, {
						left : 10,
						top : 50
					});
			timeSettings.add(this.editTimeB, {
						left : 110,
						top : 50
					});

			timeSettings.add(labelFreq, {
						left : 10,
						top : 90
					});
			timeSettings.add(this.editFrequency, {
						left : 110,
						top : 90
					});
			// add to cantainer

			this.check_names = new qx.ui.form.CheckBox("Names");
			this.check_names.addListener("changeValue", this.on_check_names,
					this);
			this.check_names.setValue(false);

			this.check_sameDirections = new qx.ui.form.CheckBox("Same ways");
			this.check_sameDirections.setValue(false);

			this.on_check_names();
			this.add(mainSettings, {
						left : 0,
						top : -10
					});
			this.add(timeSettings, {
						left : 180,
						top : -10
					});

			this.add(this.check_names, {
						left : 10,
						top : 130
					});
			this.add(this.check_sameDirections, {
						left : 80,
						top : 130
					});

			this.add(this.table_names, {
						left : 10,
						top : 160
					});

			this.add(this.btn_save, {
						left : 50,
						top : 305
					});
			this.add(this.btn_cancel, {
						left : 160,
						top : 305
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
			this.setHeight(400);
			if (this.getChangeDialog()) {
				this.setWidth(350);
				this.setCaption("Change route");
			} else {
				this.setWidth(430);
				this.setCaption("Insert new route");
			}

			this.setModal(true);
			this.setAllowMaximize(false);
			this.setShowMaximize(false);
			this.setShowMinimize(false);
			this.setResizable(false, false, false, false);
			this.center();

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

		},

		_createScheduleObj : function(timeValueA, timeValueB, frequency) {
			if (bus.admin.helpers.ObjectHelper.validateTime(timeValueA) == false
					|| bus.admin.helpers.ObjectHelper.validateTime(timeValueB) == false
					|| frequency.toString() != parseInt(frequency).toString()) {
				return null;
			}
			var secsA = bus.admin.helpers.ObjectHelper
					.convertTimeToSeconds(timeValueA);
			var secsB = bus.admin.helpers.ObjectHelper
					.convertTimeToSeconds(timeValueB);
			var frequencySecs = 60 * frequency;
			if (frequencySecs < 0 || secsB < 0 || secsB < secsA) {
				return null;
			}
			var schedule = {
				id : null,
				direct_route_id : null,
				scheduleGroups : [{
							id : null,
							schedule_id : null,
							days : [{
										id : null,
										schedule_group_id : null,
										day_id : "c_all"

									}],
							timetables : [{
										id : null,
										schedule_group_id : null,
										frequency : frequencySecs,
										time_A : secsA,
										time_B : secsB
									}]
						}]
			};
			return schedule;
		}
	}

});