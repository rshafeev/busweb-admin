package com.pgis.bus.admin.client.mvp.view.stations;

import org.gwtopenmaps.openlayers.client.LonLat;
import org.gwtopenmaps.openlayers.client.Pixel;
import org.gwtopenmaps.openlayers.client.event.EventListener;
import org.gwtopenmaps.openlayers.client.event.MapClickListener;
import org.gwtopenmaps.openlayers.client.event.MapMoveListener;

import com.google.gwt.core.client.GWT;
import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.Event;
import com.google.gwt.user.client.Window;

import com.google.gwt.user.client.ui.PopupPanel;
import com.google.gwt.user.client.ui.TextArea;
import com.google.gwt.user.client.ui.Widget;
import com.pgis.bus.admin.client.mvp.view.GeoMap;


public class StationsMap extends GeoMap {

	private TextArea eventMessageArea;
	private StationsView view = null;
	public LonLat mouseLonLat=null;
	
	public StationsMap(StationsView view, String w, String h)
	{
		super(w,h);
		this.view = view;
		eventMessageArea = new TextArea();
        eventMessageArea.setText(" Events\n----------");
        eventMessageArea.setHeight("20em");
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
		
	    mouseLonLat = getMap().getLonLatFromPixel(new Pixel(event.getClientX() - sender.getAbsoluteLeft(),
	    		                                            event.getClientY()- sender.getAbsoluteTop()));
		mouseLonLat.transform(getMap().getProjection(),"EPSG:4326");
		
		
		//mouseLonLat = new LonLat(event.getClientX() - sender.getAbsoluteLeft(),event.getClientY() - sender.getAbsoluteTop());
		final DialogAddStation popup = new DialogAddStation(this);
		popup.show();
	}

	

}