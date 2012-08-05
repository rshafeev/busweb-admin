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

	members : {
		__mapWidget : null,
		__leftPanel : null,
		initWidgets : function() {
			this.setLayout(new qx.ui.layout.Dock());
			// Create left-panel
			this. __leftPanel = new bus.admin.pages.cities.CityLeftPanel(this);
			// Create map widget
			this.__mapWidget = new bus.admin.pages.cities.CityMap(this);

			// Create split
			var splitpane = new qx.ui.splitpane.Pane("horizontal");
			splitpane.add(this. __leftPanel, 0);
			splitpane.add(this.__mapWidget, 1)
			this.add(splitpane, {
						edge : "center"
					});
		}

	}
});
