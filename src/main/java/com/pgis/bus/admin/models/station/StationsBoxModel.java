package com.pgis.bus.admin.models.station;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collection;

import org.postgis.Point;

import com.pgis.bus.data.orm.type.LangEnum;
import com.pgis.bus.net.models.geom.PointModel;
import com.pgis.bus.net.models.station.StationModel;

public class StationsBoxModel {
	private int cityID;
	private LangEnum langID;
	private PointModel ltPoint;
	private PointModel rbPoint;

	public class StElem {
		public int id;
		public String name;
		public PointModel location;

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

		public PointModel getLocation() {
			return location;
		}

		public void setLocation(PointModel location) {
			this.location = location;
		}

	}

	private Collection<StElem> stations;

	public StationsBoxModel() {

	}

	public StationsBoxModel(Collection<StationModel> stations, LangEnum langID) throws SQLException {
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

	public PointModel getLtPoint() {
		return ltPoint;
	}

	public void setLtPoint(PointModel ltPoint) {
		this.ltPoint = ltPoint;
	}

	public PointModel getRbPoint() {
		return rbPoint;
	}

	public void setRbPoint(PointModel rbPoint) {
		this.rbPoint = rbPoint;
	}

	public LangEnum getLangID() {
		return langID;
	}

	public void setLangID(LangEnum langID) {
		this.langID = langID;
	}

	public void setStations(Collection<StationModel> stations) throws SQLException {
		this.stations = new ArrayList<StElem>();
		for (StationModel st : stations) {
			StElem elem = new StElem();
			elem.id = st.getId();
			elem.name = st.getName();
			elem.location = st.getLocation();
			this.stations.add(elem);
		}
	}

}
