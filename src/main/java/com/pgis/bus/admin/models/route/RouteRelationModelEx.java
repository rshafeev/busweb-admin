package com.pgis.bus.admin.models.route;

import java.io.Serializable;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collection;

import javax.xml.bind.annotation.XmlRootElement;

import com.pgis.bus.admin.models.station.StationModelEx;
import com.pgis.bus.data.helpers.GeoObjectsHelper;
import com.pgis.bus.data.helpers.PGIntervalHelper;
import com.pgis.bus.data.models.factory.TimeIntervalModelFactory;
import com.pgis.bus.data.orm.RouteRelation;
import com.pgis.bus.data.orm.type.LineStringEx;
import com.pgis.bus.net.models.TimeIntervalModel;
import com.pgis.bus.net.models.geom.PolyLineModel;

@XmlRootElement
public class RouteRelationModelEx implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 2102662846639639051L;

	/**
	 * ID дуги
	 */
	private int id;

	/**
	 * ID пути, которому принадлежит данная дуга
	 */
	private int routeWayID;

	/**
	 * Порядковый номер дуги в последовательности. Первая луга имеет порядковый номер 0.
	 */
	private int index;

	/**
	 * Географическая длина дуги ,м. Если данная дуга стоит первая в последовательности, то 0.
	 */
	private double distance;

	/**
	 * Среднее временя передвижения по данной дуге на транспорте. Если данная дуга стоит первая в последовательности, то
	 * null.
	 */
	private TimeIntervalModel move;

	/**
	 * Полилиния, описывающая передвижение от станции предыдущей дуги к станции текущей дуги. Если данная дуга стоит
	 * первая в последовательности, то null.
	 */
	private PolyLineModel geom;

	/**
	 * Станция, являющ. концом текущей дуги.
	 */
	private StationModelEx currStation;

	public RouteRelationModelEx() {

	}

	public RouteRelationModelEx(RouteRelation r) throws SQLException {
		this.id = r.getId();
		this.index = r.getPositionIndex();
		this.distance = r.getDistance();
		if (r.getMoveTime() != null)
			this.move = TimeIntervalModelFactory.createModel(r.getMoveTime());
		if (r.getGeom() != null)
			this.geom = r.getGeom().toModel();
		this.currStation = new StationModelEx(r.getStationB());
		this.routeWayID = r.getRouteWayID();

	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getIndex() {
		return index;
	}

	public void setIndex(int index) {
		this.index = index;
	}

	public double getDistance() {
		return distance;
	}

	public void setDistance(double distance) {
		this.distance = distance;
	}

	public TimeIntervalModel getMove() {
		return move;
	}

	public void setMove(TimeIntervalModel move) {
		this.move = move;
	}

	public PolyLineModel getGeom() {
		return geom;
	}

	public void setGeom(PolyLineModel geom) {
		this.geom = geom;
	}

	public int getRouteWayID() {
		return routeWayID;
	}

	public void setRouteWayID(int routeWayID) {
		this.routeWayID = routeWayID;
	}

	public StationModelEx getCurrStation() {
		return currStation;
	}

	public void setCurrStation(StationModelEx currStation) {
		this.currStation = currStation;
	}

	static public Collection<RouteRelationModelEx> createModels(Collection<RouteRelation> arr) throws SQLException {
		if (arr == null)
			return null;
		Collection<RouteRelationModelEx> models = new ArrayList<RouteRelationModelEx>();
		for (RouteRelation r : arr) {
			models.add(new RouteRelationModelEx(r));
		}
		return models;
	}

	public RouteRelation toORMObject(RouteRelationModelEx prevRelation) {
		RouteRelation r = new RouteRelation();
		r.setId(this.id);

		r.setMoveTime(PGIntervalHelper.fromModel(this.move));
		r.setDistance(this.distance);
		r.setPositionIndex(this.index);
		r.setRouteWayID(this.routeWayID);
		r.setStationBId(this.currStation.getId());
		if (this.geom != null)
			r.setGeom(new LineStringEx(this.geom));
		if (prevRelation != null)
			r.setStationAId(prevRelation.getCurrStation().getId());
		if (this.currStation.getId() <= 0) {
			r.setStationB(this.currStation.toORMObject());
		}
		return r;
	}

}
