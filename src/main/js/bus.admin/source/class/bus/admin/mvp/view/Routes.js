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
				this.__initWidgets();
				this.__setOptions();
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

				initialize : function() {
					var event_finish_func = qx.lang.Function.bind(
							function(data) {
								this.fireEvent("init_finished");
							}, this);
					this.getPresenter().refreshCities(event_finish_func);
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
				}

			}
		});
