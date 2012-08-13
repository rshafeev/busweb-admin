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

qx.Class.define("bus.admin.pages.Cities", {
	extend : bus.admin.pages.AbstractPage,

	construct : function() {
		this.base(arguments);
		this.initWidgets();
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
		initWidgets : function() {
			this.setLayout(new qx.ui.layout.Dock());
			// Create left-panel

			// Create map widget
			this.setCityMap(new bus.admin.pages.cities.CityMap(this));
			this.setCityLeftPanel(new bus.admin.pages.cities.CityLeftPanel(this
							.getCityMap()));
			// Create split
			var splitpane = new qx.ui.splitpane.Pane("horizontal");
			splitpane.add(this.getCityLeftPanel(), 0);
			splitpane.add(this.getCityMap(), 1)
			this.add(splitpane, {
						edge : "center"
					});
			this.getCityLeftPanel().addListenerOnce("received_all_responces", function() {
						this.__showApplication();
					}, this);
			this.getCityLeftPanel().initialize();

		},

		__showApplication : function() {
			if (qx.core.Init.getApplication().getRoot().isVisible() == false) {
				qx.core.Init.getApplication().getRoot()
						.setVisibility("visible");
			}
		}

	}
});
