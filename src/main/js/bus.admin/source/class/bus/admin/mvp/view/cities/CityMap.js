/*
  #ignore(google.maps)
  #ignore(google.maps.*)
  #ignore(ContextMenu)
 */
qx.Class.define("bus.admin.mvp.view.cities.CityMap", {
	extend : qx.ui.container.Composite,

	construct : function(citiesPage) {
		this.base(arguments);
		this.__citiesPage = citiesPage;
		this.setLayout(new qx.ui.layout.Dock());
		this.initWidgets();
		var presenter = citiesPage.getPresenter();
		presenter.addListener("update_city", this.on_update_city, this);
		presenter.addListener("insert_city", this.on_insert_city, this);
		presenter.addListener("refresh", this.on_refresh, this);
		presenter.addListener("delete_city", this.on_delete_city, this);
	},
	properties : {
		googleMap : {
			nullable : true
		}
	},
	members : {
		__citiesPage : null,
		__markers : [],
		on_delete_city : function(e) {
			this.debug("on_update_city()");
			var data = e.getData();

			if (data == null || data.error == true) {
				this.debug("on_delete_city() : event data has errors");
				return;
			}
			this.deleteMarker(data.city_id);
		},
		on_update_city : function(e) {
			this.debug("on_update_city()");
			var data = e.getData();
			if (data == null || data.error == true) {
				this.debug("on_refresh_cities() : event data has errors");
				if (data != null && data.old_city != null) {
					this.updateMarker(data.old_city.id,
							data.old_city.location.x,
							data.old_city.location.y);
				}
				return;
			}
			this.updateMarker(data.new_city.id, data.new_city.location.x,
					data.new_city.location.y);
		},
		on_insert_city : function(e) {
			this.debug("on_insert_city()");
			var data = e.getData();
			if (data == null || data.error == true) {
				this.debug("on_refresh_cities() : event data has errors");
				return;
			}
			this.insertCityMarker(data.city.id, data.city.location.x,
					data.city.location.y);
		},

		on_refresh : function(e) {
			var data = e.getData();
			if (data == null || data.error == true) {
				this.debug("on_refresh_cities() : event data has errors");
				return;
			}
			this.deleteAllMarkers();
			for (var i = 0; i < data.cities.length; i++) {
				this.insertCityMarker(data.cities[i].id,
						data.cities[i].location.x,
						data.cities[i].location.y);
			}
		},

		initialize : function() {

		},

		initWidgets : function() {
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
							contextMenu.show(mouseEvent.latLng);
						});
				google.maps.event.addListener(map, "click",
						function(mouseEvent) {
							contextMenu.hide();
						});

				google.maps.event.addListener(map, "dragstart", function(
								mouseEvent) {
							contextMenu.hide();
						});

				google.maps.event.addListener(contextMenu,
						'menu_item_selected', function(latLng, eventName) {
							switch (eventName) {
								case 'insert_city_click' :
									T.debug("insert_city_click()");
									var cityModel = {
										location : {
											x : latLng.lat(),
											y : latLng.lng()
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

		insertCityMarker : function(id, lat, lon) {

			var marker = new google.maps.Marker({
						position : new google.maps.LatLng(lat, lon),
						map : this.getGoogleMap().getMapObject()
					});
			marker.setDraggable(false);
			marker.set("id", id);
			this.__markers.push(marker);
		},

		deleteMarker : function(id) {
			for (var i = 0; i < this.__markers.length; i++) {
				if (this.__markers[i].get("id") == id) {
					this.__markers[i].setMap(null);
					this.__markers.slice(i, 1);
					return;
				}
			}
		},

		deleteAllMarkers : function() {
			for (var i = 0; i < this.__markers.length; i++) {
				this.__markers[i].setMap(null);
			}
			this.__markers = [];
		},

		startMoveMarker : function(id) {
			var marker = this.getMarkerByID(id);
			if (marker != null)
				marker.setDraggable(true);
		},

		finishMoveMarker : function(id) {
			var marker = this.getMarkerByID(id);
			if (marker != null)
				marker.setDraggable(false);
		},

		getMarkerByID : function(id) {
			for (var i = 0; i < this.__markers.length; i++) {
				if (this.__markers[i].get("id") == id) {
					return this.__markers[i];
				}
			}
			return null;
		},

		updateMarker : function(id, lat, lon) {
			for (var i = 0; i < this.__markers.length; i++) {
				if (this.__markers[i].get("id") == id) {
					var marker = this.__markers[i];

					marker.setPosition(new google.maps.LatLng(lat, lon));
					return;
				}
			}

		},

		refreshMap : function() {
			this.debug("refreshMap");
			for (var i = 0; i < this.__markers.length; i++) {
				this.__markers[i].setMap(this.getGoogleMap().getMapObject());
			}
		}

	}
});