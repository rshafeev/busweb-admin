package com.pgis.bus.admin.models.station;

import java.util.ArrayList;
import java.util.Collection;

import javax.xml.bind.annotation.XmlRootElement;

import com.pgis.bus.net.models.station.StationModel;

@XmlRootElement
public class StationsListModel {

	private Collection<StationModel> stationsList;

	public StationsListModel() {
	}

	public StationsListModel(Collection<StationModel> stations) {
		this.stationsList = stations;
	}

	public Collection<StationModel> getStationsList() {
		return stationsList;
	}

	public void setStationsList(Collection<StationModel> stationsList) {
		this.stationsList = stationsList;
	}

}
