package com.pgis.bus.admin.models.stations;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;

import org.postgis.Point;

import com.pgis.bus.admin.models.LocaleNameModel;
import com.pgis.bus.data.orm.Station;
import com.pgis.bus.data.orm.StringValue;
import com.pgis.bus.net.models.Location;

public class StationModel {
	private Integer id;
	private Integer cityID;
	private Location location;
	private Integer nameKey;
	private Collection<LocaleNameModel> names;
	
	public StationModel(){
		
	}
	
	public StationModel(Station st){
		this.id = st.getId();
		this.cityID = st.getCity_id();
		this.nameKey = st.getName_key();
		this.location = new Location(st.getLocation().x, st.getLocation().y);
		this.names = new ArrayList<LocaleNameModel>();
		for(StringValue v :  st.getNames() ){
			this.names.add(new LocaleNameModel(v));
		}
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public Location getLocation() {
		return location;
	}
	public void setLocation(Location location) {
		this.location = location;
	}
	public int getNameKey() {
		return nameKey;
	}
	public void setNameKey(int nameKey) {
		this.nameKey = nameKey;
	}
	public Collection<LocaleNameModel> getNames() {
		return names;
	}
	public void setNames(Collection<LocaleNameModel> names) {
		this.names = names;
	}

	public Integer getCityID() {
		return cityID;
	}

	public void setCityID(Integer cityID) {
		this.cityID = cityID;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public void setNameKey(Integer nameKey) {
		this.nameKey = nameKey;
	}

	public Station toStation() {
		Station st = new Station();
		st.setId(this.id);
		st.setCity_id(this.cityID);
		st.setLocation(new Point(this.location.getLat(), this.location.getLon()));
		st.setName_key(nameKey);
		Collection<StringValue> names = new ArrayList<StringValue>();
		for(LocaleNameModel elem : this.names){
			StringValue v = new StringValue();
			v.id = elem.getId();
			v.key_id = this.nameKey;
			v.lang_id = elem.getLangID();
			v.value = elem.getName();
			names.add(v);
		}
		st.setNames(names);
		return st;

	}
	
	
	
}
