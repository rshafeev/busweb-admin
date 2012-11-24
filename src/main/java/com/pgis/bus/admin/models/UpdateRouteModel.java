package com.pgis.bus.admin.models;

import com.pgis.bus.data.helpers.UpdateRouteOptions;
import com.pgis.bus.data.orm.Route;

public class UpdateRouteModel {

	private Route route;
	private UpdateRouteOptions opts;

	public Route getRoute() {
		return route;
	}

	public void setRoute(Route route) {
		this.route = route;
	}

	public UpdateRouteOptions getOpts() {
		return opts;
	}

	public void setOpts(UpdateRouteOptions opts) {
		this.opts = opts;
	}

}
