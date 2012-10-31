package com.pgis.bus.admin.models;

import java.util.HashMap;

import org.postgis.Point;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.pgis.bus.data.orm.City;
import com.pgis.bus.data.orm.StringValue;

public class CityModel {
	private static final Logger log = LoggerFactory.getLogger(CityModel.class);

	int id;
	Point location;
	int scale;
	int name_key;
	boolean isShow;

	StringValue[] names;

	public CityModel(City city) {
		this.location = new Point(city.lat, city.lon);
		this.id = city.id;
		this.scale = city.scale;
		this.name_key = city.name_key;
		this.names = city.name.values().toArray(
				new StringValue[city.name.size()]);
		this.isShow = city.isShow;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Point getLocation() {
		return location;
	}

	public void setLocation(Point location) {
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
		city.lat = this.location.x;
		city.lon = this.location.y;
		city.name_key = this.name_key;
		city.scale = this.scale;
		city.isShow = this.isShow;
		city.name = new HashMap<String, StringValue>();

		for (int i = 0; i < this.names.length; i++) {
			city.name.put(this.names[i].lang_id, this.names[i]);
		}

		return city;
	}
	
	public boolean isShow() {
		return isShow;
	}

	public void setShow(boolean isShow) {
		this.isShow = isShow;
	}

}
