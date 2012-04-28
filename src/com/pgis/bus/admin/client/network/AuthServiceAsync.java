package com.pgis.bus.admin.client.network;

import com.google.gwt.user.client.rpc.AsyncCallback;

/**
 * The async counterpart of <code>AuthService</code>.
 */

public interface AuthServiceAsync {
	void retrieveUsername(AsyncCallback<String> callback);
	void cancelCookie(AsyncCallback<String> callback);
	
}
