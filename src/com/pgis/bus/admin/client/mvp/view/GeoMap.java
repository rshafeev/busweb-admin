package com.pgis.bus.admin.client.mvp.view;


import com.google.gwt.user.client.ui.FlowPanel;

import org.gwtopenmaps.openlayers.client.Bounds;
import org.gwtopenmaps.openlayers.client.LonLat;
import org.gwtopenmaps.openlayers.client.Map;
import org.gwtopenmaps.openlayers.client.MapOptions;
import org.gwtopenmaps.openlayers.client.MapWidget;
import org.gwtopenmaps.openlayers.client.Projection;
import org.gwtopenmaps.openlayers.client.control.LayerSwitcher;
import org.gwtopenmaps.openlayers.client.control.MousePosition;
import org.gwtopenmaps.openlayers.client.layer.Layer;
import org.gwtopenmaps.openlayers.client.layer.OSM;
import org.gwtopenmaps.openlayers.client.layer.OSMOptions;
import org.gwtopenmaps.openlayers.client.layer.TMS;
import org.gwtopenmaps.openlayers.client.layer.TMSOptions;
import org.gwtopenmaps.openlayers.client.layer.TransitionEffect;

import org.gwtopenmaps.openlayers.client.util.JSObject;

public class GeoMap extends FlowPanel{
    
	private MapOptions defaultMapOptions;
    private Layer tileServerImagery;
    private OSM mapnik;
    private MapWidget mapWidget;
    
    public GeoMap(String w, String h)
    {
    	super();
    	setSize(w,h);
        
    	initMapWidget(w,h);
        add(mapWidget);
    }

	private void initMapWidget(String w, String h)
    {
    	
        this.defaultMapOptions = new MapOptions();
        this.defaultMapOptions.setNumZoomLevels(21);
        this.defaultMapOptions.setProjection("EPSG:900913");
        this.defaultMapOptions.setDisplayProjection(new Projection("EPSG:4326"));
        this.defaultMapOptions.setUnits("m");
        this.defaultMapOptions.setMaxResolution(156543.0339f);
        this.defaultMapOptions.setMaxExtent(new Bounds(-20037508, -20037508, 20037508, 20037508.34));    
        mapWidget = new MapWidget(w,h,defaultMapOptions);

        OSMOptions osmOptions = new OSMOptions();
        osmOptions.setDisplayOutsideMaxExtent(false);
        osmOptions.setIsBaseLayer(true);
        osmOptions.setTransitionEffect(TransitionEffect.RESIZE);
       
        mapnik = new OSM("","",osmOptions);
        
        // Add a WMS layer for a little background
        
        TMSOptions tmsOptions = new TMSOptions();
        tmsOptions.setDisplayOutsideMaxExtent(false);
        tmsOptions.setIsBaseLayer(true);
        tmsOptions.setType("jpg");
        tmsOptions.setGetURL(getMyUrl());
        tmsOptions.setTransitionEffect(TransitionEffect.RESIZE);
  
        tileServerImagery = new TMS("TMS", "", tmsOptions);
        getMap().addLayers(new Layer[] { mapnik,tileServerImagery });
        
        MousePosition mousePosition = new MousePosition();
        getMap().addControl(new LayerSwitcher());
        getMap().addControl(mousePosition);
        getMap().zoomToMaxExtent();
      
        
   }
    public Map getMap()
    {
        return mapWidget.getMap();
    }
    
    public void setCenter(double lon, double lat, int zoom)
    {
    	LonLat center  = new LonLat(lon,lat);
        center.transform("EPSG:4326", getMap().getProjection());
        getMap().setCenter(center, zoom);
    }
    
  

     private native static JSObject getMyUrl()
    /*-{
		function get_my_url(bounds) {
			var res = this.map.getResolution();

			var x = Math.round((bounds.left - this.maxExtent.left)
					/ (res * this.tileSize.w));
			var y = Math.round((this.maxExtent.top - bounds.top)
					/ (res * this.tileSize.h));
			var z = this.map.getZoom();

			var limit = 100000000;
			var i = 0;
			var dir_x = x;
			var dir_y = y;

			for (i = z; i > 9; i--) {
				dir_x = (Math.floor(dir_x / 2.0));
				dir_y = (Math.floor(dir_y / 2.0));
			}

			if (y < 0 || y >= limit) {
				return "http://no_image_url_here/img/noImage.gif"
			} else {
				limit = Math.pow(2, z);

				x = ((x % limit) + limit) % limit;
				y = ((y % limit) + limit) % limit;

				var url = "http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/" + z + "/" + y + "/" + x;
				return url;
			}
		}

		return get_my_url;
    }-*/;
}
