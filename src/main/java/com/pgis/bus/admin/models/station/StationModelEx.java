package com.pgis.bus.admin.models.station;

import java.io.Serializable;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collection;

import javax.xml.bind.annotation.XmlRootElement;

import com.pgis.bus.admin.models.StringValueModel;
import com.pgis.bus.data.helpers.GeoObjectsHelper;
import com.pgis.bus.data.models.factory.geom.PointModelFactory;
import com.pgis.bus.data.orm.Station;
import com.pgis.bus.data.orm.StringValue;
import com.pgis.bus.net.models.geom.PointModel;

@XmlRootElement
public class StationModelEx implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = -7282643759062319506L;

	private Integer id;
	private Integer cityID;
	private PointModel location;
	private Integer nameKey;
	private Collection<StringValueModel> names;

	public StationModelEx() {

	}

	public StationModelEx(Station st) {
		this.id = st.getId();
		this.cityID = st.getCityID();
		this.nameKey = st.getNameKey();
		this.location = PointModelFactory.createModel(st.getLocation());
		try {
			this.names = StringValueModel.createModels(st.getName());
		} catch (SQLException e) {
		}
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public PointModel getLocation() {
		return location;
	}

	public void setLocation(PointModel location) {
		this.location = location;
	}

	public Integer getNameKey() {
		return nameKey;
	}

	public void setNameKey(Integer nameKey) {
		this.nameKey = nameKey;
	}

	public Collection<StringValueModel> getNames() {
		return names;
	}

	public void setNames(Collection<StringValueModel> names) {
		this.names = names;
	}

	public Integer getCityID() {
		return cityID;
	}

	public void setCityID(Integer cityID) {
		this.cityID = cityID;
	}

	public Station toORMObject() {
		Station st = new Station();
		st.setId(this.id);
		st.setCityID(this.cityID);
		st.setLocation(GeoObjectsHelper.createPoint(location));
		st.setNameKey(nameKey);
		Collection<StringValue> names = new ArrayList<StringValue>();
		for (StringValueModel elem : this.names) {
			StringValue s = elem.toORMObject();
			s.setKeyID(this.nameKey);
			names.add(s);
		}
		st.setName(names);
		return st;

	}
}
