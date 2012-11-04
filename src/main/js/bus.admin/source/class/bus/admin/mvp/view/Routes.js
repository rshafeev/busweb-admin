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

qx.Class.define("bus.admin.mvp.view.Routes", {
			extend : bus.admin.mvp.view.AbstractPage,

			construct : function() {
				this.base(arguments);
				this._is_initialized = false;
				this
						.setPresenter(new bus.admin.mvp.presenter.RoutesPresenter(this));
				this.__initWidgets();

				this.addListener("appear", this.on_appear, this);
			},
			properties : {
				routeLeftPanel : {
					nullable : true
				},
				routeMap : {
					nullable : true
				},
				routeModel : {
					nullable : true
				},
				currRouteModel : {
					nullable : true
				}
			},
			members : {
				_is_initialized : null,
				isAppearOnce : false,
				initialize : function() {

					this.setData();
				},
				__initWidgets : function() {
					this.setLayout(new qx.ui.layout.Dock());

					// Create widgets
					var routeMap = new bus.admin.mvp.view.routes.RouteMap(this);
					var leftPanel = new bus.admin.mvp.view.routes.RouteLeftPanel(this);
					this.setRouteMap(routeMap);
					this.setRouteLeftPanel(leftPanel);

					// Create split
					var splitpane = new qx.ui.splitpane.Pane("horizontal");
					splitpane.add(this.getRouteLeftPanel(), 0);
					splitpane.add(this.getRouteMap(), 1)
					this.add(splitpane, {
								edge : "center"
							});

				},

				__initChilds : function() {
					var map = this.getRouteMap();
					var leftPanel = this.getRouteLeftPanel();
					map.initialize();
					leftPanel.initialize();

				},
				__unInitChilds : function() {
					var map = this.getRouteMap();
					var leftPanel = this.getRouteLeftPanel();

					leftPanel.unInitialize();

				},
				on_appear : function(e) {

					var visible = this.isVisible();
					this.debug("on_appear");
					this.debug(visible);
					this.debug(this._is_initialized);
					if (!visible) {
						this.__unInitChilds();
					}
					if (visible == true && this._is_initialized == true) {
						this.setData();

					}
					this._is_initialized = true;

				},

				refreshRoutes : function(city_id) {
					this.setCurrRouteModel(null);
					this.setRouteModel(null);
					this.__unInitChilds();
					this._showWaitWindow(true);

					var loadRoutes_finish_func = qx.lang.Function.bind(
							function(data) {
								this.debug("refreshRoutes finished!");
								this._showWaitWindow(false);
								this.__initChilds();
								if (this._is_initialized == false) {
									this.fireEvent("init_finished");
								}
							}, this);

					var route_type_id = this.getRouteLeftPanel().getRouteType();
					if (city_id == null || route_type_id == null) {
						return;
					}
					this.getPresenter().loadRoutesList(city_id, route_type_id,
							loadRoutes_finish_func);
				},

				_showWaitWindow : function(isShow) {
					var visible = this.isVisible();
					if (visible) {
						qx.core.Init.getApplication().setWaitingWindow(isShow);
					}
				},

				_refresh_cities : function() {
					this.__unInitChilds();
					this._showWaitWindow(true);
					var loadCities_finish_func = qx.lang.Function.bind(
							function(data) {
								this._showWaitWindow(false);
								if (data == null || data.error == true) {
									this.debug("_refresh_cities() : e"
											+ "vent data has errors");
									return;
								}
								if (data.models.cities.length <= 0)
									return;
								this.__initChilds();
								this.refreshRoutes(data.models.cities[0].id);

							}, this);

					qx.core.Init.getApplication().getPresenter()
							.refreshCities(loadCities_finish_func);
				},

				setData : function() {
					this._refresh_cities();
				}

			}
		});
