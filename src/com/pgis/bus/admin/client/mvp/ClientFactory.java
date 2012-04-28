package com.pgis.bus.admin.client.mvp;

import com.google.gwt.event.shared.EventBus;
import com.google.gwt.place.shared.PlaceController;
import com.pgis.bus.admin.client.mvp.view.IRoutesView;
import com.pgis.bus.admin.client.mvp.view.IStationsView;


public interface ClientFactory {
	public EventBus getEventBus();
	public PlaceController getPlaceController();
	
	public IRoutesView getRoutesView();
	public IStationsView getStationsView();

}
