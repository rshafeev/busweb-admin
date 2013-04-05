package com.pgis.bus.admin.models.routes;

import java.util.ArrayList;
import java.util.Collection;

import com.pgis.bus.data.orm.Route;

public class RoutesListModel {

	public class RouteElem {
		private int id;
		private String number;
		private double cost;

	}

	private Collection<RouteElem> routesList;

	public RoutesListModel() {

	}

	public RoutesListModel(Collection<Route> routes, String langID) {
		routesList = new ArrayList<RouteElem>();
		for (Route r : routes) {
			RouteElem elem = new RouteElem();
			elem.id = r.getId();
			elem.number = r.getFullName(langID);
			elem.cost = r.getCost();
			routesList.add(elem);
		}
	}

	public void setRoutesList(Collection<RouteElem> routesList) {
		this.routesList = routesList;
	}

	public Collection<RouteElem> getRoutesList() {
		return routesList;
	}

}
