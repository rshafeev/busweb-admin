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
						.setPresenter(new bus.admin.mvp.presenter.RoutesPresenter());
				this.__initWidgets();

				this.addListener("appear", this.on_appear, this);
			},
			properties : {
				routeLeftPanel : {
					nullable : true
				},
				routeMap : {
					nullable : true
				}
			},
			members : {
				_is_initialized : null,
				initialize : function() {

					var event_finish_func = qx.lang.Function.bind(
							function(data) {
								this.refresh();

								this.fireEvent("init_finished");
							}, this);

					qx.core.Init.getApplication().getPresenter()
							.refreshCities(event_finish_func);
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

				__setOptions : function() {
					var map = this.getRouteMap();
					var leftPanel = this.getRouteLeftPanel();
					map.initialize();
					leftPanel.initialize();

				},

				on_appear : function(e) {
					this.debug("on_appear()");
				},

				refresh : function() {
					this.debug("refresh routes");
					this.debug(this.isAppearOnce);
					var visible = this.isVisible();
					if (visible) {
						qx.core.Init.getApplication().setWaitingWindow(true);
					}

					var loadRoutes_finish_func = qx.lang.Function.bind(
							function(data) {

								if (visible) {
									qx.core.Init.getApplication()
											.setWaitingWindow(false);
								}
								if (this._is_initialized == false) {
									this._is_initialized = true;
									this.__setOptions();
								}

							}, this);

					var city_id = this.getRouteLeftPanel()
							.getSelectableCityID();
					var route_type_id = this.getRouteLeftPanel().getRouteType();
					this.debug(city_id);
					this.debug(route_type_id);
					if (city_id == null || route_type_id == null) {
						return;
					}
					this.getPresenter().loadRoutesList(city_id, route_type_id,
							loadRoutes_finish_func);

				}

			}
		});
