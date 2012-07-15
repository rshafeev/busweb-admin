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

qx.Class.define("bus.admin.pages.Cities", {
	extend : bus.admin.pages.AbstractPage,

	construct : function() {
		this.base(arguments);
		this.initWidgets();
	},

	members : {
		__map : null,
		__mapWidget : null,
		initWidgets : function() {

			var dock = new qx.ui.layout.Dock();
			dock.setSeparatorX("separator-horizontal");
			dock.setSeparatorY("separator-vertical");
			dock.setSpacingX(5);
			dock.setSpacingY(5);

			this.setLayout(dock);

			var panelContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox(1));
			panelContainer.setWidth(300);
			// Create left panel

			var label = new qx.ui.basic.Label("Cities").set({
						alignY : "middle"
					});
			panelContainer.add(label);

			var mapContainer = this.__createGoogleMapContainer();

			var splitpane = new qx.ui.splitpane.Pane("horizontal");
			splitpane.setWidth(300);
			splitpane.setMinWidth(250);
			splitpane.add(panelContainer, 0);
			splitpane.add(mapContainer, 1)

			this.add(splitpane, {
						edge : "center"
					});

		},

		__createOSMMapContainer : function() {
			var mapContainer = new qx.ui.container.Composite(new qx.ui.layout.Dock());
			// create Map Widget
			var mapWidget = new qx.ui.core.Widget();

			mapWidget.addListenerOnce("appear", function() {

						var mapDomId = "OpenLayersMap" + this.toHashCode();
						var el = this.getContentElement();
						el.setAttribute("id", mapDomId);
						qx.html.Element.flush();

						var map = new OpenLayers.Map(mapDomId);

						var mapnik = new OpenLayers.Layer.OSM();
						var fromProjection = new OpenLayers.Projection("EPSG:4326");
						var toProjection = new OpenLayers.Projection("EPSG:900913");
						var position = new OpenLayers.LonLat(13.41, 52.52)
								.transform(fromProjection, toProjection);
						var zoom = 15;

						map.addLayer(mapnik);
						map.setCenter(position, zoom);
					});
			mapContainer.add(mapWidget, {
						edge : "center"
					});
			return mapContainer;
		},
		__createGoogleMapContainer : function() {
			var mapContainer = new qx.ui.container.Composite();
			mapContainer.setLayout(new qx.ui.layout.Canvas());
			// create Map Widget
			this.__mapWidget = new qx.ui.core.Widget();
			this.__mapWidget.setDroppable(true);
			var mapWidget = this.__mapWidget;
		        var  map=null;
			
	  
			mapWidget.addListenerOnce("appear", function() {
			   
			   
			   mapWidget.addListener("resize",function(){
					  //map.checkResize();
			          this.debug("Mapwidget: changeAppearance()!");
				  google.maps.event.trigger(map, 'resize');
			});
			   
			 map = new google.maps.Map(mapWidget.getContentElement()
								.getDomElement(), {
				      center: new google.maps.LatLng(18.464182,-69.908366),
				       zoom: 17,
  	mapTypeId: google.maps.MapTypeId.ROADMAP,
  	mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
    },
    navigationControl: true,
    navigationControlOptions: {
      style: google.maps.NavigationControlStyle.SMALL
    }
  });
				this.__map = map;
				var this_obj = this;
				google.maps.event.trigger(map, 'resize');
				google.maps.event.addListenerOnce(map, "center_changed",
						function() {
							// Wait for DOM
							this_obj.debug("Map: center_changed!!!!");
							window.setTimeout(function() {
								var zIndex = mapWidget.getContentElement()
										.getStyle('zIndex');
								mapWidget.getContentElement().getDomElement().style.zIndex = zIndex;
							    
							    
							}, 2000);
						});

				map.setCenter(new google.maps.LatLng(49.011899, 8.403311));
			});
			mapContainer.add(mapWidget, {left: "0%", top: "0%", width: "100%", height: "100%"});
			

			return mapContainer;
		}

	}
});
