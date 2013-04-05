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
     	this.__presenter.addListener("refresh", this.__onRefresh, this);

     	
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


 		 tabView : null,

 		 btn_refresh : null,

 		/**
 		 * Создает виджеты панели
 		 */
 		 __initWidgets : function() {
 		 	this.__createComboCities();
 		 	this.__createComboRouteTypes();
 		 	this.__createTabView();
 		 	this.btn_refresh = new qx.ui.form.Button("",
 		 		"bus/admin/images/btn/view-refresh.png");
 		 	this.btn_refresh.setWidth(35);
 		 	this.addListener("resize", this.on_resize_panel, this);
 		 	this.addListenerOnce("appear", this.on_resize_panel, this);
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
		 */
		 __fillComboCities : function(citiesModel, selectedCityID) {
		 	this.debug("execute __fillComboCities()");
		 	this.__comboCities.removeListener("changeSelection", this.__onChangeComboCities, this);
		 	this.__comboCities.removeAll();
		 	var selectedItem = null;
		 	var locale = bus.admin.AppProperties.getLocale();
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
		 	this.tabView = new qx.ui.tabview.TabView();
		 	this._routesTabPage = new bus.admin.mvp.view.routes.tabs.RoutesTabPage(this.__presenter);
		 	this.tabView.add(this._routesTabPage);
		 	this.add(this.tabView, {
		 		left : 10,
		 		top : 40
		 	});
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
		 * Обработчик вызывается при начале добавления нового маршрута
		 * @param e {Object} хранит    модель "Route"(еще не полностью заполненную)
		 */
		 on_startCreateNewRoute : function(e) {
		 	this.__comboCities.setEnabled(false);
		 	this.__comboRouteTypes.setEnabled(false);
		 	this._newTabPage.setEnabled(false);
		 	this._settingsTabPage.setEnabled(false);
		 },

		/**
		 * Обработчик вызывается при окончании процесса создания нового
		 * маршрута: он был отредактирован пользователем, отправлен на сервер и
		 * сохранен в БД.
		 * @param e {Object} хранит    модель "Route"
		 */
		 on_finishCreateNewRoute : function(e) {
		 	var data = e.getData();
		 	if (data == null || (data.error == true && data.isOK == true)) {
		 		return;
		 	}

		 	this.__comboCities.setEnabled(true);
		 	this.__comboRouteTypes.setEnabled(true);
		 	this._newTabPage.setEnabled(true);
		 	this._settingsTabPage.setEnabled(true);
		 },

		 on_resize_panel : function(e) {
		 	if (this.tabView) {
		 		this.tabView.setWidth(this.getBounds().width
		 			- this.tabView.getBounds().left - 10);
		 		this.tabView.setHeight(this.getBounds().height
		 			- this.tabView.getBounds().top - 10);
		 	}
		 },

		 on_refresh_cities : function(e) {
		 	var data = e.getData();
		 	if (data == null || data.error == true) {
		 		this.debug("on_refresh_cities() : event data has errors");
		 		return;
		 	}
		 	this.loadCitiesToComboBox(data.models.cities);
		 },

		 loadCitiesToComboBox : function(cities) {
		 	this.debug("on_loadCitiesToComboBox()");
		 	var defaultItem = null;
		 	var lang_id = "c_" + qx.locale.Manager.getInstance().getLocale();
		 	this.__comboCities.removeAll();
		 	for (var i = 0; i < cities.length; i++) {
		 		var name = bus.admin.mvp.model.helpers.CitiesModelHelper
		 		.getCityNameByLang(cities[i], lang_id);
		 		var item = new qx.ui.form.ListItem(name);
		 		item.setUserData("id", cities[i].id);
		 		if (defaultItem == null) {
		 			defaultItem = item;
		 		}

		 		this.__comboCities.add(item);
		 	}
		 	if (defaultItem != null) {
		 		this.__comboCities.setSelection([defaultItem]);
		 	}

		 },

		 getSelectableCityID : function() {
		 	var cityComboItem = bus.admin.helpers.WidgetHelper
		 	.getSelectionItemFromSelectBox(this.__comboCities);
		 	if (cityComboItem == null)
		 		return null;
		 	return cityComboItem.getUserData("id");
		 }





		}
	});