package com.pgis.bus.admin.client.mvp.view.routes;

import org.gwtopenmaps.openlayers.client.Icon;
import org.gwtopenmaps.openlayers.client.LonLat;
import org.gwtopenmaps.openlayers.client.Marker;
import org.gwtopenmaps.openlayers.client.Pixel;
import org.gwtopenmaps.openlayers.client.Size;
import org.gwtopenmaps.openlayers.client.event.MapClickListener;
import org.gwtopenmaps.openlayers.client.event.MapMoveListener;
import org.gwtopenmaps.openlayers.client.event.MapClickListener.MapClickEvent;
import org.gwtopenmaps.openlayers.client.event.MapMoveListener.MapMoveEvent;
import org.gwtopenmaps.openlayers.client.event.MarkerBrowserEventListener.MarkerBrowserEvent;
import org.gwtopenmaps.openlayers.client.event.MarkerBrowserEventListener;
import org.gwtopenmaps.openlayers.client.feature.VectorFeature;
import org.gwtopenmaps.openlayers.client.geometry.Point;
import org.gwtopenmaps.openlayers.client.layer.Markers;
import org.gwtopenmaps.openlayers.client.layer.Vector;

import com.google.gwt.core.client.GWT;
import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.Event;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.TextArea;
import com.google.gwt.user.client.ui.Widget;
import com.pgis.bus.admin.client.mvp.view.GeoMap;



public class RouteMap extends GeoMap {

	private TextArea eventMessageArea;
	private RoutesView view = null;
	private boolean AddPointsMode = false;
	public LonLat mouseLonLat=null;
	private Vector vectorLayer = null;
	private Markers markers = null;
	public RouteMap(RoutesView view, String w, String h)
	{
		super(w,h);
		this.view = view;
		eventMessageArea = new TextArea();
        eventMessageArea.setText(" Events\n----------");
        eventMessageArea.setHeight("20em");
        
        vectorLayer = new Vector("vectorLayer");
        getMap().addLayer(vectorLayer);
        
        markers = new Markers("sdf");
        getMap().addLayer(markers);
        
        
        //add(eventMessageArea, DockPanel.EAST);

        MapMoveListener moveListener1 = new MapMoveListener()
        {
            public void onMapMove(MapMoveEvent eventObject)
            {
                String txt = eventMessageArea.getText();
                eventMessageArea.setText(txt + "\n\n" + "event: " + eventObject.getType() + "; source: " +
                    eventObject.getSource().getClass());
            }

        };

    MapMoveListener moveListener2 = new MapMoveListener()
        {
            public void onMapMove(MapMoveEvent eventObject)
            {
                String txt = eventMessageArea.getText();
                eventMessageArea.setText( "\n\n" + "another event: " + eventObject.getType() + "; source: " +
                    eventObject.getSource().getClass());
            }

        };
    
    
    MapClickListener mapClickListener = new MapClickListener()
        {
            public void onClick(MapClickEvent eventObject)
            {
                LonLat lonlat = eventObject.getLonLat();
                String txt = eventMessageArea.getText();
                eventMessageArea.setText( "\n\n" + "click event: " + lonlat.lon() + ", " + lonlat.lat() +
                    "; source: " + eventObject.getSource().getClass());
                
            }

        };
   
        getMap().addMapMoveListener(moveListener1);
        getMap().addMapMoveListener(moveListener2);
        getMap().addMapClickListener(mapClickListener);
        
        

        sinkEvents(Event.ONMOUSEUP | Event.ONDBLCLICK | Event.ONCONTEXTMENU);
     

   }
	
	public void onBrowserEvent(Event event) 
	{
		  GWT.log("onBrowserEvent", null);
		  event.cancelBubble(true);//This will stop the event from being propagated
		  event.preventDefault();
		  switch (DOM.eventGetType(event)) 
		  {
		    case Event.ONMOUSEUP:
		      if (DOM.eventGetButton(event) == Event.BUTTON_LEFT) {
		        GWT.log("Event.BUTTON_LEFT", null);
		        this.onClick(this, event);
		      }
		 
		      if (DOM.eventGetButton(event) == Event.BUTTON_RIGHT) {
		        GWT.log("Event.BUTTON_RIGHT", null);
		        

		        this.onRightClick(this, event);
		      }
		      break;
		    case Event.ONDBLCLICK:
		      break;
		 
		    case Event.ONCONTEXTMENU:
		      GWT.log("Event.ONCONTEXTMENU", null);
		      break;
		 
		    default:
		      break; // Do nothing
		  }//end switch
	}

	public void onClick(Widget sender, Event event) {
	
		//Window.alert("left");
		
	}


	public void onRightClick(Widget sender, Event event) {
		
		if(AddPointsMode){
	    mouseLonLat = getMap().getLonLatFromPixel(new Pixel(
	    		event.getClientX() - sender.getAbsoluteLeft(),
	    		event.getClientY()- sender.getAbsoluteTop()
	    		 ));
		//mouseLonLat.transform(getMap().getProjection(),"EPSG:4326");
		
		Point p = new Point(mouseLonLat.lat(),mouseLonLat.lon());
		
		Marker marker = new Marker(mouseLonLat);
		
		MarkerBrowserEventListener marker_click_listener = new MarkerBrowserEventListener()
				  {
			            public void onBrowserEvent(MarkerBrowserEvent markerBrowserEvent)
			            {
			            	Marker marker  = markerBrowserEvent.getSource();
			            	RouteMap.this.view.m_list_points.insertItem("CLICK!!!", 0);
			            }
				  };
		marker.addBrowserEventListener("click", marker_click_listener);
		
		Icon icon = new Icon("/media/img/default_marker.png",new Size(40,40));
		marker.setIcon(icon);
		//vectorLayer.addFeature(new VectorFeature(p));
		markers.addMarker(marker);
		this.view.m_list_points.insertItem(Double.toString(mouseLonLat.lat()) +" _ " +  Double.toString(mouseLonLat.lon()), 0);
		//	getMap().setCenter(mouseLonLat);
		}
		
		
		//mouseLonLat = new LonLat(event.getClientX() - sender.getAbsoluteLeft(),event.getClientY() - sender.getAbsoluteTop());
		
	}
	
	public boolean getAddPointsMode(){
	  return this.AddPointsMode;
	}
	
	public void setAddPointsMode(boolean mode){
		this.AddPointsMode = mode;
		}
		


}
