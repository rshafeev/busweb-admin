package test.com.pgis.bus.admin.models;

import static org.junit.Assert.assertEquals;

import java.io.File;
import java.io.FileNotFoundException;
import java.sql.SQLException;
import java.util.ArrayList;

import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.oxm.xstream.XStreamMarshaller;
import org.springframework.util.ResourceUtils;

import test.com.pgis.bus.admin.controllers.RoutesControllerTest;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pgis.bus.admin.helpers.XStreamMarshallerHelper;
import com.pgis.bus.admin.models.StringValueModel;
import com.pgis.bus.admin.models.route.RouteModelEx;
import com.pgis.bus.data.orm.Route;
import com.pgis.bus.data.orm.RouteWay;
import com.pgis.bus.data.orm.StringValue;
import com.pgis.bus.data.orm.type.LangEnum;

public class RouteModelExTest {
	private static final Logger log = LoggerFactory.getLogger(RouteModelExTest.class);

	private Route route1 = null;

	@Before
	public void init() throws SQLException {
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

	@Test
	public void jsonSerialize() throws Exception {
		RouteModelEx requestModel = new RouteModelEx(route1);
		ObjectMapper json = new ObjectMapper();
		byte[] data = json.writeValueAsBytes(requestModel);
		RouteModelEx responeModel = json.readValue(data, RouteModelEx.class);
		assertEquals(requestModel.getId(), responeModel.getId());
	}

	@Test
	public void jsonDeserialize() throws Exception {
		ObjectMapper json = new ObjectMapper();

		String jsonInputModel = "{\"id\":270,\"cityID\":1,\"routeTypeID\":\"bus\",\"cost\":1,\"numberKey\":4058,"
				+ "\"number\":[{\"id\":13193,\"lang\":\"uk\",\"value\":\"3\"},{\"id\":13192,\"lang\":\"en\",\"value\":\"3\"},"
				+ "{\"id\":13191,\"lang\":\"ru\",\"value\":\"3\"}],\"directWay\":null,\"reverseWay\":null}";
		RouteModelEx responeModel = json.readValue(jsonInputModel, RouteModelEx.class);
		assertEquals(270, responeModel.getId().intValue());
	}

	@Test
	public void xmlDeserialize() throws Exception {

		File file = ResourceUtils.getFile(this.getClass().getResource("/routeModel1.json"));
		String jsonData = com.pgis.bus.data.helpers.FileManager.getFileData(file);

		ObjectMapper json = new ObjectMapper();
		RouteModelEx requestModel = json.readValue(jsonData, RouteModelEx.class);

		String xmlData = XStreamMarshallerHelper.marshal(requestModel);

		RouteModelEx responeModel = XStreamMarshallerHelper.unmarshal(xmlData, RouteModelEx.class);
		assertEquals(requestModel.getId(), responeModel.getId());
	}
}
