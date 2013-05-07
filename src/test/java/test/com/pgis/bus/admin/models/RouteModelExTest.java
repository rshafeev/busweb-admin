package test.com.pgis.bus.admin.models;

import static org.junit.Assert.assertEquals;

import java.sql.SQLException;
import java.util.ArrayList;

import org.junit.Before;
import org.junit.Test;

import com.pgis.bus.admin.models.StringValueModel;
import com.pgis.bus.admin.models.route.RouteModelEx;
import com.pgis.bus.data.orm.Route;
import com.pgis.bus.data.orm.RouteWay;
import com.pgis.bus.data.orm.StringValue;
import com.pgis.bus.data.orm.type.LangEnum;

public class RouteModelExTest {

	private Route route1 = null;

	@Before
	public void init() {

		/*
		 * Schedule dSchedule = new Schedule(); dSchedule.setId(1); dSchedule.setRouteWayId(10);
		 * 
		 * Schedule rSchedule = new Schedule(); rSchedule.setId(1); rSchedule.setRouteWayId(10);
		 */

		RouteWay directWay = new RouteWay();
		directWay.setId(10);
		directWay.setRouteID(1000);
		directWay.setDirect(true);

		RouteWay reverseWay = new RouteWay();
		reverseWay.setId(11);
		reverseWay.setRouteID(1000);
		reverseWay.setDirect(false);

		ArrayList<StringValue> number = new ArrayList<StringValue>();

		number.add(new StringValue(1, 2, LangEnum.c_en, "41e"));
		number.add(new StringValue(1, 2, LangEnum.c_ru, "41э"));

		// Заполним данными объект route1
		route1 = new Route();
		route1.setCityID(1);
		route1.setCost(2.0);
		route1.setId(1000);
		route1.setNumber(number);
		route1.setNumberKey(2);
		route1.setDirectRouteWay(directWay);
		route1.setRouteTypeID("c_route_tram");
		route1.setReverseRouteWay(reverseWay);

	}

	@Test
	public void initTest() throws SQLException {
		RouteModelEx model = new RouteModelEx(route1);

		assertEquals(route1.getId(), model.getId());
		assertEquals(route1.getCityID(), model.getCityID());
		assertEquals("tram", model.getRouteTypeID());
		assertEquals(route1.getNumberKey(), model.getNumberKey());
		assertEquals(route1.getCost(), model.getCost(), 0.000001);

		for (StringValueModel numberModel : model.getNumber()) {
			StringValue number = route1.getValNumber(LangEnum.valueOf(numberModel.getLang()));
			assertEquals(number.getId().intValue(), numberModel.getId());
			assertEquals(number.getValue(), numberModel.getValue());
		}

		assertEquals(route1.getDirectRouteWay().getId(), model.getDirectWay().getId());
		assertEquals(route1.getReverseRouteWay().getId(), model.getReverseWay().getId());

	}

}
