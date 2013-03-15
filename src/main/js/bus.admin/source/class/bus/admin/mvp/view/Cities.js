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
 		var presenter = new bus.admin.mvp.presenter.CitiesPresenter(); 
 		this.setPresenter(presenter);
 		this._createWidgets();

 	},
 	properties : {
 		cityLeftPanel : {
 			nullable : true
 		},
 		cityMap : {
 			nullable : true
 		}
 	},
 	members : {
 		initialize : function() {
 			var self = this;
 			self.debug("initialize() CitiesPage");
 			var callback =	function(data) {
 				self.fireEvent("init_finished");
 			};
 			self.getPresenter().refreshTrigger(callback);
 		},

 		_createWidgets : function() {
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
