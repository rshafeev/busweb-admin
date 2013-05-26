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
 #asset(qx/icon/${qx.icontheme}/16/apps/utilities-terminal.png)
 #asset(qx/icon/${qx.icontheme}/32/apps/utilities-terminal.png)
 #asset(qx/icon/${qx.icontheme}/16/apps/utilities-notes.png)
 #asset(qx/icon/${qx.icontheme}/16/apps/utilities-calculator.png)
 #asset(qx/icon/${qx.icontheme}/16/apps/utilities-help.png)
 */

/**
 * Левая боковая панель страницы "Routes"
 */
 qx.Class.define("bus.admin.mvp.view.routes.RoutesLeftPanel", {
 	extend : qx.ui.container.Composite,

 	/**
     * @param  presenter   {bus.admin.mvp.presenter.RoutesPresenter}  Presenter   
     */
     construct : function(presenter) {
     	this.__presenter = presenter;
     	this.base(arguments);
     	this.setLayout(new qx.ui.layout.Canvas());
     	this.setWidth(510);
     	this.setMinWidth(300);
     	this.setAppearance("left-panel");
     	this.__initWidgets();
     	presenter.addListener("refresh", this.__onRefresh, this);
     	presenter.addListener("change_state", this.__onChangeState, this);
     	
     },

     members : {

  		/**
 		 * Presenter представления
 		 * @type {bus.admin.mvp.presenter.RoutesPresenter}
 		 */
 		 __presenter : null,

 		/**
 		 *  выпадающий список типов маршрута
 		 * @type {qx.ui.form.SelectBox}
 		 */
 		 __comboRouteTypes : null,


 		/**
 		 *  выпадающий список городов
 		 * @type {qx.ui.form.SelectBox}
 		 */
 		 __comboCities : null,


 		 _routesTabPage : null,


 		 /**
 		  * Контейнер закладок.
 		  * @type {qx.ui.tabview.TabView}
 		  */
 		  __tabsView : null,

 		  /**
 		   * Кнопка обновления данных на странице.
 		   * @type {qx.ui.form.Button}
 		   */
 		   __btnRefresh : null,

 		/**
 		 * Создает виджеты панели
 		 */
 		 __initWidgets : function() {
 		 	this.__createComboCities();
 		 	this.__createComboRouteTypes();
 		 	this.__createTabView();
 		 	this.__btnRefresh = new qx.ui.form.Button("",
 		 		"bus/admin/images/btn/view-refresh.png");
 		 	this.__btnRefresh.setWidth(35);
 		 	this.addListener("resize", this.__onResize, this);
 		 	this.addListenerOnce("appear", this.__onResize, this);
 		 	this.debug("RouteLeftPanel was initialized");
 		 },

		/**
		 * Создает выпадающий список городов.
		 */
		 __createComboCities : function(){
		 	var labelCity = new qx.ui.basic.Label("City:");
		 	this.__comboCities = new qx.ui.form.SelectBox();
		 	this.__comboCities.setHeight(25);
		 	this.__comboCities.setWidth(170);
		 	this.add(labelCity, {
		 		left : 10,
		 		top : 10
		 	});
		 	this.add(this.__comboCities, {
		 		left : 40,
		 		top : 10
		 	});
		 },

		/**
		 * Создает выпадающий список выбора типа маршрутов.
		 */
		 __createComboRouteTypes : function() {
		 	this.__comboRouteTypes = new qx.ui.form.SelectBox();
		 	this.__comboRouteTypes.setHeight(25);
		 	this.__comboRouteTypes.setWidth(170);
		 	this.add(this.__comboRouteTypes, {
		 		left : 220,
		 		top : 10
		 	});
		 },

		/**
		 * Выбирает определенный тип маршрута в  выпадающем списке 
		 * @param  routeTypeID {String} Тип маршрутов.
		 */
		 __selectComboRouteItem :function(routeTypeID){
		 	this.__comboRouteTypes.removeListener("changeSelection", this.__onChangeComboRouteTypes, this);
		 	var items = this.__comboRouteTypes.getChildren();
		 	for (var i = 0; i < items.length; i++) {
		 		if (routeTypeID == items[i].getUserData("routeTypeID")){
		 			this.__comboRouteTypes.setSelection([ items[i] ]);
		 			break;
		 		}
		 	}
		 	this.__comboRouteTypes.addListener("changeSelection", this.__onChangeComboRouteTypes, this);
		 },


		/**
		 * Заполняет выпадающий список типов маршрута.
		 * @param  routeTypes          {Object[]} Типы маршрутов.
		 * @param  selectedRouteTypeID {String} Выбранный тип маршрутов
		 */
		 __fillComboRouteTypes : function(routeTypes, selectedRouteTypeID){
		 	this.__comboRouteTypes.removeListener("changeSelection", this.__onChangeComboRouteTypes, this);
		 	var selectedItem = null;
		 	this.__comboRouteTypes.removeAll();
		 	for (var i = 0; i < routeTypes.length; i++) {
		 		var id = routeTypes[i].id;
		 		var text = routeTypes[i].name;
		 		var item = new qx.ui.form.ListItem(text);
		 		item.setUserData("routeTypeID", routeTypes[i].id);
		 		this.__comboRouteTypes.add(item);
		 		if(id == selectedRouteTypeID){
		 			selectedItem = item;
		 		}
		 	}
		 	if(selectedItem != undefined){
		 		this.__comboRouteTypes.setSelection([ selectedItem ]);
		 	}
		 	this.__comboRouteTypes.addListener("changeSelection", this.__onChangeComboRouteTypes, this);
		 },

		/**
		 * Заполняет выпадающий список городов.
		 * @param  citiesModel  {bus.admin.mvp.model.CitiesModel} Города.
		 * @param  selectedCityID {Integer} ID выбранного города.
		 */
		 __fillComboCities : function(citiesModel, selectedCityID) {
		 	this.debug("execute __fillComboCities()");
		 	this.__comboCities.removeListener("changeSelection", this.__onChangeComboCities, this);
		 	this.__comboCities.removeAll();
		 	var selectedItem = null;
		 	var locale = qx.core.Init.getApplication().getDataStorage().getLocale();
		 	var cities = citiesModel.getAllCities();
		 	for (var i = 0; i < cities.length; i++) {
		 		var item = new qx.ui.form.ListItem( cities[i].getName(locale));
		 		item.setUserData("cityID", cities[i].getId());
		 		this.__comboCities.add(item);
		 		if(cities[i].getId() == selectedCityID){
		 			selectedItem = item;
		 		}
		 	}
		 	if(selectedItem != undefined){
		 		this.__comboCities.setSelection([ selectedItem ]);
		 	}
		 	this.__comboCities.addListener("changeSelection", this.__onChangeComboCities, this);

		 },

		/**
		 * Создает контейнер вкладок и сами вкладки. 
		 */
		 __createTabView : function() {
		 	this.__tabsView = new qx.ui.tabview.TabView();
		 	this._routesTabPage = new bus.admin.mvp.view.routes.tabs.RoutesTabPage(this.__presenter);
		 	this.__tabsView.add(this._routesTabPage);
		 	this.add(this.__tabsView, {
		 		left : 10,
		 		top : 40
		 	});
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
		  		this.__comboRouteTypes.setEnabled(true);
		  		this.__comboCities.setEnabled(true);
		  	} 
		  	if(state == "make"){
		  		this.__comboRouteTypes.setEnabled(false);
		  		this.__comboCities.setEnabled(false);
		  	}

		  },

		/**
		 * Обработчик события {@link bus.admin.mvp.presenter.RoutesPresenter#refresh refresh}
		 * @param  e {qx.event.type.Data} Данные события. Структуру свойств смотрите в описании события.
		 */
		 __onRefresh : function(e) {
		 	this.debug("execute _onRefresh() event handler");
		 	var data = this.__presenter.getDataStorage();
		 	var selectedCityID = data.getSelectedCityID();
		 	var selectedRouteTypeID = data.getSelectedRouteTypeID();
		 	
		 	this.__fillComboCities(e.getData().cities, selectedCityID);
		 	this.__fillComboRouteTypes(e.getData().routeTypes, selectedRouteTypeID);
		 },

		 /**
		  * Обработчик события изменения выбранного элемента в выпадающем списке городов
		  * @param  e {qx.event.type.Data} Данные события.
		  */
		  __onChangeComboCities : function(e) {
		  	this.debug("execute __onChangeComboCities()");

		  	var selections = this.__comboCities.getSelection();
		  	if (selections == null || selections == []
		  		|| selections.length <= 0) 
		  	{
		  		return;
		  	}
		  	var selectItem = selections[0];
		  	if (selectItem == null)
		  		return;

		  	var cityID = selectItem.getUserData("cityID");
		  	var routeTypeID = this.__presenter.getDataStorage().getSelectedRouteTypeID();
		  	qx.core.Init.getApplication().setWaitingWindow(true);
		  	var callback = qx.lang.Function.bind(function(data) {
		  		qx.core.Init.getApplication().setWaitingWindow(false);
		  		if (data.error == true) {
		  			var msg = data.errorInfo != undefined ? this.tr("Error! ") + data.errorInfo : 
		  			this.tr("Error! Can not load routes list. Please, refresh page.");
		  			bus.admin.widget.MsgDlg.error(msg);
		  			return;
		  		}
		  	}, this);
		  	this.__presenter.loadRoutesListTrigger(cityID, routeTypeID, callback, this);
		  	this.__presenter.selectCityTrigger(cityID, true);
		  	this.__comboCities.close();	

		  },

		 /**
		  * Обработчик события изменения выбранного элемента в выпадающем списке типов маршрута(bus, metro, ...)
		  * @param  e {qx.event.type.Data} Данные события.
		  */
		  __onChangeComboRouteTypes : function(e) {
		  	this.debug("execute __onChangeComboRouteTypes");
		  	var selections = this.__comboRouteTypes.getSelection();
		  	if (selections == null || selections == []
		  		|| selections.length <= 0) 
		  	{
		  		return;
		  	}
		  	var selectItem = selections[0];
		  	if (selectItem == null)
		  		return;

		  	var cityID = this.__presenter.getDataStorage().getSelectedCityID();
		  	var routeTypeID = selectItem.getUserData("routeTypeID") ;
		  	qx.core.Init.getApplication().setWaitingWindow(true);
		  	var callback = qx.lang.Function.bind(function(data) {
		  		qx.core.Init.getApplication().setWaitingWindow(false);
		  		if (data.error == true) {
		  			var msg = data.errorInfo != undefined ? this.tr("Error! ") + data.errorInfo : 
		  			this.tr("Error! Can not load routes list. Please, refresh page.");
		  			bus.admin.widget.MsgDlg.error(msg);
		  			return;
		  		}
		  	}, this);
		  	this.__presenter.loadRoutesListTrigger(cityID, routeTypeID, callback, this);
		  	this.__comboRouteTypes.close();	
		  },

 		/**
 		 * Обработчик события вызывается при изменении размеров панели.
 		 */
 		 __onResize : function() {
 		 	if (this.__tabsView != undefined) {
 		 		this.__tabsView.setWidth(this.getBounds().width
 		 			- this.__tabsView.getBounds().left - 10);
 		 		this.__tabsView.setHeight(this.getBounds().height
 		 			- this.__tabsView.getBounds().top - 10);
 		 	}
 		 }

 		}
 	});