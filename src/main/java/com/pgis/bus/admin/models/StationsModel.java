package com.pgis.bus.admin.models;

import java.util.Collection;

import org.postgis.Point;

import com.pgis.bus.data.orm.Station;

public class StationsModel {
	private int city_id;
	private Station[] stations;
	private Point ltPoint;
	private Point rbPoint;

	public Point getLtPoint() {
		return ltPoint;
	}

	public void setLtPoint(Point ltPoint) {
		this.ltPoint = ltPoint;
	}

	public Point getRbPoint() {
		return rbPoint;
	}

	public void setRbPoint(Point rbPoint) {
		this.rbPoint = rbPoint;
	}

	public int getCity_id() {
		return city_id;
	}

	public void setCity_id(int city_id) {
		this.city_id = city_id;
	}

	public Station[] getStations() {
		return stations;
	}

	public void setStations(Station[] stations) {
		this.stations = stations;
	}

	public void setStations(Collection<Station> stations) {
		this.stations = stations.toArray(new Station[stations.size()]);
	}
}
