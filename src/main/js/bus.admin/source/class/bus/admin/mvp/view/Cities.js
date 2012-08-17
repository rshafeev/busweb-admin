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

				this.setCitiesModel(qx.core.Init.getApplication()
						.getModelsContainer().getCitiesModel());
				this.setLanguagesModel(qx.core.Init.getApplication()
						.getModelsContainer().getLangsModel());
				this.setPresenter(qx.core.Init.getApplication().getPresenter());

				this.__initWidgets();
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
				initialize : function() {
					this.getPresenter().addListenerOnce("refresh_cities",
							function(e) {
								this.fireEvent("init_finished");
							}, this);
					this.getPresenter().refreshCities();
				},
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

				__setOptions : function() {
					var cityMap = this.getCityMap();
					var leftPanel = this.getCityLeftPanel();
					cityMap.initialize();
					leftPanel.initialize();

				}

			}
		});
