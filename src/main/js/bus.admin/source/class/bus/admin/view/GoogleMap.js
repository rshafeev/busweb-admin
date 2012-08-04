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
				this.__map.destroy();
				this.__map = null;
			},

			members : {
				__map : null,
				__lat : null,
				__lon : null,
				__scale : null,
				getMap : function() {
					return this.__map;
				},
				
				setCenter : function(lat, lon, scale) {
					if (this.__map) {
						this.__map.setCenter(new google.maps.LatLng(lat,lon));
						this.__map.setZoom(scale);
					}
				},
				
				init : function(lat,lon,scale){
					this.__lat = lat;
					this.__lon = lon;
					this.__scale = scale;
					this.addListenerOnce("appear", this.__createMap, this);
					this.addListener("resize", this.__onResize, this);
					this.debug('map was initialized');
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
				this.__map = map;
				this.setCenter(50,36,16);
				},

				__onResize : function(e) {
					if (this.__map) {
						this.debug("Mapwidget: changeAppearance()!");
						qx.html.Element.flush();
						google.maps.event.trigger(this.__map, 'resize');
					}
				}

				}

		});
