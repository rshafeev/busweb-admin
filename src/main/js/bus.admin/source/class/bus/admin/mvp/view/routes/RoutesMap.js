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
 */

/**
 #asset(bus/admin/images/map/stop.png)
 #asset(bus/admin/images/map/stop_selected.png)
 #asset(bus/admin/images/map/stop_new.png)
 */

/**
 * Виджет карты для страницы {@link bus.admin.mvp.view.Routes Routes}
 */
 qx.Class.define("bus.admin.mvp.view.routes.RoutesMap", {
 	extend : qx.ui.container.Composite,

 	/**
     * @param  presenter   {bus.admin.mvp.presenter.RoutesPresenter}  Presenter   
     */
     construct : function(presenter) {
     	this.base(arguments);
     	this.__presenter = presenter;
     	this.__markers = {};
     	this.__polylines = [];
     	this.__initWidgets();
     	presenter.addListener("select_city", this.__onSelectCity, this);
     	presenter.addListener("load_routes_list", this.__onLoadRoutesList, this);
     	presenter.addListener("select_route", this.__onSelectRoute, this);
     	presenter.addListener("change_direction", this.__onChangeDirection, this);
     	presenter.addListener("change_state", this.__onChangeState, this);
     	presenter.addListener("insert_prepared_station", this.__onInsertPreparedStation, this);
     	presenter.addListener("update_prepared_station",this.__onUpdatePreparedStation, this);
     	presenter.addListener("update_way_relations",this.__onUpdateWayRelations, this);


     },
     properties : {
		/**
 		 * Виджет Google карты
 		 */
 		 googleMap : {
 		 	nullable : true,
 		 	check : "bus.admin.widget.GoogleMap"
 		 },

		/**
		 * Минимальный масштаб, при котором отображаются станции на карте. Если масштаб карты будет меньше данного значения,
		 * то станции будут убраны с карты.
		 * @type {Object}
		 */
		 minZoom : {
		 	init : 13,
		 	check : "Integer"
		 },

		 /**
		  * Максимальное кол-во маркеров на карте.
		  * @type {Integer}
		  */
		  maxMarkersCount : {
		  	init : 400,
		  	check : "Integer"
		  }

		},
		members : {
 		/**
 		 * Presenter
 		 * @type {bus.admin.mvp.presenter.RoutesPresenter}
 		 */		
 		 __presenter : null,


 		 /**
 		  * Словарь маркеров станций, google.maps.Marker. Key - ID станции
 		  * @type {Object}
 		  */
 		  __markers : null,



 		 /**
 		  * Массив полилиний, google.maps.Polyline
 		  * @type {Object}
 		  */
 		  __polylines : null,

 		 /**
 		  * Иконка свободной станции, google.maps.MarkerImage
 		  * @type {Obejct}
 		  */
 		  __stationIcon : null,

 		 /**
 		  * Иконка станции маршрута, google.maps.MarkerImage
 		  * @type {Obejct}
 		  */
 		  __routeStationIcon : null,

 		 /**
 		  * Иконка  "prepared" станции, google.maps.MarkerImage
 		  * @type {Obejct}
 		  */
 		  __preparedStationIcon : null,


		/**
		 * Обработчик события  {@link bus.admin.mvp.presenter.RoutesPresenter#update_way_relations update_way_relations} 
		 * вызывается при изменении пути.
		 * @param  e {qx.event.type.Data} Данные события. Структуру свойств смотрите в описании события.
		 */
		 __onUpdateWayRelations : function(e){
		 	this.debug("execute __onUpdateWayRelations() event handler.");
		 	if(e.getData().sender == this)
		 		return;
		 	var relation = e.getData().relation;
		 	var operation = e.getData().operation;
		 	var canChange = this.__presenter.getDataStorage().getState() == "make" ? true : false;
		 	var stB = relation.getCurrStation();
		 	var geom = relation.getGeom();
		 	
		 	if(operation == "insert"){
		 		this.__drawRouteStation(relation.getCurrStation());
		 		if(geom != undefined){
		 			this.__insertPolyLine(geom, stB, 'red', canChange);
		 		}
		 	}
		 	
		 	if(operation == "remove"){
		 		if(stB.getId() < 0)
		 			this.__drawPreparedStation(stB);
		 		else{
		 			this.__drawFreeStation(stB);
		 		}
		 		if(geom != undefined){
		 			this.__removePolyline(stB.getId());
		 		}
		 	}

		 	if(operation == "update"){
		 		if(geom != undefined ){
		 			var path = this.__makePathFromPolyline(geom, stB.getId());
		 			var polyline = this.__getPolyline(stB.getId());
		 			polyline.setPath(path);
		 		}else{
		 			this.__removePolyline(stB.getId());
		 		}
		 		
		 	}		 			 		
		 },


		/**
		 * Обработчик события  {@link bus.admin.mvp.presenter.RoutesPresenter#update_prepared_station update_prepared_station} 
		 * вызывается при изменении "prepared" станции.
		 * @param  e {qx.event.type.Data} Данные события. Структуру свойств смотрите в описании события.
		 */
		 __onUpdatePreparedStation : function(e){
		 	this.debug("execute __onUpdatePreparedStation()");
		 	var stationModel = e.getData().station;
		 	console.debug(stationModel.toDataModel());
		 	var langID = qx.core.Init.getApplication().getDataStorage().getLocale();
		 	this.debug(langID);
		 	var marker = this.__markers[stationModel.getId()];
		 	
		 	this.debug(stationModel.getName(langID));
		 	marker.setVisible(false);
		 	marker.setTitle(stationModel.getName(langID));
		 	marker.setVisible(true);
		 	console.debug(marker);
		 	if(e.getData().sender == this)
		 		return;
		 	marker.setPosition(new google.maps.LatLng(stationModel.getLocation().getLat(), stationModel.getLocation().getLon()));
		 	
		 },
		/**
		 * Обработчик события  {@link bus.admin.mvp.presenter.RoutesPresenter#insert_prepared_station insert_prepared_station} 
		 * вызывается при добавлении "prepared" станции.
		 * @param  e {qx.event.type.Data} Данные события. Структуру свойств смотрите в описании события.
		 */
		 __onInsertPreparedStation : function(e){
		 	var stationModel = e.getData().station;
		 	this.__drawPreparedStation(stationModel);

		 },

		  /**
		   * Добавляет станцию на карту.
		   * @param  stationModel {bus.admin.mvp.model.StationModelEx}  Модель станции.
		   * @param options {Map} Опции маркера
		   * @return {Object}     Возвращает gmaps маркер.
		   */
		   __insertStation : function (stationModel, options)
		   {
		   	var marker = this.__markers[stationModel.getId()];
		   	var langID = qx.core.Init.getApplication().getDataStorage().getLocale();

		   	if(marker == undefined){
		   		var map  = this.getGoogleMap().getMapObject();
		   		var draggable = (options != undefined && options.draggable != undefined) ? options.draggable : false;
		   		marker = new google.maps.Marker({
		   			position : new google.maps.LatLng(stationModel.getLocation().getLat(), stationModel.getLocation().getLon())
		   		});
		   		marker.set("id", stationModel.getId());
		   		marker.set("events",{});
		   		marker.set("station", stationModel);
		   		marker.setDraggable(draggable);
		   		if (this.getMinZoom() >= map.getZoom()) {
		   			marker.setMap(null);
		   		}
		   		else{
		   			marker.setMap(map);
		   		}
		   		this.__markers[stationModel.getId()] = marker;
		   	}
		   	if(options != undefined)
		   		marker.setOptions(options);
		   	marker.setPosition(new google.maps.LatLng(stationModel.getLocation().getLat(), stationModel.getLocation().getLon()));
		   	marker.setTitle(stationModel.getName(langID));
		   	return marker;
		   },

		  /**
		   * Добавляет "prepared" станцию на карту.
		   * @param  stationModel {bus.admin.mvp.model.StationModelEx}  Модель станции.
		   * @return {Object}     Возвращает gmaps маркер.
		   */
		   __drawPreparedStation : function(stationModel){
		   	this.debug("execute __drawPreparedStation()");
		   	var marker = this.__markers[stationModel.getId()];
		   	if(marker != undefined && marker.get("type") == "prepared"){
		   		this.debug("__drawPreparedStation(): return;");
		   		return;
		   	}
		   	
		   	var options = {
		   		icon : this.__preparedStationIcon,
		   		draggable : true
		   	};
		   	if(marker == undefined){
		   		marker = this.__drawFreeStation(stationModel, options);
		   	}else{
		   		marker.setOptions(options);
		   	}
		   	var self = this;
		   	google.maps.event.removeListener(marker.get("events").rightclick);
		   	var rightclick = google.maps.event.addListener(marker, "rightclick", function(mouseEvent) {
		   		var langsModel = self.__presenter.getDataStorage().getLangsModel();
		   		var cityModel = self.__presenter.getDataStorage().getSelectedCity();
		   		var stationModel = marker.get("station");
		   		var dlg = new bus.admin.mvp.view.stations.StationForm(stationModel, langsModel, cityModel, true);
		   		dlg.addListener("prepared_model", function(e){
		   			var newStationModel = e.getData().station;
		   			if(newStationModel == null || e.getData().cancel == true){
		   				dlg.close();
		   				return;
		   			}
		   			var callback = function(data){
		   				if (data.error == true) {
		   					var msg = data.errorInfo != undefined ? this.tr("Error! ") + data.errorInfo : 
		   					this.tr("Error! Can not save station. Please, check input data.");
		   					bus.admin.widget.MsgDlg.info(msg);
		   					return;
		   				}
		   				dlg.close();
		   			};
		   			this.__presenter.updatePreparedStationTrigger(newStationModel, callback, this);
		   		}, self);
		   		dlg.open();
		   	});
			// Сохраним ссылку на обработчик
			marker.get("events").rightclick = rightclick;

			// Добавим обработчик на событие прекращения перемещения маркера
			google.maps.event.removeListener(marker.get("events").dragend);
			var dragend = google.maps.event.addListener(marker, "dragend", function(mouseEvent) {
				var stationModel = marker.get("station");
				stationModel.setLocation(marker.getPosition().lat(),marker.getPosition().lng());
				self.__presenter.updatePreparedStationTrigger(stationModel, null, self);
			});
			marker.get("events").dragend = dragend;
			marker.set("type", "prepared");
			// вернем созданный маркер
			return marker;
		},

		  /**
		   * Добавляет "route" станцию на карту.
		   * @param  stationModel {bus.admin.mvp.model.StationModelEx}  Модель станции.
		   * @return {Object}     Возвращает gmaps маркер.
		   */
		   __drawRouteStation : function(stationModel){
		   	var marker = this.__markers[stationModel.getId()];
		   	var options = {
		   		icon : this.__routeStationIcon
		   	};
		   	if(marker == undefined && stationModel.getId() > 0){
		   		marker = this.__drawFreeStation(stationModel, options);
		   	}else
		   	if(marker == undefined){
		   		marker = this.__drawPreparedStation(stationModel);
		   	}else{
		   		marker.setOptions(options);
		   	}
		   	marker.set("type", "route");
		   	
		   },


		  /**
		   * Добавляет "free" станцию на карту.
		   * @param  stationModel {bus.admin.mvp.model.StationModelEx}  Модель станции.
		   * @param options {Map} Опции маркера
		   * @return {Object}     Возвращает gmaps маркер.
		   */
		   __drawFreeStation : function(stationModel, options){
		   	if(options == undefined )
		   		options = {};
		   	if(options.icon == undefined)
		   		options.icon = this.__stationIcon;
		   	var marker = this.__insertStation(stationModel, options);

		   	if(marker.get("type") != "free"){
		   		var events = marker.get("events");
		   		for(var evt in events){
		   			google.maps.event.removeListener(events[evt]);
		   		}
		   		events = {};
		   		var self = this;
		   		var clickListener = google.maps.event.addListener(marker, "click", function(
		   			mouseEvent) {
		   			var state = self.__presenter.getDataStorage().getState();
		   			if(state != "make")
		   				return;
		   			var stationModel = marker.get("station");
		   			var relations = self.__presenter.getDataStorage().getSelectedWay().getRelations();
		   			var position = 0;
		   			if(relations != undefined)
		   				position = relations.length;
		   			self.__presenter.includeStationToRouteWayTrigger(stationModel, position);
		   			stationModel.location = {
		   				x : mouseEvent.latLng.lat(),
		   				y : mouseEvent.latLng.lng()
		   			};
		   		});
		   		events.click = clickListener;
		   		marker.set("events", events);
		   		marker.set("type","free");
		   	}
		   	return marker;

		   },

		/**
		 * Обработчик события  {@link bus.admin.mvp.presenter.RoutesPresenter#select_city select_city} вызывается при выборе пользователем города.
		 * @param  e {qx.event.type.Data} Данные события. Структуру свойств смотрите в описании события.
		 */
		 __onSelectCity : function(e){
		 	this.debug("execute __onSelectCity() event handler");
		 	var cityModel = e.getData().city;
		 	this.clearMapObjects();
		 	if(e.getData().centering_map == true){
		 		this.getGoogleMap().setCenter(cityModel.getLocation().getLat(), 
		 			cityModel.getLocation().getLon(),cityModel.getScale());
		 	}

		 },

		/**
		 * Обработчик события  {@link bus.admin.mvp.presenter.RoutesPresenter#load_routes_list load_routes_list} вызывается при 
		 * изменении города или типа транспорта.
		 * @param  e {qx.event.type.Data} Данные события. Структуру свойств смотрите в описании события.
		 */
		 __onLoadRoutesList : function(e){
		 	this.debug("execute __onSelectCity() event handler");
		 	var cityModel = e.getData().city;
		 	this.clearMapObjects();
		 	
		 },

		 /**
		 * Обработчик события  {@link bus.admin.mvp.presenter.RoutesPresenter#select_route select_route} вызывается при выборе 
		 * пользователем маршрута.
		 * @param  e {qx.event.type.Data} Данные события. Структуру свойств смотрите в описании события.
		 */
		 __onSelectRoute : function (e){
		 	this.debug("execute __onSelectRoute() event handler");
		 	var routeModel = e.getData().route;
		 	this.clearMapObjects();
		 	this.__drawPreparedStations();
		 	if(routeModel != null){
		 		console.debug(routeModel.toDataModel());
		 		var isCentering = e.getData().centering_map;
		 		var direction = this.__presenter.getDataStorage().getDirection();	
		 		var wayModel = routeModel.getWayByDirection(direction);
		 		if(wayModel != undefined)
		 			this.__drawRouteWay(wayModel, isCentering);

		 	}
		 	this.__loadStationsFromBox();

		 },

		 /**
		 * Обработчик события  {@link bus.admin.mvp.presenter.RoutesPresenter#change_state change_state} вызывается при изменении состояния страницы.
		 * @param  e {qx.event.type.Data} Данные события. Структуру свойств смотрите в описании события.
		 */
		 __onChangeState : function (e){
		 	this.debug("execute __onChangeState() event handler");
		 	var state = e.getData().newState;
		 	this.__setState(state);

		 },


		 /**
		  * Задать виджету состояние
		  * @param  state {String} Состояние
		  */
		  __setState : function(state){
		  	var menuItems = [];
		  	menuItems.push({});
		  	menuItems.push({
		  		className : 'context_menu_item',
		  		eventName : 'zoom_in_click',
		  		label : this.tr('Zoom in')
		  	});
		  	menuItems.push({
		  		className : 'context_menu_item',
		  		eventName : 'zoom_out_click',
		  		label : this.tr('Zoom out')
		  	});
		  	menuItems.push({
		  		className : 'context_menu_item',
		  		eventName : 'center_map_click',
		  		label : this.tr('Center map here')
		  	});

		  	if(state == "none"){
		  		this.removeStationsByType("free");
		  		this.removeStationsByType("prepared");
		  	} 
		  	if(state == "make"){
		  		menuItems.unshift({
		  			className : 'context_menu_item',
		  			eventName : 'insert_station_click',
		  			label : this.tr('Insert station')
		  		});
		  	}
		  	this.__setContextMenuItems(menuItems);
		  },

		 /**
		  * Возвращает кол-во маркеров, отображенных на карте
		  * @return {Integer} Кол-во маркеров.
		  */
		  getMarkersCount : function(){
		  	var count = Object.keys(this.__markers).length;
		  	return count;
		  },

		 /**
		  * Удаляет станции.
		  * @param type {String} Тип станции. Возможные значения: "route", "free", "prepared"
		  */
		  removeStationsByType : function(type){
		  	this.debug("execute removeStationsByType(" + type +  ")");
		  	for(var id in this.__markers){
		  		var marker = this.__markers[id];
		  		if(marker.get("type") == type){
		  			this.__removeMapObject(marker);
		  			delete this.__markers[id];
		  		}
		  	}
		  },

		/**
		 * С помощью презентера загружает остановки, которые располагаются в видимой части карты. Затем добавляет их
		 * на карту.
		 */
		 __loadStationsFromBox : function(){
		 	var state = this.__presenter.getDataStorage().getState();
		 	if(state != "make")
		 		return;

		 	this.debug("execute loadStationsFromBox()");
		 	var map = this.getGoogleMap().getMapObject();
		 	if (map == null)
		 		return;
		 	if (this.getMinZoom() >= map.getZoom()) {
		 		return;
		 	}
		 	var cityID = this.__presenter.getDataStorage().getSelectedCityID();
		 	var langID = qx.core.Init.getApplication().getDataStorage().getLocale();
		 	var p1 = new bus.admin.mvp.model.geom.PointModel();
		 	p1.setLat(map.getBounds().getSouthWest().lat());
		 	p1.setLon(map.getBounds().getSouthWest().lng());
		 	var p2 = new bus.admin.mvp.model.geom.PointModel();
		 	p2.setLat(map.getBounds().getNorthEast().lat());
		 	p2.setLon(map.getBounds().getNorthEast().lng());
		 	var callback = qx.lang.Function.bind(function(data) {
		 		if(this.getMarkersCount() > this.getMaxMarkersCount()){
		 			this.removeStationsByType("free");
		 		}
		 		var stations = data.stationsBox.getStations();
		 		for (var i = 0; i < stations.length; i++) {
		 			var marker = this.__markers[stations[i].getId()];
		 			if(marker == undefined)
		 				this.__drawFreeStation(stations[i].toModelEx(langID));
		 		}
		 	}, this);
		 	this.__presenter.loadBoxStations(p1, p2, cityID, langID, callback);
		 },

		/**
		 * Cоздает контекстное меню карты
		 * @param  menuItems {Object[]}   Элементы меню
		 */
		 __setContextMenuItems : function(menuItems) {
		 	var map = this.getGoogleMap().getMapObject();
		 	if (map == null)
		 		return;
		 	this.getGoogleMap().setContextMenu(menuItems);

		 	var contextMenu = this.getGoogleMap().getContextMenu();
		 	var self = this;
		 	google.maps.event.addListener(contextMenu, 'menu_item_selected',
		 		function(latLng, eventName) {
		 			switch (eventName) {
		 				case 'insert_station_click' :
		 				self.__onMenuInsertStation(latLng);
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

		 },

		 /**
		 * Обработчик события  {@link bus.admin.mvp.presenter.RoutesPresenter#change_direction change_direction} вызывается при изменении 
		 * направления.
		 * @param  e {qx.event.type.Data} Данные события. Структуру свойств смотрите в описании события.
		 */
		 __onChangeDirection : function(e){
		 	this.debug("execute __onChangeDirection() event handler");
		 	
		 	// Отрисуем все "prepared" станции
		 	this.__drawPreparedStations();

		 	// Все станции старого пути сделаем "free"
		 	for(var id in this.__markers){
		 		var m = this.__markers[id];
		 		if(m.get("type") == "route"){
		 			this.__drawFreeStation(m.get("station"));
		 		}
		 	}

		 	// Отрисуем текущий путь
		 	var wayModel =  this.__presenter.getDataStorage().getSelectedWay();
		 	this.__removeAllPolylines();
		 	if(wayModel != null){
		 		this.__drawRouteWay(wayModel, false);
		 	}

		 	// Подгрузим станции
		 	this.__loadStationsFromBox();
		 },

		 /**
		  * Отрисовует на карте "prepared" станции. (Если страница не находится в состоянии "make", добавление станций не будет выполнено).
		  */
		  __drawPreparedStations : function(){
		  	var state = this.__presenter.getDataStorage().getState();
		  	if(state != "make")
		  		return;
		  	var stations = this.__presenter.getDataStorage().getFreePreparedStations();
		  	for(var i=0;i < stations.length; i++){
		  		this.__drawPreparedStation(stations[i]);
		  	}
		  },


		 /**
		  * Отрисовка пути на карте
		  * @param routeWayModel {bus.admin.mvp.model.route.RouteWayModel}  Модель пути
		  * @param isCentering {Boolean}   Центрировать карту?
		  */
		  __drawRouteWay : function (routeWayModel, isCentering)
		  {
		  	var relations = routeWayModel.getRelations();
		  	if(relations == undefined)
		  		return;
		  	var canChange = this.__presenter.getDataStorage().getState() == "make" ? true : false;
		  	
		  	if (isCentering == true)
		  	{
		  		var bounds = new google.maps.LatLngBounds();
		  		var map = this.getGoogleMap().getMapObject();

		  		for (var i = 0; i < relations.length; i++) {
		  			var st = relations[i].getCurrStation();
		  			bounds.extend(new google.maps.LatLng(
		  				st.getLocation().getLat(),
		  				st.getLocation().getLon()));

		  		}
		  		map.fitBounds(bounds);
		  	}

		  	for (var i = 1; i < relations.length; i++) {
		  		var stB = relations[i].getCurrStation();
		  		var polyLine = relations[i].getGeom();
		  		this.__insertPolyLine(polyLine, stB, 'red', canChange);
		  	}
		  	for (var i = 0; i < relations.length; i++) {
		  		var st = relations[i].getCurrStation();
		  		this.__drawRouteStation(st);
		  	}

		  },




		/**
		 * Удаляет объекты (станции, полилинии) на карте.
		 */
		 clearMapObjects : function() {
		 	this.__removeAllStations();
		 	this.__removeAllPolylines();
		 },


		/**
		 * Удаляет полилинии.
		 */
		 __removeAllPolylines : function() {
		 	for (var i = 0; i < this.__polylines.length; i++) {
		 		this.__removeMapObject(this.__polylines[i]);
		 	}
		 	this.__polylines = [];
		 },

		 /**
		  * Удаляет объект карты(маркер, полилиния) с карты и все его обработчики событий.
		  * @param  mapObj {Object}  Объект карты
		  */
		  __removeMapObject : function(mapObj){
		  	mapObj.setMap(null);
		  	google.maps.event .clearInstanceListeners(mapObj);
		  	if(typeof(mapObj.getPath) == "Function"){
		  		var path = mapObj.getPath();
		  		google.maps.event .clearInstanceListeners(path);
		  	}
		  },


		/**
		 * Удаляет станции.
		 */
		 __removeAllStations : function() {
		 	for (var stationID in this.__markers){
		 		var marker = this.__markers[stationID];
		 		this.__removeMapObject(marker);
		 	}
		 	this.__markers = {};

		 },

		 __makePolylineFromPath : function(path){
		 	var arr =  path.getArray();
		 	var lineData = [];
		 	for(var i=0;i < arr.length; i++){
		 		lineData.push([arr[i].lat(), arr[i].lng()]);
		 	}
		 	var geom = new bus.admin.mvp.model.geom.PolyLineModel();
		 	geom.setPoints(lineData);
		 	return geom;
		 },

		 /**
		  * Создает google.maps path из полилинии 
		  * @param  polylineModel {bus.admin.mvp.model.geom.PolyLineModel}  Медель полилинии
		  * @param  stationBID {Integer} ID конечной станции, к которой привязывается полилиния
		  * @return {Object}     google.maps.MVCArray< google.maps.LatLng>
		  */
		  __makePathFromPolyline : function(polylineModel, stationBID){
		  	if(polylineModel == undefined)
		  		return [];
		  	var points = polylineModel.getPoints();
		  	if(points == undefined)
		  		return [];
		  	var path = new google.maps.MVCArray();
		  	var ds = this.__presenter.getDataStorage();
		  	var self = this;
		  	path.set("stationBID", stationBID);

		  	for (var i = 0; i < points.length; i++) {
		  		var lat = points[i][0];
		  		var lon = points[i][1];

		  		path.push(new google.maps.LatLng(lat, lon));
		  	}

		  	var changePathListener = function() {
		  		var stationBID = path.get("stationBID");
		  		var currRelation = ds.getSelectedWay().getRelationByStationBID(stationBID);
		  		var prevRelation = ds.getSelectedWay().getPrevRelation(currRelation);
		  		var len = path.getLength();

		  		if(prevRelation != undefined && prevRelation.getCurrStation() != undefined && len > 0){
		  			var firstPoint =  path.getArray()[0];
		  			var staLocation = prevRelation.getCurrStation().getLocation();
		  			var p1 = new bus.admin.mvp.model.geom.PointModel({
		  				lat : staLocation.getLat(),
		  				lon : staLocation.getLon()
		  			});
		  			var p2 = new bus.admin.mvp.model.geom.PointModel({
		  				lat : firstPoint.lat(),
		  				lon : firstPoint.lng()
		  			});
		  			if(bus.admin.mvp.model.geom.PointModel.getDistance(p1, p2) > 0.000001){
		  				path.setAt(0, new google.maps.LatLng(p1.getLat(), p1.getLon()));
		  			}
		  		}
		  		if(currRelation != undefined && currRelation.getCurrStation() != undefined&& len > 1){
		  			var lastPoint =  path.getArray()[len-1];
		  			var stbLocation = currRelation.getCurrStation().getLocation();
		  			var p1 = new bus.admin.mvp.model.geom.PointModel({
		  				lat : stbLocation.getLat(),
		  				lon : stbLocation.getLon()
		  			});
		  			var p2 = new bus.admin.mvp.model.geom.PointModel({
		  				lat : lastPoint.lat(),
		  				lon : lastPoint.lng()
		  			});
		  			if(bus.admin.mvp.model.geom.PointModel.getDistance(p1, p2) > 0.000001){
		  				path.setAt(len-1, new google.maps.LatLng(p1.getLat(), p1.getLon()));
		  			}
		  		}
		  		var relationModel = new bus.admin.mvp.model.route.RouteRelationModel();
		  		relationModel.setGeom(self.__makePolylineFromPath(path));
		  		self.__presenter.updateWayRelationTrigger(stationBID, relationModel, null, self);
		  	};
		  	google.maps.event.addListener(path, "insert_at", changePathListener);
		  	google.maps.event.addListener(path, "remove_at", changePathListener);
		  	google.maps.event.addListener(path, "set_at", changePathListener);

		  	return path;
		  },

		  __getPolyline : function(stbID){
		  	var lines = this.__polylines;
		  	if(lines == undefined)
		  		return null;;
		  	for(var i = 0; i < lines.length; i++){
		  		var stB = lines[i].get("stB");
		  		if(stB.getId() == stbID){
		  			return lines[i];
		  		}
		  	}
		  	return null;
		  },

		 /**
		  * Удаляет полилинию
		  * @param  stbID {Integer}  Конечная станция полилинии
		  */
		  __removePolyline : function(stbID){
		  	this.debug("execute __removePolyline(", stbID, ")");
		  	var lines = this.__polylines;
		  	if(lines == undefined)
		  		return;
		  	for(var i = 0; i < lines.length; i++){
		  		var stB = lines[i].get("stB");
		  		if(stB.getId() == stbID){
		  			this.__removeMapObject(lines[i]);
		  			lines.splice(i, 1);
		  			return;
		  		}
		  	}
		  },

		 /**
		  * Добавляет полилинии на карту.
		  * @param polyline {bus.admin.mvp.model.geom.PolyLineModel}  Модель полилинии.
		  * @param  stB {bus.admin.mvp.model.StationModelEx} Конечная станция.
		  * @param  color {String}      Цвет полилинии.
		  * @param  canChange {Boolean}  Возможность редактирования.
		  * @return {Object}  Возвращает  gmaps полилинию.          
		  */
		  __insertPolyLine : function(polyline, stB, color, canChange) {
		  	var line = new google.maps.Polyline({
		  		map : this.getGoogleMap().getMapObject(),
		  		strokeColor : color,
		  		draggable : false
		  	});
		  	line.setPath(this.__makePathFromPolyline(polyline, stB.getId()));

		  	line.setEditable(canChange);
		  	line.set("stB", stB);
		  	this.__polylines.push(line);

		  	return line;
		  },

		  /**
		   * Обработчик события появления карты.
		   */
		   __onAppearGoogleMap : function(){
		   	var map = this.getGoogleMap().getMapObject();
		   	var state = this.__presenter.getDataStorage().getState();
		   	this.__setState(state);
		   	var self = this;
		   	google.maps.event.addListener(map, "dragend", function(
		   		mouseEvent) {
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
		   },


		/**
		 * Инициализация дочерних виджетов
		 */
		 __initWidgets : function() {
		 	this.setLayout(new qx.ui.layout.Dock());
		 	this.__routeStationIcon = new google.maps.MarkerImage('resource/bus/admin/images/map/stop_selected.png');
		 	this.__stationIcon = new google.maps.MarkerImage('resource/bus/admin/images/map/stop.png');
		 	this.__preparedStationIcon = new google.maps.MarkerImage('resource/bus/admin/images/map/stop_new.png');

			// Создадим виджет "GoogleMap"
			this.setGoogleMap(new bus.admin.widget.GoogleMap());
			this.getGoogleMap().init(50, 30, 5);
			this.add(this.getGoogleMap(), {
				edge : "center"
			});
			this.getGoogleMap().addListenerOnce("appear", this.__onAppearGoogleMap, this);

		},


		/**
		 * Обработчик выбора в контекстном меню заголовка "Intest station"
		 * @param  latLng {Object} Точка на карте, на которой было вызвано меню
		 */
		 __onMenuInsertStation : function(latLng) {
		 	this.debug("__onMenuInsertStation()");
		 	var presenter = this.__presenter;
		 	var routeType = presenter.getDataStorage().getSelectedRouteTypeID();
		 	var langsModel = presenter.getDataStorage().getLangsModel();
		 	var cityModel = presenter.getDataStorage().getSelectedCity();
		 	var stationModel = new bus.admin.mvp.model.StationModelEx();
		 	stationModel.setCityID(cityModel.getId());
		 	stationModel.setLocation(latLng.lat(), latLng.lng());

		 	var dlg = new bus.admin.mvp.view.stations.StationForm(stationModel, langsModel, cityModel, false);
		 	dlg.addListener("prepared_model", function(e){
		 		var newStationModel = e.getData().station;
		 		if(newStationModel == null || e.getData().cancel == true){
		 			dlg.close();
		 			return;
		 		}
		 		var callback = function(data){
		 			if (data.error == true) {
		 				var msg = data.errorInfo != undefined ? this.tr("Error! ") + data.errorInfo : 
		 				this.tr("Error! Can not save station. Please, check input data.");
		 				bus.admin.widget.MsgDlg.info(msg);
		 				return;
		 			}
		 			dlg.close();
		 		};
		 		this.__presenter.insertPreparedStationTrigger(newStationModel, callback, this);
		 	}, this);

		 	dlg.open();
		 },


		/**
		 * В зависимости от того, какой масштаб у карты, скрывает или показывает остановки на карте. 
		 */
		 __refreshMarkersVisibility : function(){
		 	var map = this.getGoogleMap().getMapObject();
		 	if (map == null)
		 		return;
		 	if (this.getMinZoom() >= map.getZoom()) {
		 		for(var id in this.__markers){
		 			this.__markers[id].setMap(null);
		 		}
		 	}
		 	else{
		 		for(var id in this.__markers){
		 			var marker = this.__markers[id];
		 			if(marker.getMap() == undefined)
		 				marker.setMap(map);
		 		}
		 	}
		 }

		}
	});