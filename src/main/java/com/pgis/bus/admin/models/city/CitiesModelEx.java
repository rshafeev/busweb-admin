package com.pgis.bus.admin.models.city;

import java.util.Collection;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class CitiesModelEx {

	Collection<CityModelEx> cities;

	public CitiesModelEx() {

	}

	public CitiesModelEx(Collection<CityModelEx> cities) {
		this.cities = cities;
	}

	public Collection<CityModelEx> getCities() {
		return cities;
	}

	public void setCities(Collection<CityModelEx> cities) {
		this.cities = cities;
	}

}
