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
 * Страница "Routes"
 */
 qx.Class.define("bus.admin.mvp.view.Routes", {
 	extend : bus.admin.mvp.view.AbstractPage,

 	construct : function() {
 		this.base(arguments);
 		var presenter = new bus.admin.mvp.presenter.RoutesPresenter();
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
 		 	this.debug("initialize()");
 		 	var self = this;
 		 	var callback =	function(data) {
 		 		self.fireEvent("init_finished");
 		 	};
 		 	self.getPresenter().refreshTrigger(callback);		
 		 },

 		/**
 		 * Создает виджеты на странице
 		 */
 		 __initWidgets : function() {
 		 	this.setLayout(new qx.ui.layout.Dock());
 		 	var routeMap = new bus.admin.mvp.view.routes.RoutesMap(this.getPresenter());
 		 	var leftPanel = new bus.admin.mvp.view.routes.RoutesLeftPanel(this.getPresenter());
 		 	this.setRouteMap(routeMap);
 		 	this.setRouteLeftPanel(leftPanel);

 		 	var splitpane = new qx.ui.splitpane.Pane("horizontal");
 		 	splitpane.add(this.getRouteLeftPanel(), 0);
 		 	splitpane.add(this.getRouteMap(), 1)
 		 	this.add(splitpane, {
 		 		edge : "center"
 		 	});

 		 }
 		 
 		}
 	});
