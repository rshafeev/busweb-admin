package com.pgis.bus.admin.models.route;

import java.io.Serializable;
import java.sql.SQLException;
import java.util.Collection;

import javax.xml.bind.annotation.XmlRootElement;

import com.pgis.bus.admin.models.StringValueModel;
import com.pgis.bus.data.orm.Route;
import com.pgis.bus.data.orm.RouteRelation;
import com.pgis.bus.data.orm.RouteWay;
import com.pgis.bus.data.orm.StringValue;

@XmlRootElement
public class RouteModelEx implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 990530057298037357L;

	/**
	 * ID маршрута
	 */
	private Integer id;

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
	private Integer numberKey;

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

	private boolean visible;

	public RouteModelEx() {

	}

	public RouteModelEx(Route route) throws SQLException {
		if (route == null) {
			return;
		}
		this.id = route.getId();
		this.cityID = route.getCityID();
		this.cost = route.getCost();
		this.routeTypeID = route.getRouteTypeID().substring(8);
		this.number = StringValueModel.createModels(route.getNumber());
		this.numberKey = route.getNumberKey();
		this.directWay = new RouteWayModelEx(route.getDirectRouteWay());
		this.reverseWay = new RouteWayModelEx(route.getReverseRouteWay());
		this.visible = route.isVisible();
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
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

	public boolean isVisible() {
		return visible;
	}

	public void setVisible(boolean visible) {
		this.visible = visible;
	}

	public Route toORMObject() {
		Route route = new Route();
		route.setId(id);
		route.setCityID(cityID);
		route.setRouteTypeID("c_route_" + routeTypeID);
		route.setCost(cost);
		route.setNumberKey(this.numberKey);
		route.setNumber(StringValueModel.createORMObjects(this.number));
		route.setVisible(this.visible);
		try {
			if (this.directWay != null) {
				RouteWay dWay = this.directWay.toORMObject();
				if (this.id != null)
					dWay.setRouteID(this.id);
				dWay.setDirect(true);
				route.setDirectRouteWay(dWay);
				if (dWay.getRouteRelations() != null) {
					for (RouteRelation r : dWay.getRouteRelations()) {
						if (r.getStationB() != null)
							r.getStationB().setCityID(this.cityID);
					}
				}
			}

			if (this.reverseWay != null) {
				RouteWay rWay = this.reverseWay.toORMObject();
				if (this.id != null)
					rWay.setRouteID(this.id);
				rWay.setDirect(false);
				route.setReverseRouteWay(rWay);
				if (rWay.getRouteRelations() != null) {
					for (RouteRelation r : rWay.getRouteRelations()) {
						if (r.getStationB() != null)
							r.getStationB().setCityID(this.cityID);
					}
				}
			}

			if (route.getNumber() != null) {
				for (StringValue s : route.getNumber()) {
					s.setKeyID(this.numberKey);
				}
			}
		} catch (SQLException e) {
		}
		return route;
	}

	public Integer getNumberKey() {
		return numberKey;
	}

	public void setNumberKey(Integer numberKey) {
		this.numberKey = numberKey;
	}

	@Override
	public String toString() {
		return "RouteModelEx [id=" + id + ", cityID=" + cityID + ", routeTypeID=" + routeTypeID + ", cost=" + cost
				+ ", numberKey=" + numberKey + ", number=" + number + ", directWay=" + directWay + ", reverseWay="
				+ reverseWay + "]";
	}

}
