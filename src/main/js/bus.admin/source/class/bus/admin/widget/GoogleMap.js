/*************************************************************************
 *
 * Copyright:
 * Bus.Admin-lib is copyright (c) 2012, {@link http://ways.in.ua} Inc. All Rights Reserved. 
 *
 * License:
 * Bus.Admin-lib is free software, licensed under the MIT license. 
 * See the file {@link http://api.ways.in.ua/license.txt|license.txt} in this distribution for more details.
 *
 * Authors:
 * Roman Shafeyev (rs@premiumgis.com)
 *
 *************************************************************************/
/**
 #asset(bus/admin/css/ContextMenu.css)
 #asset(bus/admin/js/ContextMenu.js)
 */

/**
 * @ignore(google.maps)
 * @ignore(ContextMenu)
 */


/**
 * Виджет Google карты
 */
 qx.Class.define("bus.admin.widget.GoogleMap", {
 	extend : qx.ui.core.Widget,

 	construct : function() {
 		this.base(arguments);
 		this.__center = {};
 	},

 	destruct : function() {
 		this.getMapObject().destroy();
 		this.setMapObject(null);
 		this.__center = null;
 	},
 	properties : {
		/**
		 * Google карта
		 * @type {google.maps.Map}
		 */
		 mapObject : {
		 	nullable : true
		 }
		},
		members : {
		/**
		 * Центральная точка карты
		 * @type {Object}
		 */
		 __center : null,

 		  /**
 		   * Контекстное меню карты
 		   * @type {Object}
 		   */
 		   __contextMenu : null,

 		   setContextMenu : function(menuItems){
 		   	this.debug("execute setContextMenu()");
 		   	var map = this.getMapObject();
 		   	if (map == null)
 		   		return;
 		   	if (this.__contextMenu  != undefined) {
 		   		google.maps.event.clearListeners(map, 'menu_item_selected');
 		   		var events = this.__contextMenu["__events__"];
 		   		for(var evt in events){
 		   			google.maps.event.removeListener(events[evt]);
 		   		}
 		   	}
 		   	if(menuItems == undefined)
 		   		return;
 		   	var contextMenuOptions = {};
 		   	contextMenuOptions.classNames = {
 		   		menu : 'context_menu',
 		   		menuSeparator : 'context_menu_separator'
 		   	};
 		   	contextMenuOptions.menuItems = menuItems;

 		   	var contextMenu = new ContextMenu(map, contextMenuOptions);
 		   	var self = this;
 		   	var events = {};
 		   	events.rightclick = google.maps.event.addListener(map, "rightclick", function(mouseEvent) {
 		   		contextMenu.show(mouseEvent.latLng);
 		   	});
 		   	events.click = google.maps.event.addListener(map, "click",	function(mouseEvent) {
 		   		contextMenu.hide();
 		   	});
 		   	events.dragstart = google.maps.event.addListener(map, "dragstart", function(mouseEvent) {
 		   		contextMenu.hide();
 		   	});
 		   	contextMenu["__events__"] = events;
 		   	this.__contextMenu = contextMenu;

 		   	this.debug("setContextMenu() : exit();");
 		   },

 		   getContextMenu : function(){
 		   	return this.__contextMenu;
 		   },


		/**
		 * Центрирует карту и задает масштаб
		 * @param lat {Number}    Широта
		 * @param lon {Number}    Долгота
		 * @param scale {Integer}  Масштаб
		 */
		 setCenter : function(lat, lon, scale) {
		 	if (this.getMapObject()) {
		 		this.getMapObject().setCenter(new google.maps.LatLng(lat, lon));
		 		if(scale!=null)
		 			this.getMapObject().setZoom(scale);
		 	}
		 	this.__center.lat = lat;
		 	this.__center.lon = lon;
		 	this.__center.scale = scale;
		 },

		/**
		 * инициализация виджета
		 * @param lat {Number}    Широта центральной точки
		 * @param lon {Number}    Долгота центральной точки
		 * @param scale {Integer}  Масштаб
		 */
		 init : function(lat, lon, scale) {
		 	this.__center.lat = lat;
		 	this.__center.lon = lon;
		 	this.__center.scale = scale;
		 	this.addListenerOnce("appear", this.__createMap, this);
		 	this.addListener("appear", this.__onAppear, this);
		 	this.addListener("resize", this.__onResize, this);

		 },

		/**
		 * Создание google карты
		 */
		 __createMap : function() {
		 	var map = new google.maps.Map(this.getContentElement().getDomElement(), {
		 		mapTypeId : google.maps.MapTypeId.ROADMAP,
		 		mapTypeControl : true,
		 		mapTypeControlOptions : {
		 			style : google.maps.MapTypeControlStyle.DROPDOWN_MENU
		 		},
		 		navigationControl : true,
		 		navigationControlOptions : {
		 			style : google.maps.NavigationControlStyle.SMALL
		 		}
		 	});
		 	map.setOptions({draggableCursor:'crosshair'});
		 	this.setMapObject(map);
		 	this.setCenter(this.__center.lat, this.__center.lon, this.__center.scale);
		 	this.debug('map was initialized');
		 },

 		/**
 		 * Обработчик события вызывается при изменении размеров карты.
 		 */
 		 __onResize : function() {
 		 	if (this.getMapObject()!=null) {

 		 		qx.html.Element.flush();
 		 		google.maps.event.trigger(this.getMapObject(), 'resize');
 		 	}
 		 },

		/**
		 * Обработчик события вызывается при появлении карты.
		 */
		 __onAppear : function(){
		 	this.debug("__onAppear()");
		 	this.__onResize();
		 }



		}

	});
