package com.pgis.bus.admin.client;


import java.util.Date;

import org.gwtopenmaps.openlayers.client.LonLat;
import org.gwtopenmaps.openlayers.client.Map;
import org.gwtopenmaps.openlayers.client.MapOptions;
import org.gwtopenmaps.openlayers.client.MapWidget;
import org.gwtopenmaps.openlayers.client.control.LayerSwitcher;
import org.gwtopenmaps.openlayers.client.control.MousePosition;
import org.gwtopenmaps.openlayers.client.layer.OSM;

import com.pgis.bus.admin.client.mvp.ClientFactory;
import com.pgis.bus.admin.client.mvp.DemoActivityMapper;
import com.pgis.bus.admin.client.mvp.DemoPlaceHistoryMapper;
import com.pgis.bus.admin.client.layout.*;
import com.pgis.bus.admin.client.network.AuthService;
import com.pgis.bus.admin.client.network.AuthServiceAsync;
import com.pgis.bus.admin.client.network.GreetingService;
import com.pgis.bus.admin.client.network.GreetingServiceAsync;
import com.pgis.bus.admin.client.mvp.place.*;
import com.pgis.bus.admin.client.mvp.view.GeoMap;
import com.pgis.bus.admin.client.mvp.view.stations.StationsMap;


import com.google.gwt.activity.shared.ActivityManager;
import com.google.gwt.activity.shared.ActivityMapper;
import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.core.client.GWT;
import com.google.gwt.event.shared.EventBus;
import com.google.gwt.place.shared.PlaceController;
import com.google.gwt.place.shared.PlaceHistoryHandler;
import com.google.gwt.user.client.Cookies;
import com.google.gwt.user.client.History;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.rpc.AsyncCallback;
import com.google.gwt.user.client.ui.RootLayoutPanel;
import com.google.gwt.user.client.ui.RootPanel;
import com.google.gwt.user.client.ui.SimplePanel;

/**
 * Entry point classes define <code>onModuleLoad()</code>.
 */
public class BusAdminWeb implements EntryPoint {
	/**
	 * The message displayed to the user when the server cannot be reached or
	 * returns an error.
	 */
	private static final String SERVER_ERROR = "An error occurred while "
			+ "attempting to contact the server. Please check your network "
			+ "connection and try again.";

	/**
	 * Create a remote service proxy to talk to the server-side Greeting service.
	 */
	private final GreetingServiceAsync greetingService = GWT
			.create(GreetingService.class);
	 private final AuthServiceAsync   authService = GWT
				.create(AuthService.class);
	
	private StationsPlace defaultPlace = new StationsPlace();
	private SimplePanel containerWidget;
	private String userName;
	/**
	 * This is the entry point method.
	 */
	public void onModuleLoad() {
		setUserSessionInfo ();
		

	}
	private void setUserSessionInfo () 
	{
		authService.retrieveUsername(
				new AsyncCallback<String>(){
					public void onFailure(Throwable caught) {
				       Window.Location.replace("/login");
					}

					public void onSuccess(String result) {
						userName = result;
						onModulBodyLoad();
						
					}
				});
	}
	
	public void onModulBodyLoad()
	{
		final AppLayout mainLayout = new AppLayout();
	    containerWidget = mainLayout.getAppContentHolder();
	    mainLayout.setUserLogin(userName);
	   // Window.alert(userName);
		final ClientFactory clientFactory = GWT.create(ClientFactory.class);
		EventBus eventBus = clientFactory.getEventBus();
		PlaceController placeController = clientFactory.getPlaceController();
		
		// activate activity manager and init display
		ActivityMapper activityMapper = new DemoActivityMapper(clientFactory);
		ActivityManager activityManager = new ActivityManager(activityMapper, eventBus);
		activityManager.setDisplay(containerWidget);
		
		// display default view with activated history processing
		DemoPlaceHistoryMapper historyMapper = GWT.create(DemoPlaceHistoryMapper.class);
		PlaceHistoryHandler historyHandler = new PlaceHistoryHandler(historyMapper);
		historyHandler.register(placeController, eventBus, defaultPlace);
		
		RootLayoutPanel.get().add(mainLayout);
		
	}
}
