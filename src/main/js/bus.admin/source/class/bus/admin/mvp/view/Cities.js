/*******************************************************************************
 * 
 * qooxdoo - the new era of web development
 * 
 * http://qooxdoo.org
 * 
 * Copyright: 2004-2010 1&1 Internet AG, Germany, http://www.1und1.de
 * 
 * License: LGPL: http://www.gnu.org/licenses/lgpl.html EPL:
 * http://www.eclipse.org/org/documents/epl-v10.php See the LICENSE file in the
 * project's top-level directory for details.
 * 
 * Authors: Tristan Koch (tristankoch)
 * 
 ******************************************************************************/

/*******************************************************************************
 * 
 * #asset(qx/icon/${qx.icontheme}/32/status/dialog-information.png)
 * 
 ******************************************************************************/

/**
 * Demonstrates qx.ui.basic(...):
 * 
 * Label, Image, Atom
 * 
 */

qx.Class.define("bus.admin.mvp.view.Cities", {
	extend : bus.admin.mvp.view.AbstractPage,

	construct : function() {
		this.base(arguments);
		this.__initWidgets();
		this.__initPresenter();
		this.__initModels();
		this.__setOptions();
	},
	properties : {
		citiesModel : {
			nullable : true
		},
		languagesModel : {
			nullable : true
		},
		cityLeftPanel : {
			nullable : true
		},
		cityMap : {
			nullable : true
		},
		presenter : {
			nullable : true
		}
	},
	members : {
		__initWidgets : function() {
			this.setLayout(new qx.ui.layout.Dock());

			// Create widgets
			var cityMap = new bus.admin.mvp.view.cities.CityMap(this);
			var leftPanel = new bus.admin.mvp.view.cities.CityLeftPanel(this);
			this.setCityMap(cityMap);
			this.setCityLeftPanel(leftPanel);

			// Create split
			var splitpane = new qx.ui.splitpane.Pane("horizontal");
			splitpane.add(this.getCityLeftPanel(), 0);
			splitpane.add(this.getCityMap(), 1)
			this.add(splitpane, {
						edge : "center"
					});

		},
		__initPresenter : function() {
			var citiesPresenter = new bus.admin.mvp.presenter.CitiesPresenter(this);
			this.setPresenter(citiesPresenter);

		},
		__initModels : function() {
			var citiesModel = new bus.admin.mvp.model.CitiesModel();
			var languagesModel = new bus.admin.mvp.model.LanguagesModel();
			this.setCitiesModel(citiesModel);
			this.setLanguagesModel(languagesModel);
		},
		showApplication : function() {
			if (qx.core.Init.getApplication().getRoot().isVisible() == false) {
				qx.core.Init.getApplication().getRoot()
						.setVisibility("visible");
			}
		},

		__setOptions : function() {
			var cityMap = this.getCityMap();
			var leftPanel = this.getCityLeftPanel();
			cityMap.initialize();
			leftPanel.initialize();
			this.getPresenter().refreshData();
			
		}
		
		

	}
});
