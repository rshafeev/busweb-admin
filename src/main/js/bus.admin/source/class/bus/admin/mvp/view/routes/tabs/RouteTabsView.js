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
 * Набор вкладок для работы с данными выбранного маршрута. 
 * Является дочерним виджетом  вкладки "Routes" {@link bus.admin.mvp.view.routes.tabs.RoutesTabPage}
 */
 qx.Class.define("bus.admin.mvp.view.routes.tabs.RouteTabsView", {
 	extend : qx.ui.tabview.TabView,

 	/**
 	 * @param  presenter   {bus.admin.mvp.presenter.RoutesPresenter}  Presenter 
 	 */
 	 construct : function(presenter) {
 	 	this.base(arguments);
 	 	this.__presenter = presenter;
 	 	this.__initWidgets();
 	 	presenter.addListener("select_route", this.__onSelectRoute, this);
 	 	presenter.addListener("change_direction", this.__onChangeDirection, this);
 	 	presenter.addListener("change_state", this.__onChangeState, this);
 	 	presenter.addListener("update_way_relations", this.__onUpdateWayRelations, this);
 	 },

 	 members : {

  		/**
 		 * Presenter представления
 		 * @type {bus.admin.mvp.presenter.RoutesPresenter}
 		 */
 		 __presenter : null,


 		 /**
 		  * Радиокнопка выбора обратного пути.
 		  * @type {qx.ui.form.RadioButton}
 		  */
 		  __radioReverse : null,

 		 /**
 		  * Радиокнопка выбора прямого пути.
 		  * @type {qx.ui.form.RadioButton}
 		  */
 		  __radioDirect : null,


 		  __stationsTabPage : null,

 		  __stationsTable : null,
 		  
 		  __diRadioGroup : null,
 		  
 		  __btnDeleteStation : null,


 		  __btnTimetable : null,

		/**
		 * Обработчик события  {@link bus.admin.mvp.presenter.RoutesPresenter#update_way_relations update_way_relations} 
		 * вызывается при изменении пути.
		 * @param  e {qx.event.type.Data} Данные события. Структуру свойств смотрите в описании события.
		 */
		 __onUpdateWayRelations : function(e){
		 	this.debug("execute __onUpdateWayRelations() event handler.");
		 	var relation = e.getData().relation;
		 	var operation = e.getData().operation;
		 	var langID = qx.core.Init.getApplication().getDataStorage().getLocale();
		 	var index = relation.getIndex();
		 	var station = relation.getCurrStation();
		 	var rowsData = this.__stationsTable.getTableModel().getData();

		 	if(operation == "insert"){
		 		if(rowsData.length <= index)
		 			rowsData.push([station.getId(), station.getName(langID)]);
		 		else
		 			rowsData.splice(index, 0, [station.getId(), station.getName(langID)]);
		 		this.__stationsTable.getTableModel().setData(rowsData);
		 	}
		 	else
		 		if(operation == "update"){
		 			rowsData[index] = [station.getId(), station.getName(langID)];
		 			this.__stationsTable.getTableModel().setData(rowsData);		 		
		 		}
		 		else
		 			if(operation == "remove"){
		 				rowsData.splice(index, 1);
		 				this.__stationsTable.getTableModel().setData(rowsData);
		 			}

		 		},


		 /**
		 * Обработчик события  {@link bus.admin.mvp.presenter.RoutesPresenter#select_route select_route} вызывается при выборе 
		 * пользователем маршрута.
		 * @param  e {qx.event.type.Data} Данные события. Структуру свойств смотрите в описании события.
		 */
		 __onSelectRoute : function (e){
		 	this.debug("execute __onSelectRoute() event handler");
		 	var state = this.__presenter.getDataStorage().getState();
		 	var wayModel = this.__presenter.getDataStorage().getSelectedWay();
		 	this.__setState(state);
		 	if(wayModel != null){
		 		this.__fillStationsTable(wayModel);
		 	}

		 },

		 /**
		 * Обработчик события  {@link bus.admin.mvp.presenter.RoutesPresenter#change_direction change_direction} вызывается при изменении 
		 * направления пути.
		 * @param  e {qx.event.type.Data} Данные события. Структуру свойств смотрите в описании события.
		 */
		 __onChangeDirection: function (e){
		 	this.debug("execute __onChangeDirection() event handler");
		 	var state = this.__presenter.getDataStorage().getState();
		 	var wayModel = this.__presenter.getDataStorage().getSelectedWay();
		 	this.__setState(state);
		 	if(wayModel != null){
		 		this.__fillStationsTable(wayModel);
		 	}

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
		  			this.__radioDirect.setEnabled(false);
		  			this.__radioReverse.setEnabled(false);
		  			this.__btnTimetable.setEnabled(false);
		  			this.__btnDeleteStation.setEnabled(false);
		  			this.__stationsTable.getTableModel().setData([]);

		  		}else
		  		if(state == "none"){
		  			this.__radioDirect.setValue(true);
		  			this.__radioDirect.setEnabled(true);
		  			this.__radioReverse.setEnabled(true);
		  			this.__btnDeleteStation.setEnabled(false);
		  			this.__btnTimetable.setEnabled(true);
		  		}
		  	} 
		  	
		  	if(state == "make"){
		  		this.__btnDeleteStation.setEnabled(true);
		  		this.__btnTimetable.setEnabled(true);
		  		if(routeModel != undefined){
		  			if( routeModel.getDirectWay() != undefined){
		  				this.__radioDirect.setValue(true);
		  				this.__radioDirect.setEnabled(true);	
		  			}else
		  			{
		  				this.__radioDirect.setEnabled(false);	
		  			}
		  			if( routeModel.getReverseWay() != undefined){
		  				this.__radioReverse.setEnabled(true);	
		  			}else
		  			{
		  				this.__radioReverse.setEnabled(false);	
		  			}		  			

		  		}
		  	}

		  },


 		/**
 		 * Создает вкладки
 		 */
 		 __initWidgets : function() {

 		 	this.__stationsTabPage = new qx.ui.tabview.Page(this.tr("Stations"));
 		 	this.__stationsTabPage.setLayout(new qx.ui.layout.Canvas());
 		 	this.__stationsTabPage.setWidth(250);
 		 	this.__stationsTabPage.setHeight(200);

			// Создадим радиокнопки
			this.__diRadioGroup = new qx.ui.form.RadioButtonGroup();
			this.__radioDirect = new qx.ui.form.RadioButton(this.tr("Direct"));
			this.__radioReverse = new qx.ui.form.RadioButton(this.tr("Reverse"));
			this.__radioDirect.addListener("changeValue", this.__onRadioDirect,
				this);
			this.__radioReverse.addListener("changeValue", this.__onRadioReverse,
				this);
			this.__radioDirect.execute();
			this.__diRadioGroup.setLayout(new qx.ui.layout.VBox(5));
			this.__diRadioGroup.add(this.__radioDirect);
			this.__diRadioGroup.add(this.__radioReverse);
			this.__stationsTabPage.add(this.__diRadioGroup);

			// Создадим таблицу отображения станций
			this.__createStationsTable();
			
			// Создадим кнопку вызова диалогового окна редактирования расписания.
			this.__btnTimetable = new qx.ui.form.Button(this.tr("Timetable..."),
				"bus/admin/images/btn/go-bottom.png");
			this.__btnTimetable.setWidth(90);
			this.__btnTimetable.addListener("execute", this.__onClickBtnTimetable, this);
			this.__stationsTabPage.add(this.__btnTimetable);

			// Создадим кнопку удаления выбранной станции.
			this.__btnDeleteStation = new qx.ui.form.Button(this.tr("Delete"),
				"bus/admin/images/btn/edit-delete.png");
			this.__btnDeleteStation.setWidth(90);
			this.__btnDeleteStation.addListener("execute", this.__onClickBtnDeleteStation, this);
			this.__stationsTabPage.add(this.__btnDeleteStation);

			this.add(this.__stationsTabPage);
			this.addListener("resize", this.__onResize, this);
		},


		/**
		 * [__createStationsTable description]
		 */
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
			this.__stationsTable = stationsTable;
			this.__stationsTabPage.add(this.__stationsTable, {
				left : 5,
				top : 5
			});

		},

		

 		/**
 		 * Обработчик нажатия на радиокнопку "Direct".
 		 * @param e {qx.event.type.Event} Объект события.
 		 */
 		 __onRadioDirect : function(e) {
 		 	if(this.__radioDirect.getValue() == true)
 		 		this.__presenter.setDirectionTrigger(true);
 		 },

 		/**
 		 * Обработчик нажатия на радиокнопку "Reverse".
 		 * @param e {qx.event.type.Event} Объект события.
 		 */
 		 __onRadioReverse : function(e) {
 		 	if(this.__radioReverse.getValue() == true)
 		 		this.__presenter.setDirectionTrigger(false);
 		 },

 		 /**
 		  * Обработчик события изменения размеров текущего объекта.
 		  * @param e {qx.event.type.Event} Объект события.
 		  */
 		  __onResize : function(e) {
 		  	if (this.__stationsTable != null) {
 		  		this.__stationsTable.setWidth(this.getBounds().width
 		  			- this.__stationsTable.getBounds().left - 130);
 		  		this.__stationsTable.setHeight(this.getBounds().height
 		  			- this.__stationsTable.getBounds().top - 40);
 		  	}
 		  	if (this.__diRadioGroup != null) {
 		  		this.__diRadioGroup.setUserBounds(this.getBounds().width
 		  			- 120, 5,
 		  			this.__diRadioGroup.getBounds().width,
 		  			this.__diRadioGroup.getBounds().height);
 		  	}
 		  	this.__btnTimetable.setUserBounds(
 		  		this.getBounds().width - 120, 80,
 		  		this.__btnTimetable.getBounds().width, this.__btnTimetable.getBounds().height);
 		  	this.__btnDeleteStation.setUserBounds(this.getBounds().width- 120, 130,
 		  		this.__btnDeleteStation.getBounds().width,
 		  		this.__btnDeleteStation.getBounds().height);

 		  },

 		 /**
 		  * Вызывается при нажатии на кнопку удаления станции из пути.
 		  * @param  e {qx.event.type.Event} Объект события.
 		  */
 		  __onClickBtnDeleteStation : function(e) {
 		  	var selectedRow = this.__stationsTable.getSelectionModel().getAnchorSelectionIndex();
 		  	if (selectedRow < 0)
 		  		return;
 		  	var rowData = this.__stationsTable.getTableModel().getRowDataAsMap(selectedRow);
 		  	if(rowData != undefined && rowData.ID != undefined){
 		  		this.__presenter.excludeStationToRouteWayTrigger(rowData.ID);	
 		  	}
 		  },

 		 /**
 		  * Вызывается при нажатии на кнопку вызова окна редактирования расписания.
 		  * @param e {qx.event.type.Event} Объект события.
 		  */
 		  __onClickBtnTimetable : function(e) {
 		  	var routeWay = this.__presenter.getDataStorage().getSelectedWay();
 		  	if(routeWay != undefined){
 		  		var dlg = new bus.admin.mvp.view.routes.ScheduleForm(this.__presenter, routeWay);
 		  		dlg.open();
 		  	}
 		  },


		 /**
		  * Добавляет остановки в таблицу
		  * @param routeWayModel {bus.admin.mvp.model.route.RouteWayModel}  Модель пути
		  */
		  __fillStationsTable : function(routeWayModel) {
		  	this.debug("__fillStationsTable()");
		  	var relations = routeWayModel.getRelations();
		  	var langID = qx.core.Init.getApplication().getDataStorage().getLocale();
		  	var rowsData = [];
		  	if(relations != undefined){
		  		for (var i = 0; i < relations.length; i++) {
		  			var st = relations[i].getCurrStation();
		  			rowsData.push([st.getId(), st.getName(langID)]);
		  		}
		  	}
		  	this.__stationsTable.getTableModel().setData(rowsData);
		  }





		}

	});