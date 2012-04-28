package com.pgis.bus.admin.client.network;


import com.google.gwt.user.client.rpc.AsyncCallback;
import com.pgis.bus.admin.shared.models.Node;

/**
 * The async counterpart of <code>GreetingService</code>.
 */
public interface GreetingServiceAsync {
	void greetServer(String input, AsyncCallback<String> callback)
			throws IllegalArgumentException;
	void addStation(Node node, String city_name,
			int  use_trolley,
			int  use_metro,
			int use_tram,
			int use_bus ,
			AsyncCallback<String> callback);
}
