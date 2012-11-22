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

		on_loadRoutesList : function(e) {
			var data = e.getData();
			if (data == null || data.error == true) {
				this.debug("on_loadRoutesList() : event data has errors");
				return;
			}

			var routes = data.routes.routes;
			var lang_id = "c_" + qx.locale.Manager.getInstance().getLocale();
			var rowData = [];
			console.log(routes);
			if (routes == null)
				return;
			for (var i = 0; i < routes.length; i++) {
				var name = bus.admin.mvp.model.helpers.RouteModelHelper
						.getNameByLang(routes[i], lang_id);
				var name_number = (name ? name.toString() : "")
						+ (routes[i].number ? routes[i].number.toString() : "");
				rowData.push([routes[i].id, name_number, routes[i].cost]);
			}
			this.__routesTable.getTableModel().setData(rowData);
			this.__stationsTable.getTableModel().setData([]);

		},
		on_loadRoute : function(e) {
			var data = e.getData();
			if (data == null || data.error == true) {
				this.debug("on_loadRoute() : event data has errors");
				return;
			}
			this.debug("on_loadRoute() : ok");
			if (this.radioDirect.getValue() == true) {
				this.on_radio_direct();
			} else {
				this.on_radio_reverse();
			}

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

			this.__routesTable.setEnabled(false);
			this.__filterField.setEnabled(false);
			this.btn_new.setVisibility("hidden");
			this.btn_delete.setVisibility("hidden");
			this.btn_edit.setVisibility("hidden");
			this.btn_move.setVisibility("hidden");
			this.btn_cancel.setVisibility("visible");
			this.btn_save.setVisibility("visible");
			this.radioDirect.setValue(true);

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
			this.radioReverse.setEnabled(true);
			this.__routesTable.setEnabled(true);
			this.__filterField.setEnabled(true);
			this.btn_new.setVisibility("visible");
			this.btn_delete.setVisibility("visible");
			this.btn_edit.setVisibility("visible");
			this.btn_move.setVisibility("visible");
			this.btn_cancel.setVisibility("hidden");
			this.btn_save.setVisibility("hidden");

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
			// bus.admin.mvp.view.cities.CURouteForm
		},

		on_btn_move : function(e) {
		},

		on_btn_delete : function(e) {

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

		on_btn_timeTable : function(e) {
			var routeWay = null;
			var presenter = null;
			if (this.radioDirect.getValue() == true) {
				routeWay = this._routesPage.getCurrRouteModel().directRouteWay;
			} else {
				routeWay = this._routesPage.getCurrRouteModel().reverseRouteWay;
			}

			var form = new bus.admin.mvp.view.routes.tabs.TimeForm(routeWay,
					presenter);
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

			this.btn_timeTable = new qx.ui.form.Button("Time table...",
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