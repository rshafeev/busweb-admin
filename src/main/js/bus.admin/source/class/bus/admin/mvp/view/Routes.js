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

/*
 * #asset(qx/icon/${qx.icontheme}/32/status/dialog-information.png)
 */

/**
 * Страница "Routes"
 */
 qx.Class.define("bus.admin.mvp.view.Routes", {
 	extend : bus.admin.mvp.view.AbstractPage,

 	construct : function() {
 		this.base(arguments);
 		this._is_initialized = false;
 		var presenter = new bus.admin.mvp.presenter.RoutesPresenter()
 		this.setPresenter(presenter);
 		this.__initWidgets();

 	},
 	properties : {
 		/**
 		 * Левая панель страницы
 		 * @type {bus.admin.mvp.view.routes.RoutesLeftPanel}
 		 */				
 		 routeLeftPanel : {
 		 	nullable : true
 		 },

  		/**
 		 * Виджет карты
 		 * @type {bus.admin.mvp.view.routes.RoutesMap}
 		 */		
 		 routeMap : {
 		 	nullable : true
 		 }

 		},
 		members : {

 		/**
 		 * Функция инициализации страницы
 		 */
 		 initialize : function() {

 		 },

 		/**
 		 * Создает виджеты на странице
 		 */
 		 __initWidgets : function() {
 		 	this.setLayout(new qx.ui.layout.Dock());

 		 	var routeMap = new bus.admin.mvp.view.routes.RouteMap(this);
 		 	var leftPanel = new bus.admin.mvp.view.routes.RouteLeftPanel(this);
 		 	this.setRouteMap(routeMap);
 		 	this.setRouteLeftPanel(leftPanel);

 		 	var splitpane = new qx.ui.splitpane.Pane("horizontal");
 		 	splitpane.add(this.getRouteLeftPanel(), 0);
 		 	splitpane.add(this.getRouteMap(), 1)
 		 	this.add(splitpane, {
 		 		edge : "center"
 		 	});

 		 },


 		 refreshRoutes : function(city_id) {
 		 	this.setCurrRouteModel(null);
 		 	this.setRouteModel(null);
 		 	this.__unInitChilds();
 		 	this._showWaitWindow(true);

 		 	var loadRoutes_finish_func = qx.lang.Function.bind(
 		 		function(data) {
 		 			this.debug("refreshRoutes finished!");
 		 			this._showWaitWindow(false);
 		 			this.__initChilds();
 		 			if (this._is_initialized == false) {
 		 				this.fireEvent("init_finished");
 		 			}
 		 		}, this);

 		 	var route_type_id = null;
 		 	if (this.getRouteLeftPanel().getRouteType() != null) {
 		 		route_type_id = this.getRouteLeftPanel().getRouteType().id;
 		 	}
 		 	if (city_id == null || route_type_id == null) {
 		 		return;
 		 	}
 		 	this.getPresenter().loadRoutesList(city_id, route_type_id,
 		 		loadRoutes_finish_func);
 		 },



 		 _refresh_cities : function() {
 		 	this.__unInitChilds();
 		 	var loadCities_finish_func = qx.lang.Function.bind(
 		 		function(data) {
 		 			if (data == null || data.error == true) {
 		 				this.debug("_refresh_cities() : e"
 		 					+ "vent data has errors");
 		 				return;
 		 			}
 		 			if (data.models.cities.length <= 0)
 		 				return;
 		 			this.__initChilds();
 		 			this.refreshRoutes(data.models.cities[0].id);

 		 		}, this);

 		 	this.getPresenter()
 		 	.refreshCities(loadCities_finish_func);
 		 }
 		 
 		}
 	});
