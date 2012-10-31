package com.pgis.bus.admin.models;

import com.pgis.bus.data.models.StationModel;
import com.pgis.bus.data.orm.Route;

public class RoutesModel {
	private int city_id;
	private String route_type_id;
	private Route[] routes;
	public int getCity_id() {
		return city_id;
	}
	public void setCity_id(int city_id) {
		this.city_id = city_id;
	}
	public String getRoute_type_id() {
		return route_type_id;
	}
	public void setRoute_type_id(String route_type_id) {
		this.route_type_id = route_type_id;
	}
	public Route[] getRoutes() {
		return routes;
	}
	public void setRoutes(Route[] routes) {
		this.routes = routes;
	}
	
}
