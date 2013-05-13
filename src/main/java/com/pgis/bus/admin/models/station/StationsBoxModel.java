package com.pgis.bus.admin.models.station;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collection;

import javax.xml.bind.annotation.XmlRootElement;

import org.postgis.Point;

import com.pgis.bus.data.orm.type.LangEnum;
import com.pgis.bus.net.models.LangEnumModel;
import com.pgis.bus.net.models.geom.PointModel;
import com.pgis.bus.net.models.station.StationModel;

@XmlRootElement
public class StationsBoxModel {
	private int cityID;
	private LangEnumModel langID;
	private PointModel ltPoint;
	private PointModel rbPoint;
	private Collection<StationModel> stations;

	public StationsBoxModel() {

	}

	public StationsBoxModel(Collection<StationModel> stations, LangEnumModel langID) throws SQLException {
		this.langID = langID;
		this.setStations(stations);

	}

	public Collection<StationModel> getStations() {
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

	public LangEnumModel getLangID() {
		return langID;
	}

	public void setLangID(LangEnumModel langID) {
		this.langID = langID;
	}

	public void setStations(Collection<StationModel> stations) throws SQLException {
		this.stations = stations;
	}

}
