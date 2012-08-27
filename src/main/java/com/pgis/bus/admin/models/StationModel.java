package com.pgis.bus.admin.models;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;

import com.pgis.bus.data.geo.Location;
import com.pgis.bus.data.orm.Station;
import com.pgis.bus.data.orm.StationTransport;
import com.pgis.bus.data.orm.StringValue;

public class StationModel {
	int id;
	int city_id;
	Location location;
	int name_key;
	StringValue[] names;
	StationTransport[] transports;

	public StationModel() {

	}

	public StationModel(Station station) {
		this.id = station.getId().intValue();
		this.city_id = station.getCity_id();
		this.name_key = station.getName_key();
		this.location = new Location(station.getLocation());
		this.names = station.getName().values()
				.toArray(new StringValue[station.getName().size()]);
		this.transports = station.getTransports().toArray(
				new StationTransport[station.getTransports().size()]);
	}

	public Station toStation() {
		Station s = new Station();
		s.setCity_id(this.city_id);
		s.setId(this.id);
		s.setLocation(this.location.toPGPoint());
		s.setName_key(this.name_key);
		s.setTransports(Arrays.asList(this.transports));

		HashMap<String, StringValue> name = new HashMap<String, StringValue>();

		for (int i = 0; i < this.names.length; i++) {
			name.put(this.names[i].lang_id, this.names[i]);
		}
		s.setName(name);

		return s;
	}

}
