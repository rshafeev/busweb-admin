package test.com.pgis.bus.admin.models;

import static org.junit.Assert.*;

import java.io.File;
import java.io.IOException;

import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.ResourceUtils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pgis.bus.admin.models.route.RouteModelEx;
import com.pgis.bus.admin.models.station.StationModelEx;
import com.pgis.bus.data.orm.Station;

public class StationModelExTest {
	private static final Logger log = LoggerFactory.getLogger(StationModelExTest.class);

	@Test
	public void toORMObjectTest() throws Exception {
		File file = ResourceUtils.getFile(this.getClass().getResource("/stationModelEx1.json"));
		String jsonData = com.pgis.bus.data.helpers.FileManager.getFileData(file);

		ObjectMapper json = new ObjectMapper();
		StationModelEx stationModel = json.readValue(jsonData, StationModelEx.class);
		Station station = stationModel.toORMObject();

		assertEquals(stationModel.getId(), station.getId());
		assertEquals(stationModel.getNameKey(), station.getNameKey());
		assertEquals(stationModel.getCityID(), station.getCityID());
		assertEquals(stationModel.getLocation().getLat(), station.getLocation().x, 0.000001);
		assertEquals(stationModel.getLocation().getLon(), station.getLocation().y, 0.000001);

	}

	@Test
	public void toORMObjectTest2() throws Exception {
		File file = ResourceUtils.getFile(this.getClass().getResource("/stationModelEx2.json"));
		String jsonData = com.pgis.bus.data.helpers.FileManager.getFileData(file);

		ObjectMapper json = new ObjectMapper();
		StationModelEx stationModel = json.readValue(jsonData, StationModelEx.class);
		Station station = stationModel.toORMObject();

		assertEquals(stationModel.getId(), station.getId());
		assertEquals(stationModel.getNameKey(), station.getNameKey());
		assertEquals(stationModel.getCityID(), station.getCityID());
		assertEquals(stationModel.getLocation().getLat(), station.getLocation().x, 0.000001);
		assertEquals(stationModel.getLocation().getLon(), station.getLocation().y, 0.000001);

	}
}
