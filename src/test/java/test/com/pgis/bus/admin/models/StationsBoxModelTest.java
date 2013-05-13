package test.com.pgis.bus.admin.models;

import static org.junit.Assert.assertEquals;

import java.util.ArrayList;
import java.util.Collection;

import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pgis.bus.admin.helpers.XStreamMarshallerHelper;
import com.pgis.bus.admin.models.station.StationsBoxModel;
import com.pgis.bus.net.models.geom.PointModel;
import com.pgis.bus.net.models.station.StationModel;

public class StationsBoxModelTest {
	private static final Logger log = LoggerFactory.getLogger(StationsBoxModelTest.class);

	@Test
	public void jsonSerializeTest() throws Exception {
		log.info("jsonSerializeTest() ");
		// Data

		StationsBoxModel requestModel = new StationsBoxModel();
		requestModel.setLtPoint(new PointModel(1, 10));
		requestModel.setRbPoint(new PointModel(2, 20));
		requestModel.setCityID(10);

		Collection<StationModel> stations = new ArrayList<StationModel>();
		stations.add(new StationModel(10, "st1", new PointModel(10, 20)));
		stations.add(new StationModel(10, "st2", new PointModel(10, 20)));
		requestModel.setStations(stations);

		// Test
		ObjectMapper mapper = new ObjectMapper();
		String jsonData = mapper.writeValueAsString(requestModel);
		log.info(jsonData);
		StationsBoxModel responeModel = mapper.readValue(jsonData, StationsBoxModel.class);
		assertEquals(requestModel.getCityID(), responeModel.getCityID());
	}

	@Test
	public void xmlSerializeTest() throws Exception {
		log.info("xmlSerializeTest() ");
		// Data

		StationsBoxModel requestModel = new StationsBoxModel();
		requestModel.setLtPoint(new PointModel(1, 10));
		requestModel.setRbPoint(new PointModel(2, 20));
		requestModel.setCityID(10);

		Collection<StationModel> stations = new ArrayList<StationModel>();
		stations.add(new StationModel(10, "st1", new PointModel(10, 20)));
		stations.add(new StationModel(10, "st2", new PointModel(10, 20)));
		requestModel.setStations(stations);

		String xmlData = XStreamMarshallerHelper.marshal(requestModel);
		log.info(xmlData);
		// Test
		StationsBoxModel responeModel = XStreamMarshallerHelper.unmarshal(xmlData, StationsBoxModel.class);
		assertEquals(requestModel.getCityID(), responeModel.getCityID());
	}
}
