/*
 * #ignore(google.maps) #ignore(google.maps.*)
 */
qx.Class.define("bus.admin.mvp.view.routes.RouteMap", {
	extend : qx.ui.container.Composite,

	construct : function(routesPage) {
		this.base(arguments);
		this._routesPage = routesPage;
		this.setMinZoom(13);
		this.setLayout(new qx.ui.layout.Dock());
		this._nextStationID = -1;
		this.initWidgets();

		var globPresenter = qx.core.Init.getApplication().getPresenter();
		globPresenter.addListener("refresh_cities", this.on_refresh_cities,
				this);
		var localPresenter = routesPage.getPresenter();
		localPresenter.addListener("startCreateNewRoute",
				this.on_startCreateNewRoute, this);
		localPresenter.addListener("finishCreateNewRoute",
				this.on_finishCreateNewRoute, this);
		localPresenter.addListener("load_stations_inbox",
				this.on_loadStationsInBox, this);
		localPresenter.addListener("insertStationToCurrentRoute",
				this.on_insertStationToCurrentRoute, this);
		localPresenter
				.addListener("addNewStation", this.on_addNewStation, this);

	},
	properties : {
		googleMap : {
			nullable : true
		},
		minZoom : {
			nullable : true
		}
	},
	members : {
		_nextStationID : null,
		_menuItems : null,
		_contextMenu : null,
		_routesPage : null,

		_stations : [],
		_addedStations : [],
		_routeStations : [],
		_stationIcon : null,
		_addedStationIcon : null,
		_routeStationIcon : null,

		_routePolylines : [],

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

			this.deleteAllRoutePolylines();

			this.deleteAllStations("added");
			this.deleteAllStations("route");
			this.deleteAllStations();
			console.log(this._routeStations);
			this.onMapDragEnd();

			if (this._menuItems == null) {
				this._menuItems = [];
			}
			this._menuItems.unshift({
						className : 'context_menu_item',
						eventName : 'insert_station_click',
						label : 'Insert station'
					});

			this._contextMenu = this._updateContextMenu(this._menuItems,
					this._contextMenu);
			this.canChangePolylines(true);
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
			this.debug("RouteMap: on_finishCreateNewRoute()");
			var data = e.getData();
			if (data == null || (data.error == true && data.isOK == true)) {
				return;
			}
			this.deleteAllStations("route");
			this.deleteAllStations("added");
			this.deleteAllStations();
			this.deleteAllRoutePolylines();
			if (this._menuItems != null && this._menuItems.length > 0) {
				this._menuItems.splice(0, 1);
			}
			this._contextMenu = this._updateContextMenu(this._menuItems,
					this._contextMenu);
			this.canChangePolylines(false);
		},

		updateMarkersVisible : function(markers) {

			var minZoom = this.getMinZoom();
			var map = this.getGoogleMap().getMapObject();
			if (map == null || markers == null)
				return;
			var zoom = map.getZoom();
			for (var i = 0; i < markers.length; i++) {
				if (zoom > minZoom) {
					if (markers[i].getMap() == null)
						markers[i].setMap(map);
				} else
					markers[i].setMap(null);
			}

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
				if (this.getMarkerByID(data.stations[i].id, "route") == null)
					this.insertStation(data.stations[i], null);
			}
			this.updateMarkersVisible(this._addedStations);
		},

		onMapDragEnd : function(e) {
			if (this._routesPage.getStatus() != "show"
					&& this.getGoogleMap() != null) {
				var map = this.getGoogleMap().getMapObject();
				if (map == null)
					return;
				this.debug(this.getMinZoom());
				this.debug(map.getZoom());
				if (this.getMinZoom() >= map.getZoom()) {
					this.deleteAllStations();
					return;
				}
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
			} else if (this.getGoogleMap() != null) {
				this.deleteAllStations();
			}

		},

		on_addNewStation : function(e) {
			var stationModel = e.getData();
			if (stationModel == null || stationModel.error == true) {
				this.debug("on_refresh_cities() : event data has errors");
				return;
			}
			console.log(stationModel);
			this.insertStation(stationModel,
					this.getGoogleMap().getMapObject(), "added");
		},
		on_insertStationToCurrentRoute : function(e) {
			var stationModel = e.getData();
			if (stationModel == null || stationModel.error == true) {
				this.debug("on_refresh_cities() : event data has errors");
				return;
			}
			if (stationModel.id < 0) {
				var marker = this.getMarkerByID(stationModel.id, "added");
				this._routeStations.push(marker);
			} else {
				this.deleteStation(stationModel.id);
				this.insertStation(stationModel, this.getGoogleMap()
								.getMapObject(), "route");
			}
			if (this._routeStations.length > 1) {
				var points = [];

				var s1 = this._routeStations[this._routeStations.length - 2]
						.get("station");
				var s2 = this._routeStations[this._routeStations.length - 1]
						.get("station");

				points.push({
							x : s1.location.x,
							y : s1.location.y
						});
				points.push({
							x : s2.location.x,
							y : s2.location.y
						});
				var canChange = this._routesPage.getStatus() != "show"
						? true
						: false;
				this.insertRoutePolyline(points, s1, s2, "red", canChange);
			}
		},

		canChangePolylines : function(flag) {
			for (var i = 0; i < this._routePolylines.length; i++) {
				this._routePolylines[i].setEditable(flag);
			}
		},

		clearMapObjects : function() {
			this.deleteAllStations("route");
			if (this._routesPage.getStatus() == "show") {
				this.deleteAllStations("added");
			}
			this.deleteAllStations();
			this.deleteAllRoutePolylines();
		},

		showRouteWay : function(directType) {
			this.clearMapObjects();
			this.onMapDragEnd();
			this.debug(directType);
			var route = this._routesPage.getCurrRouteModel();

			var canChange = this._routesPage.getStatus() != "show"
					? true
					: false;
			var way = null;
			if (directType == true) {
				way = route.directRouteWay;
			} else if (directType == false) {
				way = route.reverseRouteWay;
			}
			console.log(way);
			console.log(this._addedStations);

			this.refreshMap();
			if (directType == null)
				return;
			var lang_id = "c_" + qx.locale.Manager.getInstance().getLocale();

			// Create a LatLngBounds object
			var bounds = new google.maps.LatLngBounds();
			var map = this.getGoogleMap().getMapObject();
			for (var i = 0; i < way.route_relations.length; i++) {
				var relation = way.route_relations[i];
				if (relation.stationB.id < 0) {
					var marker = this.getMarkerByID(relation.stationB.id,
							"added");
					if (marker == null)
						marker = this.insertStation(relation.stationB, map,
								"added");
					this._routeStations.push(marker);
				} else {
					this.insertStation(relation.stationB, map, "route");
				}
				bounds.extend(new google.maps.LatLng(
						relation.stationB.location.x,
						relation.stationB.location.y));

			}
			map.fitBounds(bounds);
			for (var i = 1; i < way.route_relations.length; i++) {
				var stA = way.route_relations[i - 1].stationB;
				var stB = way.route_relations[i].stationB;
				var points = way.route_relations[i].geom.points;
				this.insertRoutePolyline(points, stA, stB, 'red', canChange);
			}

		},

		getPolylinePoints : function(polyline) {
			var path = polyline.getPath();
			var points = [];
			console.log(path);
			for (var i = 0; i < path.getLength(); i++) {
				var p = path.getAt(i);
				var point = {
					x : p.lat(),
					y : p.lng()
				};
				points.push(point);
			}
			return points;
		},
		getCurrentRelationsData : function() {
			var relations = [];

			if (this._routeStations != null && this._routeStations.length > 0) {
				var relation = {
					stationA : null,
					stationB : this._routeStations[0].get("station"),
					geom : null
				};
				relations.push(relation);
			} else
				return null;
			for (var i = 0; i < this._routePolylines.length; i++) {
				var stA = this._routePolylines[i].get("stationA");
				var stB = this._routePolylines[i].get("stationB");

				var points = [];
				var relation = {
					stationA : stA,
					stationB : stB,
					geom : {
						points : this
								.getPolylinePoints(this._routePolylines[i])
					}
				};
				relations.push(bus.admin.helpers.ObjectHelper.clone(relation));
			}
			return relations;
		},
		initialize : function() {

		},

		initWidgets : function() {
			this._routeStationIcon = new google.maps.MarkerImage('resource/bus/admin/images/map/stop_selected.png');
			this._stationIcon = new google.maps.MarkerImage('resource/bus/admin/images/map/stop.png');
			this._addedStationIcon = new google.maps.MarkerImage('resource/bus/admin/images/map/stop_new.png');
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

			// create an array of ContextMenuItem objects
			this._menuItems = [];

			this._menuItems.push({});
			this._menuItems.push({
						className : 'context_menu_item',
						eventName : 'zoom_in_click',
						label : 'Zoom in'
					});
			this._menuItems.push({
						className : 'context_menu_item',
						eventName : 'zoom_out_click',
						label : 'Zoom out'
					});
			// a menuItem with no properties will be rendered as a

			this._menuItems.push({
						className : 'context_menu_item',
						eventName : 'center_map_click',
						label : 'Center map here'
					});

			// create the ContextMenu object

			this.getGoogleMap().addListenerOnce("appear", function() {
				var map = this.getGoogleMap().getMapObject();
				var T = this;
				this.refreshMap();
				this._contextMenu = this._updateContextMenu(this._menuItems,
						this._contextMenu);

				// display the ContextMenu on a Map right click
				google.maps.event.addListener(map, "rightclick", function(
								mouseEvent) {
							T._contextMenu.show(mouseEvent.latLng);
						});
				google.maps.event.addListener(map, "click",
						function(mouseEvent) {
							T._contextMenu.hide();
						});

				google.maps.event.addListener(map, "dragstart", function(
								mouseEvent) {
							T._contextMenu.hide();
						});

				google.maps.event.addListener(map, "dragend", function(
								mouseEvent) {
							T.onMapDragEnd();
						});

				google.maps.event.addListener(map, 'idle', function() {
							T.updateMarkersVisible(T._addedStations);
							T.updateMarkersVisible(T._stations);
						});

				google.maps.event.addListener(map, 'zoom_changed', function() {
							T.updateMarkersVisible(T._addedStations);
							T.updateMarkersVisible(T._stations);
						});
			}, this);

		},

		/**
		 * Пересоздает контекстное меню карты
		 * 
		 * @param {Элементы
		 *            контекстного меню} menuItems
		 * @param {Старое
		 *            меню, которое нужно удалить} oldContextMenu
		 */
		_updateContextMenu : function(menuItems, oldContextMenu) {
			var items = bus.admin.helpers.ObjectHelper.clone(menuItems);
			var map = this.getGoogleMap().getMapObject();
			if (map == null)
				return;
			// create the ContextMenuOptions object
			var contextMenuOptions = {};
			contextMenuOptions.classNames = {
				menu : 'context_menu',
				menuSeparator : 'context_menu_separator'
			};
			contextMenuOptions.menuItems = items;

			if (oldContextMenu != null) {
				google.maps.event.clearListeners(map, 'menu_item_selected');
			}
			var contextMenu = new ContextMenu(map, contextMenuOptions);
			var T = this;
			google.maps.event.addListener(contextMenu, 'menu_item_selected',
					function(latLng, eventName) {
						switch (eventName) {
							case 'insert_station_click' :
								T.on_menu_InsertStation(latLng);
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
			return contextMenu;
		},

		on_menu_InsertStation : function(latLng) {
			this.debug("on_menu_InsertStation()");
			var city_id = this._routesPage.getRouteLeftPanel()
					.getSelectableCityID();
			var routeType = this._routesPage.getRouteLeftPanel().getRouteType();
			var newStationModel = {
				id : this._nextStationID,
				location : {
					x : latLng.lat(),
					y : latLng.lng()
				},
				city_id : city_id
			};
			this._nextStationID = this._nextStationID - 1;
			var T = this;
			var tempPresenter = {
				insertStation : function(station, event_finish_func) {
					T._routesPage.getPresenter().addNewStation(station, null);
					if (event_finish_func != null)
						event_finish_func(station);
				}
			};
			var insertStationDlg = new bus.admin.mvp.view.stations.CUStationForm(
					false, newStationModel, tempPresenter);
			insertStationDlg.open();
		},

		deleteAllRoutePolylines : function() {
			for (var i = 0; i < this._routePolylines.length; i++) {
				this._routePolylines[i].setMap(null);
			}
			this._routePolylines = [];
		},

		insertRoutePolyline : function(points, stationA, stationB, color,
				canChange) {
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
			line.setEditable(canChange);
			line.set("stationA", stationA);
			line.set("stationB", stationB);
			this._routePolylines.push(line);
		},

		getMarkerByID : function(id, type) {
			var arr = [];
			switch (type) {
				case "route" :
					arr = this._routeStations;
					break;
				case "added" :
					arr = this._addedStations;
					break;

				default :
					arr = this._stations;
					break;

			}
			for (var i = 0; i < arr.length; i++) {
				var s = arr[i].get("station");
				if (s.id == id) {
					return arr[i];
				}
			}
			return null;
		},
		insertStation : function(station, map, type) {
			var lang_id = "c_" + qx.locale.Manager.getInstance().getLocale();
			var stationName = bus.admin.mvp.model.helpers.StationsModelHelper
					.getStationNameByLang(station, lang_id);
			var marker = new google.maps.Marker({
						position : new google.maps.LatLng(station.location.x,
								station.location.y),
						map : map,
						title : stationName,
						icon : this._stationIcon
					});

			marker.set("id", station.id);
			marker.set("station", station);

			switch (type) {
				case "route" :
					marker.setIcon(this._routeStationIcon);
					marker.setDraggable(false);
					this._routeStations.push(marker);
					break;
				case "added" :
					marker.setDraggable(true);
					marker.setIcon(this._addedStationIcon);
					this._addedStations.push(marker);
					google.maps.event.addListener(marker, "click", function(
									mouseEvent) {
								mouseEvent.latLng
								var stationModel = marker.get("station");
								stationModel.location = {
									x : mouseEvent.latLng.lat(),
									y : mouseEvent.latLng.lng()
								};

							});
					break;

				default :
					marker.setDraggable(false);
					marker.setIcon(this._stationIcon);
					this._stations.push(marker);
					break;

			}
			if (type != "route") {
				var T = this;
				var presenter = this._routesPage.getPresenter();
				google.maps.event.addListener(marker, "click", function(
								mouseEvent) {
							var stationModel = marker.get("station");
							for (var i = 0; i < T._routeStations.length; i++) {
								if (stationModel.id == T._routeStations[i].id) {
									return;
								}
							}
							console.log(stationModel);
							presenter.insertStationToCurrentRoute(stationModel,
									null);
						});
			}

			return marker;
		},

		/**
		 * Поиск индекс polyline по id станции
		 * 
		 * @param {id
		 *            станции} id
		 * @param {станция
		 *            в начале или в конце Polyline? } isBegin
		 */
		getPolylineIndexByStationID : function(id, isBegin) {
			for (var i = 0; i < this._routePolylines.length; i++) {
				var st = null;
				if (isBegin == true) {
					st = this._routePolylines[i].get("stationA");
				} else {
					st = this._routePolylines[i].get("stationB");
				}
				if (st.id == id) {
					return i;
				}
			}
			return -1;

		},

		deleteRouteStation : function(id) {
			for (var i = 0; i < this._routeStations.length; i++) {
				if (this._routeStations[i].get("id") == id) {
					this._routeStations[i].setMap(null);
					this._routeStations.splice(i, 1);

					var polyIndexIn = this.getPolylineIndexByStationID(id,
							false);
					var polyIndexOut = this.getPolylineIndexByStationID(id,
							true);

					if (polyIndexIn < 0 && polyIndexOut >= 0) {
						this._routePolylines[polyIndexOut].setMap(null);
						this._routePolylines.splice(polyIndexOut, 1);
						return;
					} else if (polyIndexOut < 0 && polyIndexIn >= 0) {
						this._routePolylines[polyIndexIn].setMap(null);
						this._routePolylines.splice(polyIndexIn, 1);
						return;
					} else if (polyIndexOut < 0 && polyIndexIn < 0) {
						return;
					}
					var line1 = this._routePolylines[polyIndexIn];
					var line2 = this._routePolylines[polyIndexOut];
					for (var j = 0; j < line2.getPath().getLength(); j++) {
						var p = line2.getPath().getAt(j);
						line1.getPath().push(p);
					}
					line1.set("stationB", line2.get("stationB"));
					line2.setMap(null);
					this._routePolylines.splice(polyIndexOut, 1);
					return;
				}

			}
		},

		deleteStation : function(id) {
			for (var i = 0; i < this._stations.length; i++) {
				if (this._stations[i].get("id") == id) {
					this._stations[i].setMap(null);
					this._stations.splice(i, 1);
				}
			}
		},

		deleteAllStations : function(type) {
			var arr = null;
			switch (type) {
				case "route" :
					arr = this._routeStations;
					this.debug("delete route stations");
					break;
				case "added" :
					arr = this._addedStations;
					break;
				default :
					arr = this._stations;
					break;

			}

			for (var i = 0; i < arr.length; i++) {
				arr[i].setMap(null);
			}

			switch (type) {
				case "route" :
					this._routeStations = [];
					break;
				case "added" :
					this._addedStations = [];
					break;
				default :
					this._stations = [];
					break;
			}
		},

		refreshMap : function() {
			this.debug("refreshMap");
			var map = this.getGoogleMap().getMapObject();
			if (map == null)
				return;
			this.updateMarkersVisible(this._addedStations);
			this.updateMarkersVisible(this._stations);

			for (var i = 0; i < this._routeStations.length; i++) {
				this._routeStations[i].setMap(map);
			}

			for (var i = 0; i < this._routePolylines.length; i++) {
				this._routePolylines[i].setMap(map);
			}
		}

	}
});