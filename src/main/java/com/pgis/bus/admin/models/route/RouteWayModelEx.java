package com.pgis.bus.admin.models.route;

import java.io.Serializable;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collection;

import com.pgis.bus.data.orm.RouteRelation;
import com.pgis.bus.data.orm.RouteWay;
import com.pgis.bus.data.orm.Schedule;
import com.pgis.bus.net.models.route.ScheduleModel;

/**
 * Модель пути маршрута. Каждый маршрут имеет два пути: прямой и обратный. Объект класса RouteWayModel хранит
 * последовательность остановок, посещаемых по данному марщруту, массив географических точек, описывающих путь,
 * расписание выезда из начальной станции.
 */
/**
 * @author romario
 * 
 */
public class RouteWayModelEx implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 4605157627908570136L;

	/**
	 * ID пути
	 */
	private int id;

	/**
	 * ID маршрута, которому принадлежит данный путь
	 */
	private int routeID;

	/**
	 * Прямой или обратный путь?
	 */
	private boolean direct;

	/**
	 * Географическое описание пути. Данная коллекция хранит последовательность станций пути, географическое описание
	 * пути в виде массива точек между станциями.
	 */
	private Collection<RouteRelationModelEx> relations;

	/**
	 * Расписание выезда из начальной станции.
	 */
	private ScheduleModel schedule;

	public RouteWayModelEx() {

	}

	public RouteWayModelEx(RouteWay routeWay) throws SQLException {
		if (routeWay == null)
			return;
		this.id = routeWay.getId();
		this.routeID = routeWay.getRouteID();
		this.direct = routeWay.isDirect();
		this.relations = RouteRelationModelEx.createModels(routeWay.getRouteRelations());
		Schedule s = routeWay.getSchedule();
		if (s != null)
			this.schedule = s.toModel();

	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getRouteID() {
		return routeID;
	}

	public void setRouteID(int routeID) {
		this.routeID = routeID;
	}

	public boolean isDirect() {
		return direct;
	}

	public void setDirect(boolean direct) {
		this.direct = direct;
	}

	public Collection<RouteRelationModelEx> getRelations() {
		return relations;
	}

	public void setRelations(Collection<RouteRelationModelEx> relations) {
		this.relations = relations;
	}

	public ScheduleModel getSchedule() {
		return schedule;
	}

	public void setSchedule(ScheduleModel schedule) {
		this.schedule = schedule;
	}

	public RouteWay toORMObject() {
		RouteWay routeWay = new RouteWay();
		routeWay.setId(routeWay.getId());
		routeWay.setDirect(this.direct);
		routeWay.setSchedule(new Schedule(this.schedule));
		routeWay.setRouteID(this.routeID);
		Collection<RouteRelation> rels = new ArrayList<RouteRelation>();
		if (this.relations != null) {
			RouteRelationModelEx prevRelation = null;
			for (RouteRelationModelEx currRelation : this.relations) {
				rels.add(currRelation.toORMObject(prevRelation));
				prevRelation = currRelation;
			}
		}
		routeWay.setRouteRelations(rels);
		return routeWay;
	}
}
