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
 * Страница "Stations"
 */
 qx.Class.define("bus.admin.mvp.view.Stations", {
 	extend : bus.admin.mvp.view.AbstractPage,

 	construct : function() {
 		this.base(arguments);
 		this.setPresenter(new bus.admin.mvp.presenter.StationsPresenter());
 		this.__initWidgets();
 	},
 	properties : {
 		/**
 		 * Левая панель страницы
 		 * @type {bus.admin.mvp.view.stations.StationsLeftPanel}
 		 */
 		stationsLeftPanel : {
 			nullable : true
 		},

  		/**
 		 * Виджет карты
 		 * @type {bus.admin.mvp.view.stations.StationsMap}
 		 */		
 		stationsMap : {
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

			// Create widgets
			var stationsMap = new bus.admin.mvp.view.stations.StationsMap(this.getPresenter());
			var leftPanel = new bus.admin.mvp.view.stations.StationsLeftPanel(this.getPresenter());
			this.setStationsMap(stationsMap);
			this.setStationsLeftPanel(leftPanel);

			// Create split
			var splitpane = new qx.ui.splitpane.Pane("horizontal");
			splitpane.add(this.getStationsLeftPanel(), 0);
			splitpane.add(this.getStationsMap(), 1)
			this.add(splitpane, {
				edge : "center"
			});

		}




	}
});