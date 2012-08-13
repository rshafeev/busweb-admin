
/*
  #ignore(google.maps)
  #ignore(google.maps.*)
 */

/**
 * Wraps an OpenLayers Map in an qooxdoo Widget.
 * 
 * @author Rui Lopes (ruilopes.com)
 */
qx.Class.define("bus.admin.view.GoogleMap", {
	extend : qx.ui.core.Widget,

	construct : function() {
		this.base(arguments);
	},

	destruct : function() {
		this.getMapObject.destroy();
		this.setMapObject(null);
	},
	properties : {
		mapObject : {
			nullable : true
		}
	},
	members : {
		__lat : null,
		__lon : null,
		__scale : null,

		setCenter : function(lat, lon, scale) {
			if (this.getMapObject()) {
				this.getMapObject().setCenter(new google.maps.LatLng(lat, lon));
				this.getMapObject().setZoom(scale);
				this.__lat = lat;
				this.__lon = lon;
				this.__scale = scale;

			}
		},

		init : function(lat, lon, scale) {
			this.__lat = lat;
			this.__lon = lon;
			this.__scale = scale;
			this.addListenerOnce("appear", this.__createMap, this);

			this.addListener("resize", this.__onResize, this);

		},

		__createMap : function() {
			var map = new google.maps.Map(this.getContentElement()
							.getDomElement(), {
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
			this.setCenter(this.__lat, this.__lon, this.__scale);
			this.debug('map was initialized');
		},

		__onResize : function(e) {
			if (this.mapObject) {
				this.debug("Mapwidget: changeAppearance()!");
				qx.html.Element.flush();
				google.maps.event.trigger(this.getMapObject(), 'resize');
			}
		}

	}

});
