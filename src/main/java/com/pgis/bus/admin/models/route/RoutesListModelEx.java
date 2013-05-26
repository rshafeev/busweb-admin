package com.pgis.bus.admin.models.route;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;

import javax.xml.bind.annotation.XmlRootElement;

import com.pgis.bus.data.orm.Route;
import com.pgis.bus.data.orm.type.LangEnum;

@XmlRootElement
public class RoutesListModelEx implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -6317957844809594896L;

	private Collection<RouteListModel> routes;

	public RoutesListModelEx(Collection<Route> routes, LangEnum langID) {
		this.routes = new ArrayList<RouteListModel>();
		for (Route r : routes) {
			this.routes.add(new RouteListModel(r, langID));
		}
	}

	public Collection<RouteListModel> getRoutes() {
		return routes;
	}

	public void setRoutes(Collection<RouteListModel> routes) {
		this.routes = routes;
	}

}
