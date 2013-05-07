package test.com.pgis.bus.admin.models;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collection;

import org.junit.Before;
import org.junit.Test;
import org.postgresql.util.PGInterval;

import com.pgis.bus.admin.models.route.RouteWayModelEx;
import com.pgis.bus.data.orm.RouteRelation;
import com.pgis.bus.data.orm.RouteWay;
import com.pgis.bus.data.orm.Station;

public class RouteWayModelExTest {
	RouteWay routeWay = new RouteWay();

	@Before
	public void init() {
		Collection<RouteRelation> relations = new ArrayList<RouteRelation>();
		RouteRelation relation1 = new RouteRelation();
		Station st1 = new Station();
		Station st2 = new Station();
		st1.setLocation(10, 10);
		st1.setId(56);
		st2.setLocation(20, 20);
		st2.setId(615);

		relation1.setId(1);
		relation1.setRouteWayID(1);
		relation1.setDistance(200);
		relation1.setMoveTime(new PGInterval());
		relation1.setPositionIndex(2);
		relation1.setStationA(st1);
		relation1.setStationB(st2);
		relations.add(relation1);
		routeWay.setId(1);
		routeWay.setRouteID(2);
		routeWay.setDirect(true);
		routeWay.setRouteRelations(relations);
	}

	@Test
	public void test() throws SQLException {
		RouteWayModelEx model = new RouteWayModelEx(routeWay);
		assertEquals(routeWay.getId(), model.getId());
		assertEquals(routeWay.getRouteID(), model.getRouteID());
		assertEquals(routeWay.isDirect(), model.isDirect());
		assertTrue(model.getRelations().size() == routeWay.getRouteRelations().size());
	}
}
