package com.pgis.bus.admin.models.city;

import java.sql.SQLException;
import java.util.Collection;
import java.util.HashMap;

import javax.xml.bind.annotation.XmlRootElement;

import com.pgis.bus.admin.models.StringValueModel;
import com.pgis.bus.data.orm.City;
import com.pgis.bus.data.orm.StringValue;
import com.pgis.bus.data.orm.type.LangEnum;
import com.pgis.bus.net.models.geom.PointModel;

@XmlRootElement
public class CityModelEx {
	private int id;
	private String key;
	private PointModel location;
	private int scale;
	private int nameKey;
	private boolean show;
	private Collection<StringValueModel> names;

	public CityModelEx() {

	}

	public CityModelEx(City city) throws SQLException {
		this.id = city.getId();
		this.location = new PointModel(city.getLat(), city.getLon());
		this.scale = city.getScale();
		this.nameKey = city.getNameKey();
		this.show = city.isShow();
		this.key = city.getKey();
		if (city.getName() != null) {
			this.names = StringValueModel.createModels(city.getName().values());
		}

	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public PointModel getLocation() {
		return location;
	}

	public void setLocation(PointModel location) {
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

	public Collection<StringValueModel> getNames() {
		return names;
	}

	public void setNames(Collection<StringValueModel> names) {
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
		city.setId(this.id);
		city.setKey(this.key);
		city.setLat(this.location.getLat());
		city.setLon(this.location.getLon());
		city.setNameKey(this.nameKey);
		city.setScale(this.scale);
		city.setShow(this.show);
		if (this.names != null) {
			HashMap<LangEnum, StringValue> name = new HashMap<LangEnum, StringValue>();

			for (StringValueModel elem : this.names) {
				StringValue ormObj = elem.toORMObject();
				ormObj.setKeyID(this.nameKey);
				name.put(ormObj.getLangID(), ormObj);
			}
			city.setName(name);
		}

		return city;
	}
}
