/*
 * #asset(bus/admin/images/map/*) #ignore(google.maps) #ignore(google.maps.*)
 */
qx.Class.define("bus.admin.mvp.view.stations.StationsMap", {
	extend : qx.ui.container.Composite,

	construct : function(stationsPage) {
		this.base(arguments);
		this.__stationsPage = stationsPage;
		this.setLayout(new qx.ui.layout.Dock());
		this.initWidgets();
		var presenter = stationsPage.getPresenter();
		presenter.addListener("load_stations", this.on_load_stations, this);
		presenter.addListener("insert_station", this.on_insert_station, this);
		presenter.addListener("update_station", this.on_update_station, this);
		presenter.addListener("delete_station", this.on_delete_station, this);

		this.setState("none");
	},
	properties : {
		googleMap : {
			nullable : true
		},
		state : {
			nullable : true
		}
	},
	members : {
		__stationsPage : null,
		__stationMarkers : [],
		__stationIcon : null,
		__selectStationIcon : null,

		initialize : function() {

		},
		on_load_stations : function(e) {

			var data = e.getData();
			if (data == null || data.error == true) {
				this.debug("load_stations() : event data has errors");
				return;
			}
			this.deleteAllStationMarkers();
			for (var i = 0; i < data.stations.length; i++) {
				this.insertStationMarker(data.stations[i]);
			}

		},
		on_insert_station : function(e) {
			var data = e.getData();
			if (data == null || data.error == true) {
				this.debug("on_update_station() : event data has errors");
				return;
			}
			var isHasTransport = bus.admin.mvp.model.helpers.StationsModelHelper
					.isHasTransport(data.station, this.__stationsPage
									.getStationsLeftPanel().getTransportType());
			if (isHasTransport == false) {
				return;
			}
			this.insertStationMarker(data.station);
		},
		on_update_station : function(e) {
			var data = e.getData();
			if (data == null || data.error == true) {
				this.debug("on_update_station() : event data has errors");
				return;
			}
			var isHasTransport = bus.admin.mvp.model.helpers.StationsModelHelper
					.isHasTransport(data.new_station, this.__stationsPage
									.getStationsLeftPanel().getTransportType());
			if (isHasTransport == false) {
				var e_del = {
					getData : function() {
						return data.new_station.id;
					}
				};
				this.on_delete_station(e_del);
				return;
			}
			this.updateStationMarker(data.new_station.id,
					data.new_station.location.lat,
					data.new_station.location.lon);
		},
		on_delete_station : function(e) {
			var data = e.getData();
			if (data == null || data.error == true) {
				this.debug("on_delete_station() : event data has errors");
				return;
			}
			this.deleteStationMarker(data.station_id);
		},
		initWidgets : function() {
			// create icons
			this.__stationIcon = new google.maps.MarkerImage('resource/bus/admin/images/map/stop.png');
			this.__selectStationIcon = new google.maps.MarkerImage('resource/bus/admin/images/map/stop_selected.png');
			// create Map Widget
			this.setGoogleMap(new bus.admin.widget.GoogleMap());
			this.getGoogleMap().init(50, 30, 5);

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
						label : 'Insert station'
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
							if (T.getState().toString() == "none") {
								contextMenu.show(mouseEvent.latLng);
							}

						});
				google.maps.event.addListener(map, "click",
						function(mouseEvent) {
							if (T.getState().toString() == "none") {
								contextMenu.hide();
							}

						});

				google.maps.event.addListener(map, "dragstart", function(
								mouseEvent) {
							if (T.getState().toString() == "none") {
								contextMenu.hide();
							}
						});

				google.maps.event.addListener(contextMenu,
						'menu_item_selected', function(latLng, eventName) {
							switch (eventName) {
								case 'insert_city_click' :
									T.debug("insert_city_click()");
									var city_id = T.__stationsPage
											.getStationsLeftPanel()
											.getSelectableCityID();
									var transport_type = T.__stationsPage
											.getStationsLeftPanel()
											.getTransportType();
									var stationsModel = {
										location : {
											lat : latLng.lat(),
											lon : latLng.lng()
										},
										city_id : city_id,
										transports : [{
													transport_type_id : transport_type
												}]
									};

									var insertStationDlg = new bus.admin.mvp.view.stations.CUStationForm(
											false, stationsModel);
									insertStationDlg.open();
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

		insertStationMarker : function(station) {

			var marker = new google.maps.Marker({
						position : new google.maps.LatLng(station.location.lat,
								station.location.lon),
						map : this.getGoogleMap().getMapObject(),
						icon : this.__stationIcon
					});
			marker.setDraggable(false);
			marker.set("id", station.id);
			var T = this;
			var stations = this.__stationsPage.getStationsModel();
			google.maps.event.addListener(marker, "click",
					function(mouseEvent) {
						var id = marker.get("id");
						var st = stations.getStationByID(id);
						var changeStationDlg = new bus.admin.mvp.view.stations.CUStationForm(
								true, st);
						changeStationDlg.open();

					});

			this.__stationMarkers.push(marker);
		},

		deleteStationMarker : function(id) {
			for (var i = 0; i < this.__stationMarkers.length; i++) {
				if (this.__stationMarkers[i].get("id") == id) {
					this.__stationMarkers[i].setMap(null);
					this.__stationMarkers.slice(i, 1);
					return;
				}
			}
		},

		deleteAllStationMarkers : function() {
			for (var i = 0; i < this.__stationMarkers.length; i++) {
				this.__stationMarkers[i].setMap(null);
			}
			this.__stationMarkers = [];
		},

		startMoveStationMarker : function(id) {
			var marker = this.getMarkerByID(id);
			if (marker != null)
				marker.setDraggable(true);
		},

		finishMoveStationMarker : function(id) {
			var marker = this.getMarkerByID(id);
			if (marker != null)
				marker.setDraggable(false);
		},

		getStationMarkerByID : function(id) {
			for (var i = 0; i < this.__stationMarkers.length; i++) {
				if (this.__stationMarkers[i].get("id") == id) {
					return this.__stationMarkers[i];
				}
			}
			return null;
		},

		updateStationMarker : function(id, lat, lon) {
			for (var i = 0; i < this.__stationMarkers.length; i++) {
				if (this.__stationMarkers[i].get("id") == id) {
					var marker = this.__stationMarkers[i];

					marker.setPosition(new google.maps.LatLng(lat, lon));
					return;
				}
			}

		},
		selectStationMarker : function(id) {
			for (var i = 0; i < this.__stationMarkers.length; i++) {
				if (this.__stationMarkers[i].get("id") == id) {
					this.__stationMarkers[i].setOptions({
								icon : this.__selectStationIcon
							});
				} else
					this.__stationMarkers[i].setOptions({
								icon : this.__stationIcon
							});
			}
		},
		refreshMap : function() {
			this.debug("refreshMap");
			for (var i = 0; i < this.__stationMarkers.length; i++) {
				this.__stationMarkers[i].setMap(this.getGoogleMap()
						.getMapObject());
			}
		}

	}
});