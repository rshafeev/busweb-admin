package com.pgis.bus.admin.models.stations;

import java.util.ArrayList;
import java.util.Collection;

import com.pgis.bus.data.orm.Station;
import com.pgis.bus.data.orm.StringValue;

public class StationsListModel {

	public class StElem{
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
	public StationsListModel( Collection<Station> stations, String langID){
		stationsList = new ArrayList<StElem>();
		for(Station st : stations){
			StElem elem = new StElem();
			elem.id = st.getId();
			StringValue v = st.getNameByLanguage(langID);
			if(v != null){
				elem.name = v.value;
			}
			stationsList.add(elem);
		}
	}
	public Collection<StElem> getStationsList() {
		return stationsList;
	}
	
	
}
