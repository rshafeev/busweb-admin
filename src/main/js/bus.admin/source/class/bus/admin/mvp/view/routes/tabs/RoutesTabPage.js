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
 #asset(qx/icon/${qx.icontheme}/16/apps/utilities-notes.png)
 */

/**
 * Вкладка "Routes". Является дочерним виджетом левой панели {@link bus.admin.mvp.view.routes.RoutesLeftPanel}
 */
 qx.Class.define("bus.admin.mvp.view.routes.tabs.RoutesTabPage", {
 	extend : qx.ui.tabview.Page,
 	construct : function(presenter) {
 		this.base(arguments, "Routes", "icon/16/apps/utilities-notes.png");
 		this.__presenter = presenter;
 		this.setLayout(new qx.ui.layout.Canvas());
 		this.__initWidgets();

 		presenter.addListener("load_routes_list", this.__onLoadRoutesList, this);
 		presenter.addListener("select_route", this.__onSelectRoute, this);
 		presenter.addListener("update_route", this.__onUpdateRoute, this);
 		presenter.addListener("change_state", this.__onChangeState, this);
 		
},

members : {

  		/**
 		 * Presenter представления
 		 * @type {bus.admin.mvp.presenter.RoutesPresenter}
 		 */
 		 __presenter : null,

 		/**
 		 * Таблица маршрутов.
 		 * @type {qx.ui.table.Table}
 		 */
 		 __tableRoutes : null,

 		/**
 		 * Поле для фильтрации станций в таблице по назнанию.
 		 * @type {qx.ui.form.TextField}
 		 */
 		 __filterField : null,


 		 /**
 		  * Набор вкладок для работы с данными выбранного маршрута. 
 		  * @type {bus.admin.mvp.view.routes.tabs.RouteTabsView}
 		  */
 		  __routeTabsView : null,

 		  /**
 		   * Кнопка для создания нового маршрута.
 		   * @type {qx.ui.form.Button}
 		   */
 		   __btnNew : null,

 		  /**
 		   * Кнопка для вывоза диалогового окна редактирования основной информации маршрута.
 		   * @type {qx.ui.form.Button}
 		   */
 		   __btnEdit : null,

 		  /**
 		   * Кнопка для прекращения процесса конструирования маршута и с дальнейшим его сохранением.
 		   * @type {qx.ui.form.Button}
 		   */
 		   __btnSave : null,

 		  /**
 		   * Кнопка для прекращения процесса конструирования маршута.
 		   * @type {qx.ui.form.Button}
 		   */
 		   __btnСancel : null,

 		   __mainContainer : null,
 		   __scrollContainer : null,
 		   btn_import : null,
 		   __btnRemodelRoute : null,
 		   btn_delete : null,

		 /**
		 * Обработчик события  {@link bus.admin.mvp.presenter.RoutesPresenter#select_route select_route} вызывается при выборе 
		 * пользователем маршрута.
		 * @param  e {qx.event.type.Data} Данные события. Структуру свойств смотрите в описании события.
		 */
		 __onSelectRoute : function (e){
		 	this.debug("execute __onSelectRoute() event handler");
		 	var state = this.__presenter.getDataStorage().getState();
		 	this.__setState(state);
		 },

		 /**
		 * Обработчик события  {@link bus.admin.mvp.presenter.RoutesPresenter#change_state change_state} вызывается при изменении состояния страницы.
		 * @param  e {qx.event.type.Data} Данные события. Структуру свойств смотрите в описании события.
		 */
		 __onChangeState : function (e){
		 	this.debug("execute __onChangeState() event handler");
		 	var state = e.getData().newState;
		 	this.__setState(state);
		 },

		 /**
		  * Задать виджету состояние
		  * @param  state {String} Состояние
		  */
		  __setState : function(state){
		  	var routeModel = this.__presenter.getDataStorage().getSelectedRoute();
		  	if(state == "none"){
		  		if(routeModel == null){
		  			this.btn_import.setEnabled(false);
		  			this.__btnEdit.setEnabled(false);
		  			this.__btnRemodelRoute.setEnabled(false);
		  			this.btn_delete.setEnabled(false);

		  		}else{
		  			this.__btnNew.setEnabled(true);
		  			this.btn_import.setEnabled(true);
		  			this.__btnEdit.setEnabled(true);
		  			this.__btnRemodelRoute.setEnabled(true);
		  			this.btn_delete.setEnabled(true);
		  		}
		  		this.__tableRoutes.setEnabled(true);
		  		this.__btnSave.setVisibility("hidden");
		  		this.__btnСancel.setVisibility("hidden");
		  		this.__btnNew.setVisibility("visible");
		  		this.btn_import.setVisibility("visible");
		  		this.__btnEdit.setVisibility("visible");
		  		this.__btnRemodelRoute.setVisibility("visible");
		  		this.btn_delete.setVisibility("visible");
		  	} 

		  	if(state == "make"){
		  		this.__tableRoutes.setEnabled(false);
		  		this.__btnSave.setVisibility("visible");
		  		this.__btnСancel.setVisibility("visible");
		  		this.__btnNew.setVisibility("hidden");
		  		this.btn_import.setVisibility("hidden");
		  		this.__btnEdit.setVisibility("hidden");
		  		this.__btnRemodelRoute.setVisibility("hidden");
		  		this.btn_delete.setVisibility("hidden");
		  	}

		  },

		 /**
		 * Обработчик события  {@link bus.admin.mvp.presenter.RoutesPresenter#update_route update_route} вызывается при выборе 
		 * пользователем маршрута.
		 * @param  e {qx.event.type.Data} Данные события. Структуру свойств смотрите в описании события.
		 */
		 __onUpdateRoute : function (e){
		 	this.debug("execute __onUpdateRoute() event handler");
		 	var route = e.getData().requestRoute;
		 	var rowIndex = this._getTableRowIndexByRouteID(route.getId());
		 	if(rowIndex < 0){
		 		return;
		 	}
		 	var tableModel = this.__tableRoutes.getTableModel();
		 	var langID = qx.core.Init.getApplication().getDataStorage().getLocale();
		 	tableModel.setValue(0, rowIndex, route.getId());
		 	tableModel.setValue(1, rowIndex, route.getNumber(langID));
		 	tableModel.setValue(2, rowIndex, route.getCost());
		 },



 		/**
 		 * Создает виджеты вкладки
 		 */
 		 __initWidgets : function() {
 		 	this.__mainContainer = new qx.ui.container.Composite();
 		 	this.__mainContainer.setMinHeight(430);
 		 	this.__mainContainer.setMinWidth(430);
 		 	this.__mainContainer.setLayout(new qx.ui.layout.Canvas());
 		 	this.__mainContainer.addListener("resize", this.__onResize, this);
 		 	this.__scrollContainer = new qx.ui.container.Scroll().set({
 		 		width : 300,
 		 		height : 200
 		 	});

			// buttons
			this.__btnNew = new qx.ui.form.Button(this.tr("New..."),	"bus/admin/images/btn/go-bottom.png");
			this.__btnNew.setWidth(105);
			this.__btnNew.addListener("execute", this._onClickBtnNew, this);


			this.btn_import = new qx.ui.form.Button(this.tr("Import..."),
				"bus/admin/images/btn/go-bottom.png");
			this.btn_import.setWidth(105);
			
			this.__btnEdit = new qx.ui.form.Button(this.tr("Edit..."),
				"bus/admin/images/btn/go-bottom.png");
			this.__btnEdit.setWidth(105);
			this.__btnEdit.addListener("execute", this.__onClickBtnEdit, this);


			this.__btnRemodelRoute = new qx.ui.form.Button(this.tr("Remodel"),
				"bus/admin/images/btn/utilities-text-editor.png");
			this.__btnRemodelRoute.setWidth(105);
			this.__btnRemodelRoute.addListener("execute", this.__onBtnRemodelRoute, this);


			this.btn_delete = new qx.ui.form.Button(this.tr("Delete"),
				"bus/admin/images/btn/edit-delete.png");
			this.btn_delete.setWidth(105);

			this.__btnSave = new qx.ui.form.Button(this.tr("Save"),
				"bus/admin/images/btn/dialog-apply.png");
			this.__btnSave.setWidth(105);
			this.__btnSave.setVisibility("hidden");
			this.__btnSave.addListener("execute", this.__onClickBtnSave, this);
			

			this.__btnСancel = new qx.ui.form.Button(this.tr("Cancel"),
				"bus/admin/images/btn/dialog-cancel.png");
			this.__btnСancel.setWidth(105);
			this.__btnСancel.setVisibility("hidden");
			this.__btnСancel.addListener("execute", this.__onBtnСancel, this);

			// add widgets
			var filterLabel = new qx.ui.basic.Label(this.tr("Filter:"));
			this.__filterField = new qx.ui.form.TextField();

			this.__tableRoutes = this.__createRoutesTable();

			this.__mainContainer.add(filterLabel, {
				left : 10,
				top : 10
			});

			this.__mainContainer.add(this.__filterField, {
				left : 50,
				top : 10
			});

			this.__mainContainer.add(this.__tableRoutes, {
				left : 10,
				top : 50
			});

			this.__mainContainer.add(this.__btnSave);
			this.__mainContainer.add(this.__btnСancel);
			this.__mainContainer.add(this.__btnNew);
			this.__mainContainer.add(this.btn_import);
			this.__mainContainer.add(this.__btnEdit);
			this.__mainContainer.add(this.__btnRemodelRoute);
			this.__mainContainer.add(this.btn_delete);

			//this.__routeTabView = this.__createRouteTabView();
			this.__routeTabsView = new bus.admin.mvp.view.routes.tabs.RouteTabsView(this.__presenter);

			this.__mainContainer.add(this.__routeTabsView, {
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

			this.__filterField.addListener("changeValue", this.__onChangeFilterField, this);

			/*
			this.btn_import.addListener("execute", this.on_btn_import, this);
			this.btn_delete.addListener("execute", this.on_btn_delete, this);
			*/
		},

		/**
		 * Создает таблицу, отображающую список маршрутов.
		 */
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


		/**
		 * Обработчик события {@link bus.admin.mvp.presenter.RoutesPresenter#load_routes_list load_routes_list}
		 * @param  e {qx.event.type.Data} Данные события. Структуру свойств смотрите в описании события.
		 */
		 __onLoadRoutesList : function(e){
		 	this.debug("execute __onLoadRoutesList() event handler");
		 	this.__fillTableRoutes(e.getData().routesList);
		 },


  		/**
 		 * Загружает данные в таблицу маршрутов.
 		 * @param  routesList {bus.admin.mvp.model.RoutesListModel}   Список маршрутов
 		 */
 		 __fillTableRoutes : function(routesList){
 		 	this.debug("execute _fillTableRoutes() event handler");
 		 	var rowsData = [];
 		 	var routes = routesList.getAll();
 		 	this.__tableRoutes.removeListener("cellClick",	this.__onClickTableRoutes, this);
 		 	for(var i = 0; i <  routes.length; i++){
 		 		rowsData.push([routes[i].getId(), routes[i].getNumber(), routes[i].getCost()]);
 		 	}
 		 	this.__tableRoutes.getTableModel().setData(rowsData);
 		 	this.__tableRoutes.addListener("cellClick",	this.__onClickTableRoutes, this);
 		 },

 		/**
 		 * Обработчик нажатия кнопки Enter после ввода данных в поле фильтрации станций.
 		 * @param e {qx.event.type.Event} Объект события.
 		 */
 		 __onChangeFilterField : function(e) {
 		 	var fieldValue = this.__filterField.getValue();
 		 	var model = this.__tableRoutes.getTableModel();
 		 	if (fieldValue.length > 0) {
 		 		this.debug("on_change_filterField(): " + fieldValue);
 		 		model.resetHiddenRows();
 		 		model.addNotRegex(fieldValue, "Number", true);
 		 		model.applyFilters();
 		 	} else {
 		 		model.resetHiddenRows();
 		 	}
 		 },

 		/**
 		 * Обработчик выбора маршрута из списка.
 		 * @param e {qx.event.type.Event} Объект события.
 		 */
 		 __onClickTableRoutes : function(e) {
			// tget current routeID
			this.debug("__onClickTableRoutes()");
			var row = this.__tableRoutes.getSelectionModel().getAnchorSelectionIndex();
			if (row < 0)
				return;
			var rowData = this.__tableRoutes.getTableModel().getRowDataAsMap(row);
			// send request
			qx.core.Init.getApplication().setWaitingWindow(true);
			var callback = qx.lang.Function.bind(function(data) {
				qx.core.Init.getApplication().setWaitingWindow(false);
			}, this);
			this.__presenter.selectRouteTrigger(rowData.ID, true, callback);

		},

 		 /**
 		  * Обработчик события изменения размеров текущего объекта.
 		  * @param e {qx.event.type.Event} Объект события.
 		  */
 		  __onResize : function(e) {
 		  	this.debug("__onResize()");
 		  	if (this.__tableRoutes != null) {
 		  		this.__tableRoutes.setWidth(this.__mainContainer.getBounds().width
 		  			- this.__tableRoutes.getBounds().left - 115);
 		  		this.__btnSave.setUserBounds(
 		  			this.__mainContainer.getBounds().width - 110, 50,
 		  			this.__btnSave.getBounds().width, this.__btnSave.getBounds().height);
 		  		this.__btnСancel.setUserBounds(
 		  			this.__mainContainer.getBounds().width - 110, 85,
 		  			this.__btnСancel.getBounds().width, this.__btnСancel.getBounds().height);
 		  		this.__btnNew.setUserBounds(
 		  			this.__mainContainer.getBounds().width - 110, 50,
 		  			this.__btnNew.getBounds().width, this.__btnNew.getBounds().height);
 		  		this.btn_import.setUserBounds(
 		  			this.__mainContainer.getBounds().width - 110, 85,
 		  			this.btn_import.getBounds().width, this.btn_import.getBounds().height);

 		  		this.__btnEdit.setUserBounds(
 		  			this.__mainContainer.getBounds().width - 110, 120,
 		  			this.__btnEdit.getBounds().width, this.__btnEdit.getBounds().height);
 		  		this.__btnRemodelRoute.setUserBounds(
 		  			this.__mainContainer.getBounds().width - 110, 155,
 		  			this.__btnRemodelRoute.getBounds().width, this.__btnRemodelRoute.getBounds().height);

 		  		this.btn_delete.setUserBounds(
 		  			this.__mainContainer.getBounds().width - 110, 190,
 		  			this.btn_delete.getBounds().width, this.btn_delete.getBounds().height);

 		  	}
 		  	if (this.__routeTabsView != null) {
 		  		this.__routeTabsView.setWidth(this.__mainContainer.getBounds().width
 		  			- this.__routeTabsView.getBounds().left - 10);
 		  		this.__routeTabsView.setHeight(this.__mainContainer.getBounds().height
 		  			- this.__routeTabsView.getBounds().top - 10);
 		  	}
 		  },

 		/**
 		 * Обработчик нажатия на кнопку редактирования основной информации маршрута.
 		 * @param e {qx.event.type.Event} Объект события.
 		 */
 		 __onClickBtnEdit : function(e) {
 		 	var routeModel = this.__presenter.getDataStorage().getSelectedRoute();
 		 	if(routeModel == null)
 		 		return;
 		 	var editRouteForm = new bus.admin.mvp.view.routes.CURouteForm(this.__presenter,true, routeModel);
 		 	editRouteForm.open();

 		 },

 		/**
 		 * Обработчик нажатия на кнопку создания нового маршрута.
 		 * @param e {qx.event.type.Event} Объект события.
 		 */
 		 _onClickBtnNew : function(e) {
 		 	var dataStorage = this.__presenter.getDataStorage();
 		 	var cityID = this.__presenter.getDataStorage();
 		 	var routeModel = new bus.admin.mvp.model.RouteModel();
 		 	routeModel.setCityID(dataStorage.getSelectedCityID());
 		 	routeModel.setRouteTypeID(dataStorage.getSelectedRouteTypeID());
 		 	
 		 	var newRouteForm = new bus.admin.mvp.view.routes.CURouteForm( this.__presenter, false,	routeModel);
 		 	newRouteForm.open();
 		 },

 		/**
 		 * Обработчик нажатия на кнопку "Save" для сохранения изменений, полученны в результате конструирования марщрута.
 		 * @param e {qx.event.type.Event} Объект события.
 		 */
 		 __onClickBtnSave : function(e) {
 		 	var self = this;
 		 	qx.core.Init.getApplication().setWaitingWindow(true);
 		 	var callback = function(args){
 		 		qx.core.Init.getApplication().setWaitingWindow(false);
 		 		if(args.error == true){
 		 			bus.admin.widget.MsgDlg.error(self.tr("Error"), self.tr("Can not save route. Please, check input data and try again."));
 		 			return;
 		 		}
 		 	};
 		 	this.__presenter.finishingMakeRouteTrigger(true, callback, this);

 		 },

 		/**
 		 * Обработчик нажатия на кнопку "Move" для конструирования марщрута.
 		 * @param e {qx.event.type.Event} Объект события.
 		 */
 		 __onBtnRemodelRoute : function(e) {
 		 	var self = this;
 		 	var routeModel = this.__presenter.getDataStorage().getSelectedRoute();
 		 	if (routeModel == undefined)
 		 		return;

 		 	var callback = function(args){
 		 		if(args.error == true){
 		 			bus.admin.widget.MsgDlg.error(self.tr("Error"), self.tr("Can not remodel route. Please, try again."));
 		 			return;
 		 		}
 		 	}
 		 	this.__presenter.startingMakeRouteTrigger(routeModel.clone(), callback);
 		 },


 		/**
 		 * Обработчик нажатия на кнопку "Cancel" для завершения процесса конструирования марщрута без сохранения изменений.
 		 * @param e {qx.event.type.Event} Объект события.
 		 */
 		 __onBtnСancel : function(e) {
 		 	this.__presenter.finishingMakeRouteTrigger(false);
 		 },

		/**
		 * Возвращает номер строки в таблице, которая соотетствует маршрута с идентификатором, равным id
		 * @param  id {Integer}  ID маршрута
		 * @return {Integer}    Номер строки
		 */
		 _getTableRowIndexByRouteID : function(id) {
		 	var tableModel = this.__tableRoutes.getTableModel();
		 	for (var i = 0; i < tableModel.getRowCount(); i++) {
		 		var rowData = tableModel.getRowDataAsMap(i);
		 		if (rowData.ID == id) {
		 			return i;
		 		}
		 	}
		 	return -1;
		 },


//*******************************************************************************************************

















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
			var tableModel = this.__tableRoutes.getTableModel();
			tableModel.setValue(0, row, route.id);
			tableModel.setValue(1, row, fullName);
			tableModel.setValue(2, row, route.cost);
		}
	}
	if (opts.isUpdateRouteRelations == true) {
		if (this.__radioDirect.getValue() == true) {
			this.__onRadioDirect();
		} else {
			this.__onRadioReverse();
		}
		this.setStatusForWidgets(this._routesPage.getStatus());
	}
},

on_insertRoute : function(e) {
	var data = e.getData();
	this.debug("RoutesTabPage: on_insertRoute()1");
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

	var tableModel = this.__tableRoutes.getTableModel();
	tableModel.setRows([[route.id, name_number, route.cost]],
		tableModel.getRowCount());
	this.debug("RoutesTabPage: on_insertRoute(). ok.");
},

on_removeRoute : function(e) {
	var data = e.getData();
	if (data == null || data.error == true) {
		this.debug("on_removeRoute() : event data has errors");
		return;
	}
	var row = this.getRouteTableRowByID(data.routeID);
	if (row >= 0) {
		this.__tableRoutes.getTableModel().removeRows(row, 1);
		this.setStatusForWidgets(this._routesPage.getStatus());
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
		 	console.debug(routeModel);
		 	if (routeModel.reverseRouteWay == null) {
		 		this.__radioReverse.setEnabled(false);
		 	} else {
		 		this.__radioReverse.setEnabled(true);
		 	}
		 	if (this.__radioDirect.getValue() == true) {
		 		this.__onRadioDirect();
		 	} else {
		 		this.__radioDirect.setValue(true);
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
		 	this.debug("RoutesTabPage: on_finishCreateNewRoute()");
		 	var data = e.getData();
		 	if (data == null || (data.error == true && data.isOK == true)) {
		 		return;
		 	}

		 	this.setStatusForWidgets(this._routesPage.getStatus());
		 },



		 on_btn_import : function(e){
		 	var p = this._routesPage.getPresenter();
		 	var routeType = this._routesLeftPanel.getRouteType();
		 	var city = this._routesPage.getCurrentCityModel();
		 	var importForm = new bus.admin.mvp.view.routes.ImportRouteForm(p,routeType,city);
		 	importForm.open();
		 },




		 on_btn_delete : function(e) {

		 	var row = this.__tableRoutes.getSelectionModel()
		 	.getAnchorSelectionIndex();
		 	if (row < 0)
		 		return;
		 	var rowData = this.__tableRoutes.getTableModel()
		 	.getRowDataAsMap(row);
		 	var T = this;
		 	if (confirm(this
		 		.tr('Are you shue that want to delete selected route?'))) {
		 		qx.core.Init.getApplication().setWaitingWindow(true);
		 	var event_finish_func = qx.lang.Function.bind(function(data) {
		 		qx.core.Init.getApplication()
		 		.setWaitingWindow(false);
		 	}, T);

		 	T._routesPage.getPresenter().removeRoute(rowData.ID,
		 		event_finish_func);
		 } else {
		 }

		},

		isValidNewRoute : function(route) {
			this.debug(route);
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
			this.debug(routeModel);
		}





	}

});