package com.pgis.bus.admin.models;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;

import com.pgis.bus.data.models.StationModel;
import com.pgis.bus.data.orm.Station;

public class StationsModel {
	private int city_id;
	private String transport_type_id;
	private StationModel[] stations;

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

	public StationModel[] getStations() {
		return stations;
	}

	public void setStations(StationModel[] stations) {
		this.stations = stations;
	}
	public void setStations(Collection<Station> stations){
		ArrayList<StationModel> mass = new ArrayList<StationModel>();
		Iterator<Station> i = stations.iterator();
		while (i.hasNext()) {
			Station station = i.next();
			mass.add(new StationModel(station));
		}
		this.stations = mass.toArray(new StationModel[mass.size()]);
	}
}
