package com.pgis.bus.admin.models;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map.Entry;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.pgis.bus.admin.controllers.CitiesController;
import com.pgis.bus.data.geo.Location;
import com.pgis.bus.data.orm.City;
import com.pgis.bus.data.orm.StringValue;

public class CityModel{
	private static final Logger log = LoggerFactory
			.getLogger(CityModel.class);

	int id;
	Location location;
	int scale;
	int name_key;
	StringValue[] names;
	public CityModel(City city) {
		this.location = new Location(city.lat,city.lon);
		this.id = city.id;
		this.scale = city.scale;
		this.name_key = city.name_key;
		this.names = city.name.values().toArray(new StringValue[city.name.size()]);
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

	public int getName_key() {
		return name_key;
	}

	public void setName_key(int name_key) {
		this.name_key = name_key;
	}

	public StringValue[] getNames() {
		return names;
	}

	public void setNames(StringValue[] names) {
		this.names = names;
	}

	public City toCity() {
		City city = new City();
		city.id = this.id;
		city.lat = this.location.lat;
		city.lon = this.location.lon;
		city.name_key = this.name_key;
		city.scale = this.scale;

		city.name = new HashMap<String, StringValue>();

		for (int i = 0; i < this.names.length; i++) {
			city.name.put(this.names[i].lang_id,this.names[i]);
			log.debug(this.names[i].value);
		}

		return city;
	}
}
