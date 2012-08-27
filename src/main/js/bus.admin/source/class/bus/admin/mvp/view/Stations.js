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

/*
 * #asset(qx/icon/${qx.icontheme}/32/status/dialog-information.png)
 */

/**
 * Demonstrates qx.ui.basic(...): Label, Image, Atom
 */

qx.Class.define("bus.admin.mvp.view.Stations", {
	extend : bus.admin.mvp.view.AbstractPage,

	construct : function() {
		this.base(arguments);
		this.__initWidgets();
		this.__setOptions();
		this.addListener("appear", this.on_appear, this);
	},
	properties : {
		stationsLeftPanel : {
			nullable : true
		},
		stationsMap : {
			nullable : true
		}
	},
	members : {

		initialize : function() {
			var refreshCities_finish_func = qx.lang.Function.bind(
					function(data) {

						this.fireEvent("init_finished");
					}, this);
			this.getPresenter().refreshCities(refreshCities_finish_func);

		},
		__initWidgets : function() {
			this.setLayout(new qx.ui.layout.Dock());

			// Create widgets
			var stationsMap = new bus.admin.mvp.view.stations.StationsMap(this);
			var leftPanel = new bus.admin.mvp.view.stations.StationsLeftPanel(this);
			this.setStationsMap(stationsMap);
			this.setStationsLeftPanel(leftPanel);

			// Create split
			var splitpane = new qx.ui.splitpane.Pane("horizontal");
			splitpane.add(this.getStationsLeftPanel(), 0);
			splitpane.add(this.getStationsMap(), 1)
			this.add(splitpane, {
						edge : "center"
					});

		},

		__setOptions : function() {
			var map = this.getStationsMap();
			var leftPanel = this.getStationsLeftPanel();
			map.initialize();
			leftPanel.initialize();
		},

		on_appear : function(e) {
			this.debug("on_appear()");
		}

	}
});