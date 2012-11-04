package com.pgis.bus.admin.models;

import java.util.Collection;

import com.pgis.bus.data.orm.Station;

public class StationsModel {
	private int city_id;
	private String transport_type_id;
	private Station[] stations;

	public int getCity_id() {
		return city_id;
	}

	public void setCity_id(int city_id) {
		this.city_id = city_id;
	}

	public String getTransport_type_id() {
		return transport_type_id;
	}

	public void setTransport_type_id(String transport_type_id) {
		this.transport_type_id = transport_type_id;
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
