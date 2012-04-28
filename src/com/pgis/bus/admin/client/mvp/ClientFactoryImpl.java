package com.pgis.bus.admin.client.mvp;

import com.google.gwt.event.shared.EventBus;
import com.google.gwt.event.shared.SimpleEventBus;
import com.google.gwt.place.shared.PlaceController;
import com.pgis.bus.admin.client.mvp.view.IRoutesView;
import com.pgis.bus.admin.client.mvp.view.IStationsView;
import com.pgis.bus.admin.client.mvp.view.routes.RoutesView;
import com.pgis.bus.admin.client.mvp.view.stations.StationsView;

public class ClientFactoryImpl implements ClientFactory {
	private final EventBus eventBus = new SimpleEventBus();
	
	@SuppressWarnings("deprecation")
	private final PlaceController placeController = new PlaceController(eventBus);
	
	private final IStationsView stationsView = new StationsView();
	private final IRoutesView routesView = new RoutesView();

	@Override public EventBus getEventBus() { return eventBus; }
	@Override public PlaceController getPlaceController() { return placeController; }
	@Override public IStationsView getStationsView() { return stationsView; }
	@Override public IRoutesView getRoutesView() { return routesView; }

}
