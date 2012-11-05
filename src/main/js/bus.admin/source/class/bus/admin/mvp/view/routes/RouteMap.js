/*
 * #ignore(google.maps) #ignore(google.maps.*)
 */
qx.Class.define("bus.admin.mvp.view.routes.RouteMap", {
	extend : qx.ui.container.Composite,

	construct : function(routesPage) {
		this.base(arguments);
		this._routesPage = routesPage;
		this.setLayout(new qx.ui.layout.Dock());
		this.initWidgets();
		this.setStatus("show");
		var globPresenter = qx.core.Init.getApplication().getPresenter();
		globPresenter.addListener("refresh_cities", this.on_refresh_cities,
				this);
		var localPresenter = routesPage.getPresenter();
		localPresenter.addListener("startCreateNewRoute",
				this.on_startCreateNewRoute, this);
		localPresenter.addListener("finishCreateNewRoute",
				this.on_finishCreateNewRoute, this);
		localPresenter.addListener("finishCreateNewRoute",
				this.on_finishCreateNewRoute, this);
		localPresenter.addListener("load_stations_inbox",
				this.on_loadStationsInBox, this);

	},
	properties : {
		googleMap : {
			nullable : true
		},

		/**
		 * Статус карты: "show" - отображение маршрута "edit" - редактирование
		 * маршрута
		 * 
		 * @type
		 */
		status : {
			nullable : true
		}
	},
	members : {
		_routesPage : null,
		_routeStations : [],
		_stations : [],
		_routePolylines : [],
		_routeStationIcon : null,
		_stationIcon : null,
		on_refresh_cities : function(e) {
			var data = e.getData();
			if (data == null || data.error == true) {
				this.debug("on_refresh_cities() : event data has errors");
				return;
			}
			if (data.models.cities.length <= 0)
				return;
			var city = data.models.cities[0];
			var map = this.getGoogleMap();
			map.setCenter(city.location.x, city.location.y, city.scale);

		},
		/**
		 * Обработчик вызывается при начале добавления нового маршрута
		 * 
		 * @param {RouteModel}
		 *            e - (еще не полностью заполненную)
		 */
		on_startCreateNewRoute : function(e) {
			this.setStatus("edit");
		},

		/**
		 * Обработчик вызывается при окончании процесса создания нового
		 * маршрута: он был отредактирован пользователем, отправлен на сервер и
		 * сохранен в БД. Теперь можно сделать доступным элементы левой
		 * панели(список городов и список типов маршрута)
		 * 
		 * @param {RouteModel}
		 *            e
		 */
		on_finishCreateNewRoute : function(e) {
			this.setStatus("show");
		},

		on_loadStationsInBox : function(e) {
			var data = e.getData();
			if (data == null || data.error == true) {
				this.debug("on_loadStationsInBox() : event data has errors");
				return;
			}
			this.deleteAllStations();
			this.debug("Loaded stations count: "
					+ data.stations.length.toString());
			for (var i = 0; i < data.stations.length; i++) {
				this.insertStation(data.stations[i]);
			}
		},

		onMapDragEnd : function(e) {
			if (this.getStatus() == "edit" && this.getGoogleMap() != null) {
				var map = this.getGoogleMap().getMapObject();
				if (map == null)
					return;
				var city_id = this._routesPage.getRouteLeftPanel()
						.getSelectableCityID();
				if (city_id == null)
					return;
				var p1 = map.getBounds().getSouthWest();
				var p2 = map.getBounds().getNorthEast();
				var localPresenter = this._routesPage.getPresenter();
				var p1 = {
					x : p1.lat(),
					y : p1.lng()
				};
				var p2 = {
					x : p2.lat(),
					y : p2.lng()
				};
				var event_finish_func = qx.lang.Function.bind(function(data) {

						}, this);
				localPresenter.loadStationsInBox(city_id, p1, p2,
						event_finish_func);
			}

		},

		showRouteWay : function(directType) {
			this.debug(directType);
			var route = this._routesPage.getCurrRouteModel();
			var way = null;
			if (directType == true) {
				way = route.directRouteWay;
			} else {
				way = route.reverseRouteWay;
			}
			this.debug(way.route_relations.length);
			this.deleteAllRouteStations();
			this.deleteAllRoutePolylines();

			var lang_id = "c_" + qx.locale.Manager.getInstance().getLocale();
			for (var i = 0; i < way.route_relations.length; i++) {
				var relation = way.route_relations[i];
				this.insertStationMarker(relation.stationB);
			}
			for (var i = 1; i < way.route_relations.length; i++) {
				var stA = way.route_relations[i - 1].stationB;
				var stB = way.route_relations[i].stationB;
				var points = way.route_relations[i].geom.points;
				this.insertPolyline(points, stA, stB, 'red');
			}

		},

		initialize : function() {

		},

		initWidgets : function() {
			this._routeStationIcon = new google.maps.MarkerImage('resource/bus/admin/images/map/stop.png');
			this._stationIcon = new google.maps.MarkerImage('resource/bus/admin/images/map/stop.png');
			// create Map Widget
			this.setGoogleMap(new bus.admin.widget.GoogleMap());
			this.getGoogleMap().init(50, 30, 5);

			/*
			 * var list = new qx.ui.form.List;
			 * list.setContextMenu(this.getContextMenu()); this.add(list);
			 */
			this.add(this.getGoogleMap(), {
						edge : "center"
					});

			// create the ContextMenuOptions object
			var contextMenuOptions = {};
			contextMenuOptions.classNames = {
				menu : 'context_menu',
				menuSeparator : 'context_menu_separator'
			};

			// create an array of ContextMenuItem objects
			var menuItems = [];
			menuItems.push({
						className : 'context_menu_item',
						eventName : 'insert_city_click',
						label : 'Insert city'
					});
			menuItems.push({});
			menuItems.push({
						className : 'context_menu_item',
						eventName : 'zoom_in_click',
						label : 'Zoom in'
					});
			menuItems.push({
						className : 'context_menu_item',
						eventName : 'zoom_out_click',
						label : 'Zoom out'
					});
			// a menuItem with no properties will be rendered as a

			menuItems.push({
						className : 'context_menu_item',
						eventName : 'center_map_click',
						label : 'Center map here'
					});
			contextMenuOptions.menuItems = menuItems;

			// create the ContextMenu object
			var T = this;

			this.getGoogleMap().addListenerOnce("appear", function() {
				this.refreshMap();
				var map = this.getGoogleMap().getMapObject();
				var contextMenu = new ContextMenu(map, contextMenuOptions);
				// display the ContextMenu on a Map right click
				google.maps.event.addListener(map, "rightclick", function(
								mouseEvent) {
							// contextMenu.show(mouseEvent.latLng);
						});
				google.maps.event.addListener(map, "click",
						function(mouseEvent) {
							// contextMenu.hide();
						});

				google.maps.event.addListener(map, "dragstart", function(
								mouseEvent) {
							// contextMenu.hide();
						});

				google.maps.event.addListener(map, "dragend", function(
								mouseEvent) {
							T.onMapDragEnd();
						});
				google.maps.event.addListener(contextMenu,
						'menu_item_selected', function(latLng, eventName) {
							switch (eventName) {
								case 'insert_city_click' :
									T.debug("insert_city_click()");
									var cityModel = {
										location : {
											lat : latLng.lat(),
											lon : latLng.lng()
										},
										scale : map.getZoom()
									};
									var changeDialog = new bus.admin.mvp.view.cities.CUCityForm(
											false, cityModel);
									changeDialog.open();
									break;
								case 'zoom_in_click' :
									map.setZoom(map.getZoom() + 1);
									break;
								case 'zoom_out_click' :
									map.setZoom(map.getZoom() - 1);
									break;
								case 'center_map_click' :
									map.panTo(latLng);
									break;
							}
						});
			}, this);

		},
		deleteAllRoutePolylines : function() {
			for (var i = 0; i < this._routePolylines.length; i++) {
				this._routePolylines[i].setMap(null);
			}
			this._routePolylines = [];
		},
		insertRoutePolyline : function(points, stationA, stationB, color) {
			var path = [];
			for (var i = 0; i < points.length; i++) {
				var lat = points[i].x;
				var lon = points[i].y;
				path.push(new google.maps.LatLng(lat, lon));
			}
			var line = new google.maps.Polyline({
						map : this.getGoogleMap().getMapObject(),
						path : path,
						strokeColor : color
					});
			line.set("stationA", stationA);
			line.set("stationB", stationB);
			this._routePolylines.push(line);
		},

		insertStation : function(station) {
			var lang_id = "c_" + qx.locale.Manager.getInstance().getLocale();
			var stationName = bus.admin.mvp.model.helpers.StationsModelHelper
					.getStationNameByLang(station, lang_id);
			var marker = new google.maps.Marker({
						position : new google.maps.LatLng(station.location.x,
								station.location.y),
						map : this.getGoogleMap().getMapObject(),
						title : stationName,
						icon : this._stationIcon
					});
			marker.setDraggable(false);
			marker.set("id", station.id);
			marker.set("station", station);
			var T = this;
			google.maps.event.addListener(marker, "click",
					function(mouseEvent) {

					});

			this._stations.push(marker);
		},
		insertRouteStation : function(station) {
			var lang_id = "c_" + qx.locale.Manager.getInstance().getLocale();
			var stationName = bus.admin.mvp.model.helpers.StationsModelHelper
					.getStationNameByLang(station, lang_id);
			var marker = new google.maps.Marker({
						position : new google.maps.LatLng(station.location.x,
								station.location.y),
						map : this.getGoogleMap().getMapObject(),
						title : stationName,
						icon : this._routeStationIcon
					});
			marker.setDraggable(false);
			marker.set("id", station.id);
			marker.set("station", station);
			var T = this;
			google.maps.event.addListener(marker, "click",
					function(mouseEvent) {

					});

			this._routeStations.push(marker);
		},

		deleteRouteStation : function(id) {
			for (var i = 0; i < this._routeStations.length; i++) {
				if (this._routeStations[i].get("id") == id) {
					this._routeStations[i].setMap(null);
					this._routeStations.slice(i, 1);
					return;
				}
			}
		},

		deleteAllRouteStations : function() {
			for (var i = 0; i < this._routeStations.length; i++) {
				this._routeStations[i].setMap(null);
			}
			this._routeStations = [];
		},

		deleteAllStations : function() {
			for (var i = 0; i < this._stations.length; i++) {
				this._stations[i].setMap(null);
			}
			this._stations = [];
		},

		refreshMap : function() {
			this.debug("refreshMap");
			for (var i = 0; i < this._routeStations.length; i++) {
				this._routeStations[i].setMap(this.getGoogleMap()
						.getMapObject());
			}

			for (var i = 0; i < this._routePolylines.length; i++) {
				this._routePolylines[i].setMap(this.getGoogleMap()
						.getMapObject());
			}
		}

	}
});