package com.pgis.bus.admin.client.network;

import com.google.gwt.user.client.rpc.RemoteService;
import com.google.gwt.user.client.rpc.RemoteServiceRelativePath;
import com.pgis.bus.admin.shared.models.Node;

/**
 * The client side stub for the RPC service.
 */
@RemoteServiceRelativePath("greet")
public interface GreetingService extends RemoteService {
	String greetServer(String name) throws IllegalArgumentException;
	String addStation(Node node, String city_name,
			int  use_trolley,
			int  use_metro,
			int use_tram,
			int use_bus );
}
