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
		this.isAppearOnce = false;
		this.setPresenter(new bus.admin.mvp.presenter.StationsPresenter());
		this.setStationsModel(new bus.admin.mvp.model.StationsModel());
		this.__initWidgets();

		this.addListener("appear", this.on_appear, this);
	},
	properties : {
		stationsLeftPanel : {
			nullable : true
		},
		stationsMap : {
			nullable : true
		},
		stationsModel : {
			nullable : true
		}
	},
	members : {
		isAppearOnce : null,
		initialize : function() {
			this.debug("initialize()");
			var refreshCities_finish_func = qx.lang.Function.bind(
					function(data) {
						this.refresh_stations();
						//this.fireEvent("init_finished");
					}, this);
			qx.core.Init.getApplication().getPresenter()
					.refreshCities(refreshCities_finish_func);

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
			this.fireEvent("init_finished");
		},

		on_appear : function(e) {
			this.debug("on_appear()");
			// isAppearOnce - если загрузка страницы выполняется впервые, то не
			// нужно выполнять refresh данных
			if (this.isVisible() && this.isAppearOnce == true) {
				//this.refresh_stations();
			} else {
				this.isAppearOnce = true;
			}
		},

		refresh_stations : function() {
			this.debug("refresh_stations()");
			this.debug(this.isAppearOnce);
			var visible = this.isVisible();
			if (visible && this.isAppearOnce == true) {
				qx.core.Init.getApplication().setWaitingWindow(true);
			}
			var loadStations_finish_func = qx.lang.Function.bind(
					function(data) {

						if (visible && this.isAppearOnce == true) {
							qx.core.Init.getApplication()
									.setWaitingWindow(false);
						} else if (this.isAppearOnce == false) {
							this.__setOptions();
						}
					}, this);
			var city_id = this.getStationsLeftPanel().getSelectableCityID();
			var transport_type_id = this.getStationsLeftPanel()
					.getTransportType();
			this.getPresenter().loadStations(city_id, transport_type_id,
					loadStations_finish_func);

		}

	}
});