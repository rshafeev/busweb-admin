package com.pgis.bus.admin.models.stations;

import java.util.ArrayList;
import java.util.Collection;

import org.postgis.Point;

import com.pgis.bus.data.orm.Station;
import com.pgis.bus.data.orm.StringValue;
import com.pgis.bus.net.models.Location;

public class StationsBoxModel {
	private int cityID;
	private String langID; 
	private Point ltPoint;
	private Point rbPoint;
	
	public class StElem{
		public int id;
		public String name;
		public Location location;
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
	private Collection<StElem> stations;
	public StationsBoxModel(){
		
	}
	public StationsBoxModel( Collection<Station> stations, String langID){
		this.langID = langID;
		this.setStations(stations);
		
	}
	public Collection<StElem> getStations() {
		return stations;
	}
	public int getCityID() {
		return cityID;
	}
	public void setCityID(int cityID) {
		this.cityID = cityID;
	}
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
	public String getLangID() {
		return langID;
	}
	public void setLangID(String langID) {
		this.langID = langID;
	}
	
	public void setStations(Collection<Station> stations){
		this.stations = new ArrayList<StElem>();
		for(Station st : stations){
			StElem elem = new StElem();
			elem.id = st.getId();
			StringValue v = st.getNameByLanguage(this.langID);
			elem.location = new Location(st.getLocation().x, st.getLocation().y);
			if(v != null){
				elem.name = v.value;
			}
			this.stations.add(elem);
		}
	}
	
	
}
