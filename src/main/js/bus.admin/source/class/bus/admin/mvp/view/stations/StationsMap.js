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
 * Виджет карты для страницы {@link bus.admin.mvp.view.Stations Stations}
 */
 qx.Class.define("bus.admin.mvp.view.stations.StationsMap", {
 	extend : qx.ui.container.Composite,

 	construct : function(presenter) {
 		this.__presenter = presenter;
 		this.base(arguments);
 		this.setLayout(new qx.ui.layout.Dock());
 		this.__initWidgets();
 		this.__stationMarkers = {};
 		presenter.addListener("select_city", this.__onSelectCity, this);
 		presenter.addListener("load_stations_list", this.__onLoadStationsList, this);
 		presenter.addListener("select_station", this.__onSelectStation, this);
 		presenter.addListener("insert_station", this.__onInsertStation, this);
 		presenter.addListener("update_station", this.__onUpdateStation, this);
 		presenter.addListener("remove_station", this.__onRemoveStation, this);


	},
	properties : {
		googleMap : {
			nullable : true
		},
		minZoom : {
			init : 13,
			check : "Integer"
		}
	},
	members : {
		
		__presenter : null,

		__stationMarkers : null,

		__stationIcon : null,

		__selectStationIcon : null,

		/**
		 * Обработчик события  {@link bus.admin.mvp.presenter.StationsPresenter#select_city select_city} вызывается при выборе пользователем города.
		 * @param  e {qx.event.type.Data} Данные события. Структуру свойств смотрите в описании события.
		 */
		 __onSelectCity : function(e){
		 	this.debug("execute __onSelectCity() event handler");
		 	var cityModel = e.getData().city;
		 	if(cityModel == null)
		 		return;
		 	this.getGoogleMap().setCenter(cityModel.getLocation().getLat(), 
		 		cityModel.getLocation().getLon(),cityModel.getScale());

		 },

		/**
		 * Обработчик события {@link bus.admin.mvp.presenter.StationsPresenter#load_stations_list load_stations_list}
		 * @param  e {qx.event.type.Data} Данные события. Структуру свойств смотрите в описании события.
		 */
		 __onLoadStationsList : function(e){
		 	this.debug("execute __onLoadStationsList() event handler");
		 	this.__loadStationsFromBox();
		 	this.__refreshMarkersVisibility();
		 },

		/**
		 * Обработчик события {@link bus.admin.mvp.presenter.StationsPresenter#select_station select_station}
		 * @param  e {qx.event.type.Data} Данные события. Структуру свойств смотрите в описании события.
		 */
		 __onSelectStation : function(e){
		 	this.debug("execute __onSelectStation() event handler");
		 	this.__selectStation(e.getData().station, e.getData().prevStation);

		 },

		/**
		 * Обработчик события {@link bus.admin.mvp.presenter.StationsPresenter#insert_station insert_station}
		 * @param  e {qx.event.type.Data} Данные события. Структуру свойств смотрите в описании события.
		 */
		 __onInsertStation : function(e) {
		 	this.debug("execute __onInsertStation() event handler");
		 	var station = e.getData().station;
		 	var langID = this.__presenter.getDataStorage().getCurrNamesLangID();
		 	this.insertStation(station.getId(), station.getLocation(), station.getName(langID));
		 },

		/**
		 * Обработчик события {@link bus.admin.mvp.presenter.StationsPresenter#update_station update_station}
		 * @param  e {qx.event.type.Data} Данные события. Структуру свойств смотрите в описании события.
		 */
		 __onUpdateStation : function(e) {
		 	this.debug("execute __onUpdateStation() event handler");
		 	var station = e.getData().newStation;
		 	var langID = this.__presenter.getDataStorage().getCurrNamesLangID();
		 	this.insertStation(station.getId(), station.getLocation(), station.getName(langID));

		 },

		/**
		 * Обработчик события {@link bus.admin.mvp.presenter.StationsPresenter#remove_station remove_station}
		 * @param  e {qx.event.type.Data} Данные события. Структуру свойств смотрите в описании события.
		 */
		 __onRemoveStation : function(e) {
		 	this.debug("execute __onRemoveStation() event handler");
		 	this.removeStation(e.getData().stationID);
		 },

		 /**
		  * Выделяет остановку на карте.
		  * @param  station {bus.admin.mvp.model.StationModel}  Модель станции
		  * @return {[type]}         [description]
		  */
		  __selectStation : function(station, prevStation){
		  	this.debug("execute selectStation()");
		  	if(station == null && prevStation != undefined)
		  	{
		  		var marker = this.__stationMarkers[prevStation.getId()];
		  		if(marker != undefined)
		  			marker.setIcon(this.__stationIcon);
		  	}else
		  	if(station != null)
		  	{
		  		if( prevStation != undefined){
		  			var prevMarker = this.__stationMarkers[prevStation.getId()];
		  			if(prevMarker != undefined)
		  				prevMarker.setIcon(this.__stationIcon);
		  			console.debug(prevStation);
		  			console.debug(prevMarker);
		  		}

		  		var langID =  this.__presenter.getDataStorage().getCurrNamesLangID();
		  		var marker = this.insertStation(station.getId(), station.getLocation(), station.getName(langID));
		  		marker.setIcon(this.__selectStationIcon);

		  		var zoom = this.getMinZoom() + 1;
		  		var map = this.getGoogleMap().getMapObject();
		  		if(map!= null && map.getZoom() > zoom)
		  			zoom = map.getZoom();
		  		this.getGoogleMap().setCenter(station.getLocation().getLat(), station.getLocation().getLon(), zoom);
		  	}
		  },

		/**
		 * В зависимости от того, какой масштаб у карты, скрывает или показывает остановки на карте. 
		 */
		 __refreshMarkersVisibility : function(){
		 	var map = this.getGoogleMap().getMapObject();
		 	if (map == null)
		 		return;
		 	if (this.getMinZoom() >= map.getZoom()) {
		 		for(var id in this.__stationMarkers){
		 			this.__stationMarkers[id].setMap(null);
		 		}
		 	}
		 	else{
		 		for(var id in this.__stationMarkers){
		 			var marker = this.__stationMarkers[id];
		 			if(marker.getMap() == undefined)
		 				marker.setMap(map);
		 		}
		 	}
		 },

		/**
		 * С помощью презентера загружает остановки, которые располагаются в видимой части карты. Затем добавляет их
		 * на карту.
		 */
		 __loadStationsFromBox : function(){
		 	this.debug("execute loadStationsFromBox()");
		 	var map = this.getGoogleMap().getMapObject();
		 	if (map == null)
		 		return;
		 	if (this.getMinZoom() >= map.getZoom()) {
		 		return;
		 	}
		 	var p1 = {
		 		x : map.getBounds().getSouthWest().lat(),
		 		y : map.getBounds().getSouthWest().lng()
		 	};
		 	var p2 = {
		 		x : map.getBounds().getNorthEast().lat(),
		 		y : map.getBounds().getNorthEast().lng()
		 	};
		 	var callback = qx.lang.Function.bind(function(data) {
		 		this.insertStations(data.stations);

		 	}, this);
		 	this.__presenter.loadStationsFromBox(p1, p2, callback);
		 },


		/**
		 * Выводит остановки на карту
		 * @param  stationsModel {bus.admin.mvp.model.StationsBoxModel}  Остановки.
		 */
		 insertStations : function(stationsModel){
		 	this.debug("execute insertStations()");
		 	var stations = stationsModel.getAll();
		 	var stDict = {};
		 	for (var i = 0; i < stations.length; i++) {
		 		stDict[stations[i].getId()] = true;
		 		this.insertStation(stations[i].getId(), stations[i].getLocation(), stations[i].getName());
		 	}

		 },


		/**
		 * Выводит остановку на карте.
		 * @param  stID {Integer}  ID остановки
		 * @param  stLocation {Object}  местоположение. Объект имеет функции getLat() и getLon()
		 * @param  stName {String} Назание остановки   
		 */
		 insertStation : function(stID, stLocation, stName) {
		 	var marker = this.__stationMarkers[stID];
		 	if(marker == undefined){
		 		marker = new google.maps.Marker({
		 			map : this.getGoogleMap().getMapObject(),
		 			icon : this.__stationIcon

		 		});
		 		marker.setDraggable(false);
		 		marker.set("id", stID);

		 		var self = this;
		 		google.maps.event.addListener(marker, "click",
		 			function(mouseEvent) {
		 				var stationID = marker.get("id");
		 				var callback = function(data){
		 					if(data.error == true || data.station == undefined)
		 						return;
		 					var changeStationDlg = new bus.admin.mvp.view.stations.CUStationForm(
		 						self.__presenter, true, data.station);
		 					changeStationDlg.open();
		 				};
		 				self.__presenter.getStation(stationID, callback);


		 			});
		 		this.__stationMarkers[stID] = marker;
		 	}

		 	marker.setPosition(new google.maps.LatLng(stLocation.getLat(), stLocation.getLon()));
		 	marker.setTitle(stName);
		 	return marker;
		 },

		 /**
		 * Удаляет остановку с карты.
		 * @param  stID {Integer}  ID остановки
		  */
		 removeStation : function(stID) {
		 	var marker = this.__stationMarkers[stID];
		 	if(marker != undefined)
		 	{
		 		marker.setMap(null);
		 		delete this.__stationMarkers[stID];
		 	}
		 },

	    /**
		 * Создает контекстное меню карты. Функцию можно вызывать только после отрисовки (когда наступит событие appear) виджета карты.
		 * @param  map {bus.admin.widget.GoogleMap}  Виджет карты
	     * @return {ContextMenu} Контекстное меню
	     */
	     __createMapContextMenu : function(mapWidget){
	     	var map = mapWidget.getMapObject();
	     	if(map == null)
	     		return;
	     	var contextMenuOptions = {};
	     	contextMenuOptions.classNames = {
	     		menu : 'context_menu',
	     		menuSeparator : 'context_menu_separator'
	     	};

	     	var menuItems = [];
	     	menuItems.push({
	     		className : 'context_menu_item',
	     		eventName : 'insert_station_click',
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
	     	menuItems.push({
	     		className : 'context_menu_item',
	     		eventName : 'center_map_click',
	     		label : 'Center map here'
	     	});
	     	contextMenuOptions.menuItems = menuItems;
	     	var contextMenu = new ContextMenu(map, contextMenuOptions);
	     	return contextMenu;
	     },

	    /**
	     * Обработчик события "appear" виджета карты. 
	     */
	     __onMapAppear : function(){
	     	var map = this.getGoogleMap().getMapObject();
	     	if(map == null)
	     		return;
	     	var contextMenu = this.__createMapContextMenu(this.getGoogleMap());
	     	this.refresh();
	     	var self = this;
	     	google.maps.event.addListener(map, 'dragend', function() {
	     		self.__loadStationsFromBox();
	     	});
	     	google.maps.event.addListener(map, 'idle', function() {
	     		self.__loadStationsFromBox();
	     		self.__refreshMarkersVisibility();
	     	});
	     	google.maps.event.addListener(map, 'zoom_changed', function() {
	     		self.__loadStationsFromBox();
	     		self.__refreshMarkersVisibility();
	     	});
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
	     			self.__onMenuItemSelected(latLng, eventName);
	     		});
	     },

	    /**
	     * Обработчик события выбора элемента контекстного меню карты.
	     * @param  latLng {Object}     Положение клика мыши
	     * @param  eventName {String}  Элемент конт. меню.
	     */
	     __onMenuItemSelected : function(latLng, eventName) {
	     	var map = this.getGoogleMap().getMapObject();
	     	switch (eventName) {
	     		case 'insert_station_click' :
	     		this.debug("insert_station_click()");
	     		var dataStorage = this.__presenter.getDataStorage();
	     		var stationMoel = new bus.admin.mvp.model.StationModel();
	     		stationMoel.setCityID(dataStorage.getSelectedCityID());
	     		stationMoel.setLocation(latLng.lat(), latLng.lng());
	     		var insertStationDlg = new bus.admin.mvp.view.stations.CUStationForm(
	     			this.__presenter, false, stationMoel);
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
	     },    


	    /**
	     * Инициализация дочерних иджетов
	     */
	     __initWidgets : function() {
	     	this.__stationIcon = new google.maps.MarkerImage('resource/bus/admin/images/map/stop.png');
	     	this.__selectStationIcon = new google.maps.MarkerImage('resource/bus/admin/images/map/stop_selected.png');
	     	this.setGoogleMap(new bus.admin.widget.GoogleMap());
	     	this.getGoogleMap().init(50, 30, 5);

	     	this.add(this.getGoogleMap(), {
	     		edge : "center"
	     	});
	     	this.getGoogleMap().addListenerOnce("appear", this.__onMapAppear, this);
	     },

		/**
		 * Перерисовывает карту и ее элементы. 
		 */
		 refresh : function() {
		 	this.__refreshMarkersVisibility();
		 	if (this.__selectedMarker != null
		 		&& this.__selectedMarker.getMap() == null) 
		 	{
		 		var map = this.getGoogleMap().getMapObject();
		 		this.__selectedMarker.setMap(map);
		 	}
		 }



		}
	});