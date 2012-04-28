package com.pgis.bus.admin.client.mvp;


import com.google.gwt.activity.shared.Activity;
import com.google.gwt.activity.shared.ActivityMapper;
import com.google.gwt.place.shared.Place;
import com.pgis.bus.admin.client.mvp.activity.RoutesActivity;
import com.pgis.bus.admin.client.mvp.activity.StationsActivity;
import com.pgis.bus.admin.client.mvp.place.RoutesPlace;
import com.pgis.bus.admin.client.mvp.place.StationsPlace;

public class DemoActivityMapper implements ActivityMapper {
	private ClientFactory clientFactory;
	
	public DemoActivityMapper(ClientFactory clientFactory) {
		super();
		this.clientFactory = clientFactory;
	}
	
	@Override
	public Activity getActivity(Place place) {
		if (place instanceof RoutesPlace) {
			return new RoutesActivity(clientFactory);
		} else if (place instanceof StationsPlace) {
			return new StationsActivity(clientFactory);
		}
		return null;
	}
}
