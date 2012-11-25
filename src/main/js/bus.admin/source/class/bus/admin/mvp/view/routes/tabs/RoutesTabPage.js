qx.Class.define("bus.admin.mvp.view.routes.tabs.RoutesTabPage", {
	extend : qx.ui.tabview.Page,
	construct : function(routesLeftPanel, routesPage) {
		this.base(arguments, "Routes", "icon/16/apps/utilities-notes.png");
		this._routesLeftPanel = routesLeftPanel;
		this._routesPage = routesPage;
		this.setLayout(new qx.ui.layout.Canvas());
		this.initWidgets();

		var localPresenter = this._routesPage.getPresenter();
		localPresenter.addListener("loadRoutesList", this.on_loadRoutesList,
				this);
		localPresenter.addListener("loadRoute", this.on_loadRoute, this);
		localPresenter.addListener("insertRoute", this.on_insertRoute, this);
		localPresenter.addListener("updateRoute", this.on_updateRoute, this);
		localPresenter.addListener("removeRoute", this.on_removeRoute, this);
		localPresenter.addListener("startCreateNewRoute",
				this.on_startCreateNewRoute, this);
		localPresenter.addListener("finishCreateNewRoute",
				this.on_finishCreateNewRoute, this);
		localPresenter.addListener("insertStationToCurrentRoute",
				this.on_insertStationToCurrentRoute, this);

	},

	members : {
		_routesLeftPanel : null,
		_routesPage : null,

		_currRouteModel : null,
		__filterField : null,
		__routesTable : null,
		__mainContainer : null,
		__scrollContainer : null,
		__selectRouteModel : null,

		__routeTabView : null,
		__stationsTabPage : null,
		__localeTabPage : null,

		__stationsTable : null,
		__diRadioGroup : null,
		btn_new : null,
		btn_edit : null,
		btn_move : null,
		btn_delete : null,
		btn_save : null,
		btn_cancel : null,
		btn_delete_station : null,
		btn_timeTable : null,
		radioReverse : null,
		radioDirect : null,

		getRouteTableRowByID : function(id) {
			for (var i = 0; i < this.__routesTable.getTableModel()
					.getRowCount(); i++) {
				var rowData = this.__routesTable.getTableModel()
						.getRowDataAsMap(i);
				if (rowData.ID == id) {
					return i;

				}
			}
			return -1;
		},
		on_insertStationToCurrentRoute : function(e) {
			var stationModel = e.getData();
			if (stationModel == null || stationModel.error == true) {
				this
						.debug("on_insertStationToCurrentRoute() : event data has errors");
				return;
			}
			var lang_id = "c_" + qx.locale.Manager.getInstance().getLocale();
			var stationName = bus.admin.mvp.model.helpers.StationsModelHelper
					.getStationNameByLang(stationModel, lang_id);
			var rowsData = this.__stationsTable.getTableModel().getData();
			rowsData.push([stationModel.id, stationName]);
			this.__stationsTable.getTableModel().setData(rowsData);
		},
		on_updateRoute : function(e) {
			var data = e.getData();
			if (data == null || data.error == true) {
				this.debug("on_updateRoute() : event data has errors");
				return;
			}
			var opts = data.updateData.opts;
			var route = data.updateData.route;
			if (route == null)
				return;
			if (opts.isUpdateMainInfo == true) {
				var row = this.getRouteTableRowByID(route.id);
				if (row >= 0) {
					var lang_id = "c_"
							+ qx.locale.Manager.getInstance().getLocale();
					var fullName = bus.admin.mvp.model.helpers.RouteModelHelper
							.getFullName(route, lang_id);
					var tableModel = this.__routesTable.getTableModel();
					tableModel.setValue(0, row, route.id);
					tableModel.setValue(1, row, fullName);
					tableModel.setValue(2, row, route.cost);
				}
			}
			if (opts.isUpdateRouteRelations == true) {
				if (this.radioDirect.getValue() == true) {
					this.on_radio_direct();
				} else {
					this.on_radio_reverse();
				}
				this.setStatusForWidgets(this._routesPage.getStatus());
			}
		},

		on_insertRoute : function(e) {
			var data = e.getData();
			if (data == null || data.error == true) {
				this.debug("on_insertRoute() : event data has errors");
				return;
			}
			var lang_id = "c_" + qx.locale.Manager.getInstance().getLocale();
			var route = data.route;
			var name = bus.admin.mvp.model.helpers.RouteModelHelper
					.getNameByLang(route, lang_id);
			var name_number = (name ? name.toString() : "")
					+ (route.number ? route.number.toString() : "");

			var tableModel = this.__routesTable.getTableModel();
			tableModel.setRows([[route.id, name_number, route.cost]],
					tableModel.getRowCount());
		},

		on_removeRoute : function(e) {
			var data = e.getData();
			if (data == null || data.error == true) {
				this.debug("on_removeRoute() : event data has errors");
				return;
			}
			var row = this.getRouteTableRowByID(data.routeID);
			if (row >= 0) {
				this.__routesTable.getTableModel().removeRows(row, 1);
				this.clearRouteInfo();
			}
		},

		on_loadRoutesList : function(e) {
			var data = e.getData();
			this.__routesTable.getSelectionModel().resetSelection();
			this.setStatusForWidgets(this._routesPage.getStatus());
			if (data == null || data.error == true) {
				this.debug("on_loadRoutesList() : event data has errors");
				return;
			}

			var routes = data.routes.routes;
			var lang_id = "c_" + qx.locale.Manager.getInstance().getLocale();
			var rowData = [];
			if (routes == null)
				return;
			for (var i = 0; i < routes.length; i++) {
				var fullName = bus.admin.mvp.model.helpers.RouteModelHelper
						.getFullName(routes[i], lang_id);
				rowData.push([routes[i].id, fullName, routes[i].cost]);
			}
			this.__routesTable.getTableModel().setData(rowData);

		},

		setStatusForWidgets : function(status) {
			if (status == "show") {
				var routeModel = this._routesPage.getCurrRouteModel();
				if (this._routesPage.getRouteMap() && routeModel == null) {
					this._routesPage.getRouteMap().clearMapObjects();
				}
				this.debug("setStatusForWidgets()");
				console.log(routeModel);

				if (routeModel != null) {
					this.radioDirect.setEnabled(true);
					this.radioReverse.setEnabled(true);
					this.btn_timeTable.setEnabled(true);
					this.btn_edit.setEnabled(true);
					this.btn_move.setEnabled(true);
					this.btn_delete.setEnabled(true);
				} else {
					this.radioDirect.setEnabled(false);
					this.radioReverse.setEnabled(false);
					this.btn_edit.setEnabled(false);
					this.btn_move.setEnabled(false);
					this.btn_delete.setEnabled(false);
					this.btn_timeTable.setEnabled(false);
					this.btn_delete_station.setEnabled(false);
					this.__stationsTable.getTableModel().setData([]);
				}

				this.__routesTable.setEnabled(true);
				this.__filterField.setEnabled(true);
				this.btn_new.setVisibility("visible");
				this.btn_delete.setVisibility("visible");
				this.btn_edit.setVisibility("visible");
				this.btn_move.setVisibility("visible");
				this.btn_cancel.setVisibility("hidden");
				this.btn_save.setVisibility("hidden");
				this.btn_delete_station.setEnabled(false);

			} else {
				this.__routesTable.setEnabled(false);
				this.__filterField.setEnabled(false);
				this.btn_new.setVisibility("hidden");
				this.btn_delete.setVisibility("hidden");
				this.btn_edit.setVisibility("hidden");
				this.btn_move.setVisibility("hidden");
				this.btn_cancel.setVisibility("visible");
				this.btn_save.setVisibility("visible");
				this.radioDirect.setValue(true);
				this.radioDirect.setEnabled(true);
				this.btn_delete_station.setEnabled(true);
				this.btn_timeTable.setEnabled(true);
			}

		},

		on_loadRoute : function(e) {
			var data = e.getData();
			if (data == null || data.error == true) {
				this.debug("on_loadRoute() : event data has errors");
				return;
			}
			if (data.route == null)
				return;
			this.debug("on_loadRoute() : ok");
			if (this.radioDirect.getValue() == true) {
				this.on_radio_direct();
			} else {
				this.on_radio_reverse();
			}
			this.setStatusForWidgets(this._routesPage.getStatus());
		},

		/**
		 * Обработчик вызывается при начале добавления нового маршрута
		 * 
		 * @param {RouteModel}
		 *            e - (еще не полностью заполненную)
		 */
		on_startCreateNewRoute : function(e) {
			var routeModel = e.getData();
			if (routeModel == null || routeModel.error == true) {
				this.debug("on_startCreateNewRoute() : event data has errors");
				return;
			}
			if (routeModel.reverseRouteWay == null) {
				this.radioReverse.setEnabled(false);
			} else {
				this.radioReverse.setEnabled(true);
			}
			if (this.radioDirect.getValue() == true) {
				this.on_radio_direct();
			} else {
				this.radioDirect.setValue(true);
			}
			this.setStatusForWidgets(this._routesPage.getStatus());
		},

		/**
		 * Обработчик вызывается при окончании процесса создания нового
		 * маршрута: он был отредактирован пользователем, отправлен на сервер и
		 * сохранен в БД. Теперь можно сделать доступным элементы левой
		 * панели(список городов и список типов маршрута)
		 * 
		 * @param {RouteModel}
		 *            e
		 */
		on_finishCreateNewRoute : function(e) {
			var routeModel = e.getData();
			if (routeModel != null && routeModel.isOK == false) {
				this.setStatusForWidgets(this._routesPage.getStatus());
				return;
			} else if (routeModel == null || routeModel.error == true) {
				return;
			} else {
				this.setStatusForWidgets(this._routesPage.getStatus());
			}
		},

		on_btn_new : function(e) {
			var p = this._routesPage.getPresenter();
			var routeModel = {
				city_id : this._routesLeftPanel.getSelectableCityID(),
				route_type_id : this._routesLeftPanel.getRouteType()
			};
			var newRouteForm = new bus.admin.mvp.view.routes.CURouteForm(false,
					routeModel, p);
			newRouteForm.open();
		},

		on_btn_edit : function(e) {
			var p = this._routesPage.getPresenter();
			var routeModel = this._routesPage.getCurrRouteModel();
			var editRouteForm = new bus.admin.mvp.view.routes.CURouteForm(true,
					routeModel, p);
			editRouteForm.open();

		},

		on_btn_move : function(e) {
			var routeModel = this._routesPage.getCurrRouteModel();
			var event_finish_func = qx.lang.Function.bind(function(data) {

					}, this);
			this._routesPage.getPresenter().startCreateNewRoute(routeModel,
					"edit", event_finish_func);

		},

		on_btn_delete : function(e) {

			var row = this.__routesTable.getSelectionModel()
					.getAnchorSelectionIndex();
			if (row < 0)
				return;
			var rowData = this.__routesTable.getTableModel()
					.getRowDataAsMap(row);
			if (confirm(this
					.tr('Are you shue that want to delete selected route?'))) {
				qx.core.Init.getApplication().setWaitingWindow(true);
				var event_finish_func = qx.lang.Function.bind(function(data) {
							qx.core.Init.getApplication()
									.setWaitingWindow(false);
						}, this);

				this._routesPage.getPresenter().removeRoute(rowData.ID,
						event_finish_func);
			} else {
			}

		},

		isValidNewRoute : function(route) {
			console.log(route);
			if (route.directRouteWay == null
					|| route.directRouteWay.route_relations == null)
				return false;

			if (route.directRouteWay.route_relations.length <= 0) {
				return false;
			}
			if (route.reverseRouteWay != null) {
				if (route.reverseRouteWay.route_relations == null
						|| route.reverseRouteWay.route_relations == null
						|| route.reverseRouteWay.route_relations.length <= 0)
					return false;

			}

			return true;
		},
		on_btn_save : function(e) {

			// save changes from map
			var relations = this._routesPage.getRouteMap()
					.getCurrentRelationsData();
			this.updateCurrRouteWay(relations, this.radioDirect.getValue());

			// validation of the Route Model
			var route = this._routesPage.getCurrRouteModel();
			if (this.isValidNewRoute(route) == false) {
				alert("Please, make ways of route");
				return;
			}
			// save
			qx.core.Init.getApplication().setWaitingWindow(true);
			var event_finish_func = qx.lang.Function.bind(function(data) {
						qx.core.Init.getApplication().setWaitingWindow(false);
						if (data == null || data.error == true) {
							alert(this.tr("Error! The route could not save"));
							return;
						}
					}, this);
			this._routesPage.getPresenter().finishCreateNewRoute(true,
					event_finish_func);
		},

		on_btn_cancel : function(e) {
			var event_finish_func = qx.lang.Function.bind(function(data) {

					}, this);

			this._routesPage.getPresenter().finishCreateNewRoute(false,
					event_finish_func);

		},
		on_btn_deleteStation : function(e) {
			var status = this._routesPage.getStatus();
			if (status == "show")
				return;

			var row = this.__stationsTable.getSelectionModel()
					.getAnchorSelectionIndex();
			if (row < 0)
				return;
			var rowData = this.__stationsTable.getTableModel()
					.getRowDataAsMap(row);
			if (this._routesPage.getRouteMap() != null) {
				this._routesPage.getRouteMap().deleteRouteStation(rowData.ID);
			}
			this.__stationsTable.getTableModel().removeRows(row, 1);

		},
		on_btn_timeTable : function(e) {
			var route = this._routesPage.getCurrRouteModel();
			var routeWay = null;
			if (this.radioDirect.getValue() == true) {
				routeWay = route.directRouteWay;
			} else {
				routeWay = route.reverseRouteWay;
			}
			var form = new bus.admin.mvp.view.routes.tabs.TimeForm(
					this._routesPage, routeWay);
			form.open();
		},
		unInitialize : function() {
			this.__routesTable.removeListener("cellClick",
					this.on_routesTable_click, this);
			this.__filterField.removeListener("input",
					this.on_change_filterField, this);
			this.btn_edit.removeListener("execute", this.on_btn_edit, this);
			this.btn_move.removeListener("execute", this.on_btn_move, this);
			this.btn_delete.removeListener("execute", this.on_btn_delete, this);
			this.btn_timeTable.removeListener("execute", this.on_btn_timeTable,
					this);
			this.btn_save.removeListener("execute", this.on_btn_save, this);
			this.btn_cancel.removeListener("execute", this.on_btn_cancel, this);
			this.btn_new.removeListener("execute", this.on_btn_new, this);
			this.btn_delete_station.removeListener("execute",
					this.on_btn_deleteStation, this);
		},
		initialize : function() {

			this.__routesTable.addListener("cellClick",
					this.on_routesTable_click, this);
			this.__filterField.addListener("input", this.on_change_filterField,
					this);
			this.btn_new.addListener("execute", this.on_btn_new, this);
			this.btn_edit.addListener("execute", this.on_btn_edit, this);
			this.btn_save.addListener("execute", this.on_btn_save, this);
			this.btn_cancel.addListener("execute", this.on_btn_cancel, this);
			this.btn_move.addListener("execute", this.on_btn_move, this);
			this.btn_delete.addListener("execute", this.on_btn_delete, this);
			this.btn_delete_station.addListener("execute",
					this.on_btn_deleteStation, this);
			this.btn_timeTable.addListener("execute", this.on_btn_timeTable,
					this);

		},
		initWidgets : function() {
			this.__mainContainer = new qx.ui.container.Composite();
			this.__mainContainer.setMinHeight(430);
			this.__mainContainer.setMinWidth(430);
			this.__mainContainer.setLayout(new qx.ui.layout.Canvas());
			this.__mainContainer.addListener("resize",
					this.on_resize_mainContainer, this);
			this.__scrollContainer = new qx.ui.container.Scroll().set({
						width : 300,
						height : 200
					});

			// buttons
			this.btn_new = new qx.ui.form.Button("New...",
					"bus/admin/images/btn/go-bottom.png");
			this.btn_new.setWidth(105);

			this.btn_edit = new qx.ui.form.Button("Edit...",
					"bus/admin/images/btn/go-bottom.png");
			this.btn_edit.setWidth(105);
			this.btn_move = new qx.ui.form.Button("Move",
					"bus/admin/images/btn/utilities-text-editor.png");
			this.btn_move.setWidth(105);

			this.btn_delete = new qx.ui.form.Button("Delete",
					"bus/admin/images/btn/edit-delete.png");
			this.btn_delete.setWidth(105);

			this.btn_save = new qx.ui.form.Button("Save",
					"bus/admin/images/btn/dialog-apply.png");
			this.btn_save.setWidth(105);
			this.btn_save.setVisibility("hidden");

			this.btn_cancel = new qx.ui.form.Button("Cancel",
					"bus/admin/images/btn/dialog-cancel.png");
			this.btn_cancel.setWidth(105);
			this.btn_cancel.setVisibility("hidden");

			// add widgets
			var filterLabel = new qx.ui.basic.Label("Filter:");
			this.__filterField = new qx.ui.form.TextField();

			this.__routesTable = this.__createRoutesTable();

			this.__mainContainer.add(filterLabel, {
						left : 10,
						top : 10
					});

			this.__mainContainer.add(this.__filterField, {
						left : 50,
						top : 10
					});

			this.__mainContainer.add(this.__routesTable, {
						left : 10,
						top : 50
					});

			this.__mainContainer.add(this.btn_save);
			this.__mainContainer.add(this.btn_cancel);
			this.__mainContainer.add(this.btn_new);
			this.__mainContainer.add(this.btn_edit);
			this.__mainContainer.add(this.btn_move);
			this.__mainContainer.add(this.btn_delete);

			this.__routeTabView = this.__createRouteTabView();
			this.__mainContainer.add(this.__routeTabView, {
						left : 10,
						top : 215
					});
			this.__scrollContainer.add(this.__mainContainer);
			this.add(this.__scrollContainer, {
						left : 0,
						top : 0,
						width : "100%",
						height : "100%"
					});

		},
		on_change_filterField : function(e) {
			var fieldValue = this.__filterField.getValue();
			var model = this.__routesTable.getTableModel();

			if (fieldValue.length > 0) {
				this.debug("on_change_filterField(): " + fieldValue);
				model.resetHiddenRows();
				model.addNotRegex(fieldValue, "Number", true);
				model.applyFilters();
			} else {
				model.resetHiddenRows();
			}

		},

		__createRouteTabView : function() {
			var tabView = new qx.ui.tabview.TabView();

			// create stationsTabPage
			this.__stationsTabPage = new qx.ui.tabview.Page("Stations");
			this.__stationsTabPage.setLayout(new qx.ui.layout.Canvas());
			this.__stationsTabPage.setWidth(250);
			this.__stationsTabPage.setHeight(200);

			this.__diRadioGroup = new qx.ui.form.RadioButtonGroup();
			this.radioDirect = new qx.ui.form.RadioButton("Direct");
			this.radioReverse = new qx.ui.form.RadioButton("Reverse");
			this.__stationsTable = this.__createStationsTable();
			this.radioDirect.addListener("changeValue", this.on_radio_direct,
					this);
			this.radioReverse.addListener("changeValue", this.on_radio_reverse,
					this);

			this.radioDirect.execute();
			this.__diRadioGroup.setLayout(new qx.ui.layout.VBox(5));
			this.__diRadioGroup.add(this.radioDirect);
			this.__diRadioGroup.add(this.radioReverse);

			this.btn_timeTable = new qx.ui.form.Button("Timetable...",
					"bus/admin/images/btn/go-bottom.png");
			this.btn_timeTable.setWidth(90);

			this.btn_delete_station = new qx.ui.form.Button("Delete",
					"bus/admin/images/btn/edit-delete.png");
			this.btn_delete_station.setWidth(90);
			this.__stationsTabPage.add(this.__diRadioGroup);
			this.__stationsTabPage.add(this.__stationsTable, {
						left : 5,
						top : 5
					});
			this.__stationsTabPage.add(this.btn_timeTable);
			this.__stationsTabPage.add(this.btn_delete_station);

			// create localeTabPage
			this.__localeTabPage = new qx.ui.tabview.Page("Localization");
			this.__localeTabPage.setWidth(250);
			this.__localeTabPage.setHeight(200);

			// add pages to tabView
			// var transportType = this.__routesLeftPanel.getTransportType();
			tabView.add(this.__stationsTabPage);

			/*
			 * if (transportType.toString() == "c_metro") {
			 * tabView.add(this.__localeTabPage); }
			 */
			tabView.addListener("resize", this.on_resize_tabView, this);

			return tabView;
		},
		__createStationsTable : function() {
			// table model
			var tableModel = new qx.ui.table.model.Simple();
			tableModel.setColumns(["ID", "Name"]);
			tableModel.setColumnEditable(0, false);
			tableModel.setColumnEditable(1, false);
			// table
			var stationsTable = new qx.ui.table.Table(tableModel).set({
						decorator : null
					});
			stationsTable.setBackgroundColor('white');
			stationsTable.setStatusBarVisible(false);
			stationsTable.setHeight(90);

			return stationsTable;
		},
		__createRoutesTable : function() {
			// table model
			var tableModel = new qx.ui.table.model.Filtered();
			tableModel.setColumns(["ID", "Number", "Cost"]);
			tableModel.setColumnEditable(0, false);
			tableModel.setColumnEditable(1, false);
			tableModel.setColumnEditable(2, false);

			// table
			var routesTable = new qx.ui.table.Table(tableModel).set({
						decorator : null
					});
			routesTable.setBackgroundColor('white');
			routesTable.setStatusBarVisible(false);

			routesTable.setHeight(150);

			return routesTable;

		},

		loadStationsTable : function(way) {
			var rowData = [];
			if (way == null || way.route_relations == null) {
				this.__stationsTable.getTableModel().setData(rowData);
				if (this._routesPage.getRouteMap() != null)
					this._routesPage.getRouteMap().showRouteWay(null);
				return;
			}
			this.debug(way.route_relations.length);
			var lang_id = "c_" + qx.locale.Manager.getInstance().getLocale();
			for (var i = 0; i < way.route_relations.length; i++) {
				var relation = way.route_relations[i];
				var station_id = relation.stationB.id;
				var name = bus.admin.mvp.model.helpers.StationsModelHelper
						.getStationNameByLang(relation.stationB, lang_id);
				rowData.push([station_id, name]);
			}
			this.__stationsTable.getTableModel().setData(rowData);
			this._routesPage.getRouteMap().showRouteWay(way.direct);

		},
		updateCurrRouteWay : function(relations, directType) {
			if (relations == null)
				return;

			var routeModel = this._routesPage.getCurrRouteModel();
			if (directType == true) {
				if (routeModel.directRouteWay == null) {
					routeModel.directRouteWay = {
						direct : true,
						route_relations : relations
					};
				} else {
					routeModel.directRouteWay.direct = true;
					routeModel.directRouteWay.route_relations = relations;
				}
				// directRouteWay:
			} else {
				if (routeModel.reverseRouteWay == null) {
					routeModel.reverseRouteWay = {
						direct : false,
						route_relations : relations
					};
				} else {
					routeModel.reverseRouteWay.direct = false;
					routeModel.reverseRouteWay.route_relations = relations;
				}
			}
			console.log(routeModel);
		},
		on_radio_direct : function(e) {
			if (this.radioDirect.getValue() == false)
				return;
			var route = this._routesPage.getCurrRouteModel();
			if (this._routesPage.getStatus() != "show") {
				var relations = this._routesPage.getRouteMap()
						.getCurrentRelationsData();
				this.updateCurrRouteWay(relations, false);
			}
			if (route == null) {
				this.__stationsTable.getTableModel().setData([]);
				if (this._routesPage.getRouteMap() != null)
					this._routesPage.getRouteMap().showRouteWay(null);
				return;
			}

			// getCurrentRelationsData
			this.loadStationsTable(route.directRouteWay);
		},

		on_radio_reverse : function(e) {
			if (this.radioReverse.getValue() == false)
				return;
			var route = this._routesPage.getCurrRouteModel();
			if (this._routesPage.getStatus() != "show") {
				var relations = this._routesPage.getRouteMap()
						.getCurrentRelationsData();
				this.updateCurrRouteWay(relations, true);
			}
			if (route == null) {
				this.__stationsTable.getTableModel().setData([]);
				if (this._routesPage.getRouteMap() != null)
					this._routesPage.getRouteMap().showRouteWay(null);
				return;
			}
			this.loadStationsTable(route.reverseRouteWay);
		},

		on_routesTable_click : function(e) {
			// tget current routeID
			this.debug("on_routesTable_click()");
			var row = this.__routesTable.getSelectionModel()
					.getAnchorSelectionIndex();
			if (row < 0)
				return;
			var rowData = this.__routesTable.getTableModel()
					.getRowDataAsMap(row);
			// send request
			qx.core.Init.getApplication().setWaitingWindow(true);
			var loadRoutes_finish_func = qx.lang.Function.bind(function(data) {
						qx.core.Init.getApplication().setWaitingWindow(false);
					}, this);
			this._routesPage.getPresenter().loadRoute(rowData.ID,
					loadRoutes_finish_func);

		},

		on_resize_tabView : function(e) {
			if (this.__stationsTable != null) {
				this.__stationsTable
						.setWidth(this.__routeTabView.getBounds().width
								- this.__stationsTable.getBounds().left - 130);
				this.__stationsTable
						.setHeight(this.__routeTabView.getBounds().height
								- this.__stationsTable.getBounds().top - 40);
			}
			if (this.__diRadioGroup != null) {
				this.__diRadioGroup.setUserBounds(this.__routeTabView
								.getBounds().width
								- 120, 5,
						this.__diRadioGroup.getBounds().width,
						this.__diRadioGroup.getBounds().height);
			}
			this.btn_timeTable.setUserBounds(
					this.__routeTabView.getBounds().width - 120, 80,
					this.btn_timeTable.getBounds().width, this.btn_timeTable
							.getBounds().height);
			this.btn_delete_station.setUserBounds(this.__routeTabView
							.getBounds().width
							- 120, 130,
					this.btn_delete_station.getBounds().width,
					this.btn_delete_station.getBounds().height);

		},
		on_resize_mainContainer : function(e) {
			this.debug("on_resize_tabView()1");
			this.debug(this.__mainContainer.getBounds().width);
			if (this.__routesTable != null) {
				this.__routesTable
						.setWidth(this.__mainContainer.getBounds().width
								- this.__routesTable.getBounds().left - 115);
				this.btn_save.setUserBounds(
						this.__mainContainer.getBounds().width - 110, 50,
						this.btn_save.getBounds().width, this.btn_save
								.getBounds().height);
				this.btn_cancel.setUserBounds(
						this.__mainContainer.getBounds().width - 110, 85,
						this.btn_cancel.getBounds().width, this.btn_cancel
								.getBounds().height);
				this.btn_new.setUserBounds(
						this.__mainContainer.getBounds().width - 110, 50,
						this.btn_new.getBounds().width, this.btn_new
								.getBounds().height);
				this.btn_edit.setUserBounds(
						this.__mainContainer.getBounds().width - 110, 85,
						this.btn_edit.getBounds().width, this.btn_edit
								.getBounds().height);
				this.btn_move.setUserBounds(
						this.__mainContainer.getBounds().width - 110, 120,
						this.btn_move.getBounds().width, this.btn_move
								.getBounds().height);

				this.btn_delete.setUserBounds(
						this.__mainContainer.getBounds().width - 110, 155,
						this.btn_delete.getBounds().width, this.btn_delete
								.getBounds().height);

			}
			if (this.__routeTabView != null) {
				this.__routeTabView
						.setWidth(this.__mainContainer.getBounds().width
								- this.__routeTabView.getBounds().left - 10);
				this.__routeTabView
						.setHeight(this.__mainContainer.getBounds().height
								- this.__routeTabView.getBounds().top - 10);
			}
			this.debug("on_resize_tabView()2");
		}

	}

});