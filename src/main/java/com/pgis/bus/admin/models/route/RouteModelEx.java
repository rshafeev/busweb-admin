package com.pgis.bus.admin.models.route;

import java.io.Serializable;
import java.sql.SQLException;
import java.util.Collection;

import javax.xml.bind.annotation.XmlRootElement;

import com.pgis.bus.admin.models.StringValueModel;
import com.pgis.bus.data.orm.Route;
import com.pgis.bus.data.orm.RouteWay;
import com.pgis.bus.data.orm.StringValue;

@XmlRootElement(name = "route")
public class RouteModelEx implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 990530057298037357L;

	/**
	 * ID маршрута
	 */
	private int id;

	/**
	 * ID города, в которому принадлежит данный маршрут
	 */
	private int cityID;

	/**
	 * Тип маршрута. Возможные значения: "metro", "bus", "trolley", "tram" и др.
	 */
	private String routeTypeID;

	/**
	 * Стоимость проезда
	 */
	private double cost;

	/**
	 * ID ключа, под которым сохранены номера маршрута на разных языках.
	 */
	private int numberKey;

	/**
	 * Номер маршрута. (Зависит от языка, поэтому коллекция)
	 */
	private Collection<StringValueModel> number;

	/**
	 * Прямой путь
	 */
	private RouteWayModelEx directWay;

	/**
	 * Обратный путь
	 */
	private RouteWayModelEx reverseWay;

	public RouteModelEx() {

	}

	public RouteModelEx(Route route) throws SQLException {
		this.id = route.getId();
		this.cityID = route.getCityID();
		this.cost = route.getCost();
		this.routeTypeID = route.getRouteTypeID().substring(8);
		this.number = StringValueModel.createModels(route.getNumber());
		this.numberKey = route.getNumberKey();
		this.directWay = new RouteWayModelEx(route.getDirectRouteWay());
		this.reverseWay = new RouteWayModelEx(route.getReverseRouteWay());

	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getCityID() {
		return cityID;
	}

	public void setCityID(int cityID) {
		this.cityID = cityID;
	}

	public String getRouteTypeID() {
		return routeTypeID;
	}

	public void setRouteTypeID(String routeTypeID) {
		this.routeTypeID = routeTypeID;
	}

	public double getCost() {
		return cost;
	}

	public void setCost(double cost) {
		this.cost = cost;
	}

	public Collection<StringValueModel> getNumber() {
		return number;
	}

	public void setNumber(Collection<StringValueModel> number) {
		this.number = number;
	}

	public RouteWayModelEx getDirectWay() {
		return directWay;
	}

	public void setDirectWay(RouteWayModelEx directWay) {
		this.directWay = directWay;
	}

	public RouteWayModelEx getReverseWay() {
		return reverseWay;
	}

	public void setReverseWay(RouteWayModelEx reverseWay) {
		this.reverseWay = reverseWay;
	}

	public Route toORMObject() {
		Route route = new Route();
		route.setId(id);
		route.setCityID(cityID);
		route.setRouteTypeID("c_route_" + routeTypeID);
		route.setCost(cost);
		route.setNumberKey(this.numberKey);
		route.setNumber(StringValueModel.createORMObjects(this.number));
		if (this.directWay != null) {
			RouteWay dWay = this.directWay.toORMObject();
			dWay.setRouteID(this.id);
			dWay.setDirect(true);
			route.setDirectRouteWay(dWay);
		}

		if (this.reverseWay != null) {
			RouteWay rWay = this.reverseWay.toORMObject();
			rWay.setRouteID(this.id);
			rWay.setDirect(false);
			route.setReverseRouteWay(rWay);
		}

		try {
			if (route.getNumber() != null) {
				for (StringValue s : route.getNumber()) {
					s.setKeyID(this.numberKey);
				}
			}
		} catch (SQLException e) {
		}
		return route;
	}

	public int getNumberKey() {
		return numberKey;
	}

	public void setNumberKey(int numberKey) {
		this.numberKey = numberKey;
	}

	@Override
	public String toString() {
		return "RouteModelEx [id=" + id + ", cityID=" + cityID + ", routeTypeID=" + routeTypeID + ", cost=" + cost
				+ ", numberKey=" + numberKey + ", number=" + number + ", directWay=" + directWay + ", reverseWay="
				+ reverseWay + "]";
	}

}
