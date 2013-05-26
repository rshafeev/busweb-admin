package com.pgis.bus.admin.models.route;

import java.io.Serializable;
import java.sql.SQLException;

import com.pgis.bus.data.orm.Route;
import com.pgis.bus.data.orm.type.LangEnum;

public class RouteListModel implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = -6875454291173996685L;

	private int id;
	private String number;
	private double cost;
	private boolean visible;

	public RouteListModel() {

	}

	public RouteListModel(Route r, LangEnum lang) {
		this.id = r.getId();
		this.cost = r.getCost();
		this.visible = r.isVisible();
		try {
			this.number = r.getNumber(lang);
		} catch (SQLException e) {
		}
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getNumber() {
		return number;
	}

	public void setNumber(String number) {
		this.number = number;
	}

	public double getCost() {
		return cost;
	}

	public void setCost(double cost) {
		this.cost = cost;
	}

	public boolean isVisible() {
		return visible;
	}

	public void setVisible(boolean visible) {
		this.visible = visible;
	}

}
