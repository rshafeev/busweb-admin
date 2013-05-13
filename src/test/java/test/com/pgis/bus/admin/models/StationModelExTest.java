package test.com.pgis.bus.admin.models;

import static org.junit.Assert.*;

import java.io.File;
import java.io.IOException;

import org.junit.Test;
import org.springframework.util.ResourceUtils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pgis.bus.admin.models.route.RouteModelEx;
import com.pgis.bus.admin.models.station.StationModelEx;
import com.pgis.bus.data.orm.Station;

public class StationModelExTest {

	@Test
	public void toORMObjectTest() throws Exception {
		File file = ResourceUtils.getFile(this.getClass().getResource("/stationModelEx1.json"));
		String jsonData = com.pgis.bus.data.helpers.FileManager.getFileData(file);

		ObjectMapper json = new ObjectMapper();
		StationModelEx stationModel = json.readValue(jsonData, StationModelEx.class);
		Station station = stationModel.toORMObject();

		assertEquals(stationModel.getId(), station.getId().intValue());
		assertEquals(stationModel.getNameKey(), station.getNameKey());
		assertEquals(stationModel.getCityID().intValue(), station.getCityID());

	}

}
