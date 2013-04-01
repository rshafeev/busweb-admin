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

/**
 #asset(bus/admin/images/*)
 */

/**
 * Диалоговое окно для создания/ редактироания маршрута.
 */
qx.Class.define("bus.admin.mvp.view.routes.CURouteForm", {
	extend : qx.ui.window.Window,

 	/**
 	 * @param  presenter   {bus.admin.mvp.presenter.RoutesPresenter}  Presenter   
 	 * @param  isChangeDlg {Boolean}  Тип окна. True - диалоговое окно для редактирования ранее созданного маршрута. False - диалоговое окнго создания нового маршрута.
 	 * @param  routeModel  {bus.admin.mvp.model.RouteModel}     Модель маршрута.
 	 */
	construct : function(presenter, isChangeDlg, routeModel) {
		this.base(arguments);
 		this.__routeModel = routeModel;
 		this.__isChangeDlg = isChangeDlg;
 		this.__presenter = presenter;
		this.initWidgets();
		this.__setOptions();

	},

	members : {

 		/**
 		 * Тип окна. True - диалоговое окно для редактирования ранее созданной остановки.
 		 * False - диалоговое окно создания новой остановки.
 		 * @type {Boolean}
 		 */
 		 __isChangeDlg : false,

 		/**
 		 * Presenter
 		 * @type {bus.admin.mvp.presenter.RoutesPresenter}
 		 */
 		 __presenter : null,

 		/**
 		 * Модель станции.
 		 * @type {bus.admin.mvp.model.RouteModel}
 		 */
 		 __routeModel : null,



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
						alert(this.tr("Please, push names for all languages"));
						return;
					}
				}
			} else if (number == null || number.toString().length <= 0) {
				alert(this.tr("Please, set a number of route"));
				return;

			}

			var routes = this._routesPresenter.getRoutePage()
					.getCurrRoutesList();
			if (routes != null) {
				for (var i = 0; i < routes.length; i++) {
					if (routes[i].number != null
							&& routes[i].number.toString().length != 0
							&& routes[i].number.toString() == number
							&& (this.__routeModel.number == null || this.__routeModel.number
									.toString() != number)) {
						alert(this
								.tr("The route with this number has already exist!"));
						return;
					}
				}
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
				this.__updateRoute(number, cost);
			} else {
				this.__insertRoute(number, cost, schedule,
						this.check_sameDirections.getValue());
			}
		},

		on_cancel_click : function() {
			this.close();
		},

		__updateRoute : function(number, cost) {
			// model
			var route = bus.admin.helpers.ObjectHelper.clone(this.__routeModel);
			route.number = number;
			route.cost = cost;
			route.name = [];
			if (this.check_names.getValue() == true) {

				for (var i = 0; i < this.table_names.getTableModel()
						.getRowCount(); i++) {
					var rowData = this.table_names.getTableModel()
							.getRowDataAsMap(i);
					var modelsContainer = qx.core.Init.getApplication()
							.getModelsContainer();
					var lang = modelsContainer.getLangsModel()
							.getLangByName(rowData.Language);
					route.name.push({
								lang_id : lang.id,
								value : rowData.Name
							});
				}
			}
			// execute presenter event
			var updateData = {
				route : route,
				opts : {
					isUpdateSchedule : false,
					isUpdateMainInfo : true,
					isUpdateRouteRelations : false
				}
			};

			qx.core.Init.getApplication().setWaitingWindow(true);
			var event_finish_func = qx.lang.Function.bind(function(data) {
						qx.core.Init.getApplication().setWaitingWindow(false);
						if (data == null || data.error == true) {
							alert(this.tr("Error! Can not changed this route."));
							return;
						}
						this.close();
					}, this);
			this._routesPresenter.updateRoute(updateData, event_finish_func);

		},

		__insertRoute : function(number, cost, schedule, sameDirections) {

			// create model
			this.__routeModel.number = number;
			this.__routeModel.cost = cost;
			this.__routeModel.name = [];
			if (sameDirections == false) {
				this.__routeModel.directRouteWay = {
					schedule : schedule
				};

				this.__routeModel.reverseRouteWay = {
					schedule : bus.admin.helpers.ObjectHelper.clone(schedule)
				};
			} else {
				this.__routeModel.directRouteWay = {
					schedule : schedule
				};
				this.__routeModel.reverseRouteWay = null;
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
					this.__routeModel.name.push({
								lang_id : lang.id,
								value : rowData.Name
							});
				}
			}
			var event_finish_func = qx.lang.Function.bind(function(data) {
						this.close();
					}, this);
			this._routesPresenter.startCreateNewRoute(this.__routeModel, "new",
					event_finish_func);
		},

		initWidgets : function() {
			this.setLayout(new qx.ui.layout.Canvas());

			var mainSettings = new qx.ui.groupbox.GroupBox("Main info");
			mainSettings.setLayout(new qx.ui.layout.Canvas());

			var labelNumber = new qx.ui.basic.Label("Number:");
			var labelCost = new qx.ui.basic.Label("Cost:");
			this.editNumber = new qx.ui.form.TextField("");
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

			if (!this.getChangeDialog()) {
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
				this.check_sameDirections = new qx.ui.form.CheckBox("Same ways");
				this.check_sameDirections.setValue(false);

				this.add(timeSettings, {
							left : 180,
							top : -10
						});
				this.add(this.check_sameDirections, {
							left : 80,
							top : 130
						});
			}
			// add to cantainer

			this.check_names = new qx.ui.form.CheckBox("Names");
			this.check_names.addListener("changeValue", this.on_check_names,
					this);
			this.check_names.setValue(false);

			this.on_check_names();
			this.add(mainSettings, {
						left : 0,
						top : -10
					});

			this.add(this.check_names, {
						left : 10,
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
				this.editCost.setValue(this.__routeModel.cost.toString());
				this.editNumber.setValue(this.__routeModel.number.toString());
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

			// fill table
			var modelsContainer = qx.core.Init.getApplication()
					.getModelsContainer();
			var langs = modelsContainer.getLangsModel().getData();
			var rowData = [];
			var check_names = false;

			for (var i = 0; i < langs.length; i++) {
				var name = "";
				if (this.getChangeDialog()) {
					name = bus.admin.mvp.model.helpers.RouteModelHelper
							.getNameByLang(this.__routeModel, langs[i].id);
				}
				if (name != null && name != "")
					check_names = true;
				rowData.push([langs[i].name, name]);
				this.debug(langs[i].name);
			}
			this.check_names.setValue(check_names);
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