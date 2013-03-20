/*************************************************************************
 *
 * Copyright:
 * Bus.Admin-lib is copyright (c) 2012, {@link http://ways.in.ua} Inc. All Rights Reserved. 
 *
 * License:
 * Bus.Admin-lib is free software, licensed under the MIT license. 
 * See the file {@link http://api.ways.in.ua/license.txt license.txt} in this distribution for more details.
 *
 * Authors:
 * Roman Shafeyev (rs@premiumgis.com)
 *
 *************************************************************************/

/**
 * @ignore(google.maps)
 * @ignore(ContextMenu)
 */

/**
 * Виджет карты для страницы {@link bus.admin.mvp.view.Cities Cities}
 */
 qx.Class.define("bus.admin.mvp.view.cities.CityMap", {
 	extend : qx.ui.container.Composite,

 	/**
 	 * [construct description]
 	 * @param presenter {bus.admin.mvp.presenter.CitiesPresenter}  Presenter
 	 */
 	construct : function(presenter) {
 		this.base(arguments);
 		this._presenter = presenter;
 		this.setLayout(new qx.ui.layout.Dock());
 		this.__initWidgets();
 		presenter.addListener("refresh", this.__onRefresh, this);
 		presenter.addListener("select_city", this.__onSelectCity, this);
 		presenter.addListener("update_city", this.__onUpdateCity, this);
 		presenter.addListener("insert_city", this.__onInsertCity, this);
 		presenter.addListener("remove_city", this.__onRemoveCity, this);
 	},

 	properties : {
 		/**
 		 * Виджет Google карты
 		 */
 		googleMap : {
 			nullable : true,
 			check : "bus.admin.widget.GoogleMap"
 		}
 	},
 	members : {
 		/**
 		 * Presenter
 		 * @type {bus.admin.mvp.presenter.CitiesPresenter}
 		 */
 		_presenter : null,

 		/**
 		 * Массив маркеров
 		 * @type {google.maps.Marker[]}
 		 */
 		__markers : [],

		/**
		 * Обработчик события {@link bus.admin.mvp.presenter.CitiesPresenter#refresh refresh}
		 * @param  e {qx.event.type.Data} Данные события. Структуру свойств смотрите в описании события.
		 */
		 __onRefresh : function(e) {
		 	this.debug("execute on_refresh() event handler");
		 	var citiesModel = e.getData().cities;
		 	var cities = citiesModel.getAllCities();
		 	this.deleteAllMarkers();
		 	for (var i = 0; i < cities.length; i++) {
		 		this.insertCityMarker(cities[i].getId(),
		 			cities[i].getLocation().getLat(),
		 			cities[i].getLocation().getLon());
		 	}
		 },

		 /**
		  * Обработчик события  {@link bus.admin.mvp.presenter.CitiesPresenter#select_city select_city} вызывается при выборе пользователем города.
		  * @param  e {qx.event.type.Data} Данные события. Структуру свойств смотрите в описании события.
		  */
		  __onSelectCity : function(e){
		  	this.debug("execute _onSelectCity() event handler");
		  	var cityModel = e.getData().city;
		  	if(cityModel == null)
		  		return;
		  	this.getGoogleMap().setCenter(cityModel.getLocation().getLat(), 
		  		cityModel.getLocation().getLon(),cityModel.getScale());
		  },

		 /**
		  * Обработчик события  {@link bus.admin.mvp.presenter.CitiesPresenter#update_city update_city} вызывается при изменении модели города.
		  * @param  e {qx.event.type.Data} Данные события. Структуру свойств смотрите в описании события.
		  */
		  __onUpdateCity : function(e) {
		  	if(e.getData().sender == this)
		  		return;
		  	this.debug("execute __onUpdateCity() event handler");
		  	var oldCityModel = e.getData().oldCity;
		  	var newCityModel = e.getData().newCity;
		  	this.updateMarker(oldCityModel.getId(), newCityModel.getLocation().getLat(), newCityModel.getLocation().getLon());
		  },

		 /**
		  * Обработчик события  {@link bus.admin.mvp.presenter.CitiesPresenter#insert_city insert_city} вызывается при добавлении нового города.
		  * @param  e {qx.event.type.Data} Данные события. Структуру свойств смотрите в описании события.
		  */
		  __onInsertCity : function(e) {
		  	if(e.getData().sender == this)
		  		return;
		  	this.debug("execute _onInsertCity() event handler");
		  	var city = e.getData().city;
		  	this.insertCityMarker(city.getId(), city.getLocation().getLat(), city.getLocation().getLon());
		  },

		 /**
		  * Обработчик события  {@link bus.admin.mvp.presenter.CitiesPresenter#remove_city remove_city} вызывается при удалении города.
		  * @param  e {qx.event.type.Data} Данные события. Структуру свойств смотрите в описании события.
		  */
		  __onRemoveCity : function(e) {
		  	if(e.getData().sender == this)
		  		return;
		  	this.debug("execute _onRemoveCity() event handler");
		  	this.deleteMarker(e.getData().cityID);
		  },

		  /**
		   * Инициализирует дочерние виджеты
		   */
		  __initWidgets : function() {
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
			var self = this;
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

				google.maps.event.addListener(map, "dragend", function(
					mouseEvent) {
					var scale = map.getZoom();
					var latLng = map.getCenter();
					self._presenter.changeMapCenterTrigger(latLng.lat(), latLng.lng(), scale);
					if(self._presenter.getDataStorage().getState() == "move"){

					}
				});

				google.maps.event.addListener(contextMenu,
					'menu_item_selected', function(latLng, eventName) {
						switch (eventName) {
							case 'insert_city_click' :
							self.debug("insert_city_click()");
							var cityModel = new bus.admin.mvp.model.CityModel();
							cityModel.setLocation(latLng.lat(), latLng.lng());
							cityModel.setScale(map.getZoom());
							var newCityForm = new bus.admin.mvp.view.cities.CUCityForm(self._presenter,	false, cityModel);
							newCityForm.open();
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

		/**
		 * Добавляет на карту маркер-город.
		 * @param  id {Integer}   ID города.
		 * @param  lat {Number}  Широта
		 * @param  lon {Number}  Долгота
		 */
		insertCityMarker : function(id, lat, lon) {
			var self = this;
			var marker = new google.maps.Marker({
				position : new google.maps.LatLng(lat, lon),
				map : this.getGoogleMap().getMapObject()
			});
			marker.setDraggable(false);
			marker.set("id", id);

			google.maps.event.addListener(marker, "click", function(
				mouseEvent) {
			if(self._presenter.getDataStorage().getState() == "none"){
				var selectedCityID = marker.get("id");
				self._presenter.selectCityTrigger(selectedCityID, null, self);
			}

			});
			this.__markers.push(marker);
		},

		/**
		 * Удаляет маркер-город
		 * @param  id {Integer}   ID города.
		 */
		deleteMarker : function(id) {
			for (var i = 0; i < this.__markers.length; i++) {
				if (this.__markers[i].get("id") == id) {
					this.__markers[i].setMap(null);
					this.__markers.slice(i, 1);
					return;
				}
			}
		},

		
		/**
		 * Удаляет с карты все маркеры.
		 */
		deleteAllMarkers : function() {
			for (var i = 0; i < this.__markers.length; i++) {
				this.__markers[i].setMap(null);
			}
		this.__markers = [];
		},

		/**
		 * Обновляет местоположение маркера-города на карте 
		 * @param  id {Integer}  ID города
		 * @param  lat {Number}  Широта
		 * @param  lon {Number}  Долгота
		 */
		updateMarker : function(id, lat, lon) {
			for (var i = 0; i < this.__markers.length; i++) {
				if (this.__markers[i].get("id") == id) {
					var marker = this.__markers[i];
					marker.setPosition(new google.maps.LatLng(lat, lon));
					return;
				}
			}
		},

		/**
		 * Обновляет элементы карты
		 */
		refreshMap : function() {
			this.debug("refreshMap");
			for (var i = 0; i < this.__markers.length; i++) {
				this.__markers[i].setMap(this.getGoogleMap().getMapObject());
			}
		}

}
});