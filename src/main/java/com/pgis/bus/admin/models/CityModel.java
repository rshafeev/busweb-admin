package com.pgis.bus.admin.models;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;

import org.postgis.Point;
import com.pgis.bus.data.orm.City;
import com.pgis.bus.data.orm.StringValue;
import com.pgis.bus.net.models.Location;

public class CityModel {
	private int id;
	private String key;
	private Location location;
	private int scale;
	private int nameKey;
	private boolean show;
	private Collection<LocaleNameModel> names;

	public CityModel(City city) {
		this.id = city.id;
		this.location = new Location(city.lat, city.lon);
		this.scale = city.scale;
		this.nameKey = city.name_key;
		this.show = city.isShow;
		this.key = city.key;
		this.names = new ArrayList<LocaleNameModel>();
		for (StringValue v : city.name.values()) {
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

	public int getScale() {
		return scale;
	}

	public void setScale(int scale) {
		this.scale = scale;
	}

	public int getNameKey() {
		return nameKey;
	}

	public void setNameKey(int name_key) {
		this.nameKey = name_key;
	}

	
	
	public boolean isShow() {
		return show;
	}

	public void setShow(boolean show) {
		this.show = show;
	}

	public Collection<LocaleNameModel> getNames() {
		return names;
	}

	public void setNames(Collection<LocaleNameModel> names) {
		this.names = names;
	}

	
	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public City toCity() {
		City city = new City();
		city.id = this.id;
		city.key = this.key;
		city.lat = this.location.getLat();
		city.lon = this.location.getLon();
		city.name_key = this.nameKey;
		city.scale = this.scale;
		city.isShow = this.show;
		city.name = new HashMap<String, StringValue>();
		
		for(LocaleNameModel elem : this.names){
			StringValue stringValue = new StringValue();
			stringValue.id = elem.getId();
			stringValue.key_id = this.nameKey;
			stringValue.lang_id = elem.getLangID();
			stringValue.value = elem.getName();
			city.name.put(elem.getLangID(), stringValue);
		}

		return city;
	}


}
