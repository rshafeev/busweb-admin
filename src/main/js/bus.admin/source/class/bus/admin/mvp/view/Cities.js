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
 * Страница "Cities".
 */
 qx.Class.define("bus.admin.mvp.view.Cities", {
 	extend : bus.admin.mvp.view.AbstractPage,

 	construct : function() {
 		this.base(arguments);
 		var presenter = new bus.admin.mvp.presenter.CitiesPresenter(); 
 		this.setPresenter(presenter);
 		this.__initWidgets();

 	},
 	properties : {
 		/**
 		 * Левая панель страницы
 		 * @type {bus.admin.mvp.view.cities.CityLeftPanel}
 		 */
 		cityLeftPanel : {
 			nullable : true
 		},

 		/**
 		 * Виджет карты
 		 * @type {bus.admin.mvp.view.cities.CityMap}
 		 */
 		cityMap : {
 			nullable : true
 		}
 	},
 	members : {
 		
 		/**
 		 * Функция инициализации страницы
 		 */
 		initialize : function() {
 			var self = this;
 			self.debug("initialize() CitiesPage");
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
			var cityMap = new bus.admin.mvp.view.cities.CityMap(this.getPresenter());
			var leftPanel = new bus.admin.mvp.view.cities.CityLeftPanel(this.getPresenter());
			this.setCityMap(cityMap);
			this.setCityLeftPanel(leftPanel);

			// Create split
			var splitpane = new qx.ui.splitpane.Pane("horizontal");
			splitpane.add(this.getCityLeftPanel(), 0);
			splitpane.add(this.getCityMap(), 1)
			this.add(splitpane, {
				edge : "center"
			});

		}

	}
});
