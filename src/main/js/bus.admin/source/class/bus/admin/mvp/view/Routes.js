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

/*
 * {"id":6,"city_id":1,"cost":3.5,"route_type_id":"c_route_bus","number":"34e","name_key":38,"name":[],
 * "directRouteWay":{"id":10,"route_id":6,"direct":true, "route_relations":[
 * {"id":65,"direct_route_id":10,"station_a_id":0,"station_b_id":22,"position_index":0,"distance":0.0,"ev_time":{"years":0,"months":0,"days":0,"hours":0,"minutes":0,"seconds":0.0,"type":"interval"},"stationB":{"id":22,"city_id":1,"location":{"x":49.9759325684943,"y":36.28093957901,"z":0.0,"m":0.0,"dimension":2,"haveMeasure":false,"type":1,"srid":4326},"name_key":28,"names":[{"id":51,"key_id":28,"lang_id":"c_ru","value":"Завод
 * им. Малышева"},{"id":52,"key_id":28,"lang_id":"c_en","value":"Zavod im.
 * Malisheva"}],"transports":[{"transport_type_id":"c_metro"}]}},{"id":66,"direct_route_id":10,"station_a_id":22,"station_b_id":21,"position_index":1,"distance":2262.6275709144215,"ev_time":{"years":0,"months":0,"days":0,"hours":0,"minutes":2,"seconds":42.909185,"type":"interval"},"geom":{"points":[{"x":49.9759325684943,"y":36.28093957901},{"x":49.9794582445876,"y":36.2607908248901},{"x":49.9794582445876,"y":36.2607908248901},{"x":49.9794582445876,"y":36.2607908248901}]},"stationB":{"id":21,"city_id":1,"location":{"x":49.9794582445876,"y":36.2607908248901,"z":0.0,"m":0.0,"dimension":2,"haveMeasure":false,"type":1,"srid":4326},"name_key":27,"names":[{"id":49,"key_id":27,"lang_id":"c_ru","value":"Спортивная"},{"id":50,"key_id":27,"lang_id":"c_en","value":"Sportivna"}],"transports":[{"transport_type_id":"c_metro"}]}},{"id":67,"direct_route_id":10,"station_a_id":21,"station_b_id":13,"position_index":2,"distance":2860.9374209566286,"ev_time":{"years":0,"months":0,"days":0,"hours":0,"minutes":3,"seconds":25.987494,"type":"interval"},"geom":{"points":[{"x":49.9794582445876,"y":36.2607908248901},{"x":49.9990620854991,"y":36.2404918670654},{"x":49.9990620854991,"y":36.2404918670654},{"x":49.9990620854991,"y":36.2404918670654}]},"stationB":{"id":13,"city_id":1,"location":{"x":49.9990620854991,"y":36.2404918670654,"z":0.0,"m":0.0,"dimension":2,"haveMeasure":false,"type":1,"srid":4326},"name_key":19,"names":[{"id":33,"key_id":19,"lang_id":"c_ru","value":"Архитектора
 * Бекетова"},{"id":34,"key_id":19,"lang_id":"c_en","value":"Arch Beketova
 * "}],"transports":[{"transport_type_id":"c_metro"}]}},{"id":68,"direct_route_id":10,"station_a_id":13,"station_b_id":12,"position_index":3,"distance":1137.2670491732447,"ev_time":{"years":0,"months":0,"days":0,"hours":0,"minutes":1,"seconds":21.883228,"type":"interval"},"geom":{"points":[{"x":49.9990620854991,"y":36.2404918670654},{"x":50.004854794331,"y":36.2313938140869},{"x":50.004854794331,"y":36.2313938140869},{"x":50.004854794331,"y":36.2313938140869}]},"stationB":{"id":12,"city_id":1,"location":{"x":50.004854794331,"y":36.2313938140869,"z":0.0,"m":0.0,"dimension":2,"haveMeasure":false,"type":1,"srid":4326},"name_key":18,"names":[{"id":31,"key_id":18,"lang_id":"c_ru","value":"Госпром"},{"id":32,"key_id":18,"lang_id":"c_en","value":"Gosprom"}],"transports":[{"transport_type_id":"c_metro"}]}},{"id":69,"direct_route_id":10,"station_a_id":12,"station_b_id":11,"position_index":4,"distance":927.769131150104,"ev_time":{"years":0,"months":0,"days":0,"hours":0,"minutes":1,"seconds":6.799377,"type":"interval"},"geom":{"points":[{"x":50.004854794331,"y":36.2313938140869},{"x":50.0129082580197,"y":36.2261581420898},{"x":50.0129082580197,"y":36.2261581420898},{"x":50.0129082580197,"y":36.2261581420898}]},"stationB":{"id":11,"city_id":1,"location":{"x":50.0129082580197,"y":36.2261581420898,"z":0.0,"m":0.0,"dimension":2,"haveMeasure":false,"type":1,"srid":4326},"name_key":17,"names":[{"id":29,"key_id":17,"lang_id":"c_ru","value":"Научная"},{"id":30,"key_id":17,"lang_id":"c_en","value":"Nauchnaia"}],"transports":[{"transport_type_id":"c_metro"}]}},{"id":70,"direct_route_id":10,"station_a_id":11,"station_b_id":10,"position_index":5,"distance":1293.5510631640243,"ev_time":{"years":0,"months":0,"days":0,"hours":0,"minutes":1,"seconds":33.135677,"type":"interval"},"geom":{"points":[{"x":50.0129082580197,"y":36.2261581420898},{"x":50.0267504421571,"y":36.2228965759277},{"x":50.0267504421571,"y":36.2228965759277},{"x":50.0267504421571,"y":36.2228965759277}]},"stationB":{"id":10,"city_id":1,"location":{"x":50.0267504421571,"y":36.2228965759277,"z":0.0,"m":0.0,"dimension":2,"haveMeasure":false,"type":1,"srid":4326},"name_key":16,"names":[{"id":27,"key_id":16,"lang_id":"c_ru","value":"Ботанический
 * сад"},{"id":28,"key_id":16,"lang_id":"c_en","value":"Botan
 * sad"}],"transports":[{"transport_type_id":"c_metro"}]}}],"schedule":{"id":8,"direct_route_id":10,"scheduleGroups":[{"id":8,"schedule_id":8,"days":[{"id":8,"schedule_group_id":8,"day_id":"c_all"}],"timetables":[{"id":8,"schedule_group_id":8,"time_A":10800,"time_B":10800,"frequency":0}]}]}},"reverseRouteWay":{"id":9,"route_id":6,"direct":false,"route_relations":[{"id":59,"direct_route_id":9,"station_a_id":0,"station_b_id":10,"position_index":0,"distance":0.0,"ev_time":{"years":0,"months":0,"days":0,"hours":0,"minutes":0,"seconds":0.0,"type":"interval"},"stationB":{"id":10,"city_id":1,"location":{"x":50.0267504421571,"y":36.2228965759277,"z":0.0,"m":0.0,"dimension":2,"haveMeasure":false,"type":1,"srid":4326},"name_key":16,"names":[{"id":27,"key_id":16,"lang_id":"c_ru","value":"Ботанический
 * сад"},{"id":28,"key_id":16,"lang_id":"c_en","value":"Botan
 * sad"}],"transports":[{"transport_type_id":"c_metro"}]}},{"id":60,"direct_route_id":9,"station_a_id":10,"station_b_id":11,"position_index":1,"distance":1293.5510631639654,"ev_time":{"years":0,"months":0,"days":0,"hours":0,"minutes":1,"seconds":33.135677,"type":"interval"},"geom":{"points":[{"x":50.0267504421571,"y":36.2228965759277},{"x":50.0129082580197,"y":36.2261581420898},{"x":50.0129082580197,"y":36.2261581420898},{"x":50.0129082580197,"y":36.2261581420898}]},"stationB":{"id":11,"city_id":1,"location":{"x":50.0129082580197,"y":36.2261581420898,"z":0.0,"m":0.0,"dimension":2,"haveMeasure":false,"type":1,"srid":4326},"name_key":17,"names":[{"id":29,"key_id":17,"lang_id":"c_ru","value":"Научная"},{"id":30,"key_id":17,"lang_id":"c_en","value":"Nauchnaia"}],"transports":[{"transport_type_id":"c_metro"}]}},{"id":61,"direct_route_id":9,"station_a_id":11,"station_b_id":12,"position_index":2,"distance":927.7691311503371,"ev_time":{"years":0,"months":0,"days":0,"hours":0,"minutes":1,"seconds":6.799377,"type":"interval"},"geom":{"points":[{"x":50.0129082580197,"y":36.2261581420898},{"x":50.004854794331,"y":36.2313938140869},{"x":50.004854794331,"y":36.2313938140869},{"x":50.004854794331,"y":36.2313938140869}]},"stationB":{"id":12,"city_id":1,"location":{"x":50.004854794331,"y":36.2313938140869,"z":0.0,"m":0.0,"dimension":2,"haveMeasure":false,"type":1,"srid":4326},"name_key":18,"names":[{"id":31,"key_id":18,"lang_id":"c_ru","value":"Госпром"},{"id":32,"key_id":18,"lang_id":"c_en","value":"Gosprom"}],"transports":[{"transport_type_id":"c_metro"}]}},{"id":62,"direct_route_id":9,"station_a_id":12,"station_b_id":13,"position_index":3,"distance":1137.2670491735562,"ev_time":{"years":0,"months":0,"days":0,"hours":0,"minutes":1,"seconds":21.883228,"type":"interval"},"geom":{"points":[{"x":50.004854794331,"y":36.2313938140869},{"x":49.9990620854991,"y":36.2404918670654},{"x":49.9990620854991,"y":36.2404918670654},{"x":49.9990620854991,"y":36.2404918670654}]},"stationB":{"id":13,"city_id":1,"location":{"x":49.9990620854991,"y":36.2404918670654,"z":0.0,"m":0.0,"dimension":2,"haveMeasure":false,"type":1,"srid":4326},"name_key":19,"names":[{"id":33,"key_id":19,"lang_id":"c_ru","value":"Архитектора
 * Бекетова"},{"id":34,"key_id":19,"lang_id":"c_en","value":"Arch Beketova
 * "}],"transports":[{"transport_type_id":"c_metro"}]}},{"id":63,"direct_route_id":9,"station_a_id":13,"station_b_id":21,"position_index":4,"distance":2860.9374209566827,"ev_time":{"years":0,"months":0,"days":0,"hours":0,"minutes":3,"seconds":25.987494,"type":"interval"},"geom":{"points":[{"x":49.9990620854991,"y":36.2404918670654},{"x":49.9794582445876,"y":36.2607908248901},{"x":49.9794582445876,"y":36.2607908248901},{"x":49.9794582445876,"y":36.2607908248901}]},"stationB":{"id":21,"city_id":1,"location":{"x":49.9794582445876,"y":36.2607908248901,"z":0.0,"m":0.0,"dimension":2,"haveMeasure":false,"type":1,"srid":4326},"name_key":27,"names":[{"id":49,"key_id":27,"lang_id":"c_ru","value":"Спортивная"},{"id":50,"key_id":27,"lang_id":"c_en","value":"Sportivna"}],"transports":[{"transport_type_id":"c_metro"}]}},{"id":64,"direct_route_id":9,"station_a_id":21,"station_b_id":22,"position_index":5,"distance":2262.627570914441,"ev_time":{"years":0,"months":0,"days":0,"hours":0,"minutes":2,"seconds":42.909185,"type":"interval"},"geom":{"points":[{"x":49.9794582445876,"y":36.2607908248901},{"x":49.9759325684943,"y":36.28093957901},{"x":49.9759325684943,"y":36.28093957901},{"x":49.9759325684943,"y":36.28093957901}]},"stationB":{"id":22,"city_id":1,"location":{"x":49.9759325684943,"y":36.28093957901,"z":0.0,"m":0.0,"dimension":2,"haveMeasure":false,"type":1,"srid":4326},"name_key":28,"names":[{"id":51,"key_id":28,"lang_id":"c_ru","value":"Завод
 * им. Малышева"},{"id":52,"key_id":28,"lang_id":"c_en","value":"Zavod im.
 * Malisheva"}],"transports":[{"transport_type_id":"c_metro"}]}}],"schedule":{"id":7,"direct_route_id":9,"scheduleGroups":[{"id":7,"schedule_id":7,"days":[{"id":7,"schedule_group_id":7,"day_id":"c_all"}],"timetables":[{"id":7,"schedule_group_id":7,"time_A":10800,"time_B":10800,"frequency":0}]}]}}}
 */
qx.Class.define("bus.admin.mvp.view.Routes", {
			extend : bus.admin.mvp.view.AbstractPage,

			construct : function() {
				this.base(arguments);
				this._is_initialized = false;
				this.setStatus("show");
				this
						.setPresenter(new bus.admin.mvp.presenter.RoutesPresenter(this));
				this.__initWidgets();

				this.addListener("appear", this.on_appear, this);
				this.getPresenter().addListener("startCreateNewRoute",
						this.on_startCreateNewRoute, this);
				this.getPresenter().addListener("finishCreateNewRoute",
						this.on_finishCreateNewRoute, this);

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
				},
				currRoutesList : {
					nullable : true
				},

				/**
				 * Статус карты: 
				 * "show" - отображение маршрута 
				 * "edit" - редактирование маршрута
				 * "new"  - создание маршрута
				 * 
				 * @type String
				 */
				status : {
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
				},

				on_startCreateNewRoute : function(e) {

				},
				on_finishCreateNewRoute : function(e) {

				}

			}
		});
