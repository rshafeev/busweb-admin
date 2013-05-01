package com.pgis.bus.admin.models.station;

import java.util.ArrayList;
import java.util.Collection;

import com.pgis.bus.net.models.station.StationModel;

public class StationsListModel {

	public class StElem {
		public int id;
		public String name;

		public int getId() {
			return id;
		}

		public void setId(int id) {
			this.id = id;
		}

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}

	}

	private Collection<StElem> stationsList;

	public StationsListModel(Collection<StationModel> stations) {
		stationsList = new ArrayList<StElem>();
		for (StationModel st : stations) {
			StElem elem = new StElem();
			elem.id = st.getId();
			elem.name = st.getName();
			stationsList.add(elem);
		}
	}

	public Collection<StElem> getStationsList() {
		return stationsList;
	}

}
