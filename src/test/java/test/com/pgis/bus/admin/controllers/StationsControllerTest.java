package test.com.pgis.bus.admin.controllers;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doReturn;
import static org.springframework.test.web.server.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.server.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.server.setup.MockMvcBuilders.standaloneSetup;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.postgis.Point;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.web.FilterChainProxy;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pgis.bus.admin.controllers.CitiesController;
import com.pgis.bus.admin.controllers.StationsController;
import com.pgis.bus.admin.models.city.CityModelEx;
import com.pgis.bus.admin.models.station.StationsBoxModel;
import com.pgis.bus.data.orm.City;
import com.pgis.bus.data.orm.StringValue;
import com.pgis.bus.data.orm.type.LangEnum;
import com.pgis.bus.data.repositories.model.IStationsModelRepository;
import com.pgis.bus.data.repositories.orm.ICitiesRepository;
import com.pgis.bus.data.service.IDataBaseService;
import com.pgis.bus.data.service.IDataModelsService;
import com.pgis.bus.net.models.geom.PointModel;
import com.pgis.bus.net.models.station.StationModel;

@RunWith(SpringJUnit4ClassRunner.class)
public class StationsControllerTest extends ControllerTestConf {
	private static final Logger log = LoggerFactory.getLogger(RoutesControllerTest.class);

	private StationsController controller = null;

	@Before
	public void before() throws SQLException {
		controller = new StationsController();
		this.mockMvc = standaloneSetup(controller).addFilters(super.springSecurityFilterChain).build();

	}

	@Test
	public void testGetStationsFromBox() throws Exception {
		log.info("testGetStationsFromBox() ");
		// Data

		StationsBoxModel requestModel = new StationsBoxModel();
		requestModel.setLtPoint(new PointModel(1, 10));
		requestModel.setRbPoint(new PointModel(2, 20));
		requestModel.setCityID(10);

		Collection<StationModel> stations = new ArrayList<StationModel>();
		stations.add(new StationModel(10, "st1", new PointModel(10, 20)));
		stations.add(new StationModel(10, "st2", new PointModel(10, 20)));

		// Mocking

		HashMap<LangEnum, StringValue> name = new HashMap<LangEnum, StringValue>();
		name.put(LangEnum.c_en, new StringValue(3253, 55435, LangEnum.c_en, "Kharkiv"));
		City city = new City();
		city.setId(11);
		city.setKey("kharkiv");
		city.setLat(50);
		city.setLon(100);
		city.setShow(true);
		city.setNameKey(55435);
		city.setName(name);
		IDataModelsService dbModelsService = Mockito.mock(IDataModelsService.class);
		IStationsModelRepository stationsRepository = Mockito.mock(IStationsModelRepository.class);

		doReturn(stations).when(stationsRepository).getStationsFromBox(any(Integer.class), any(Point.class),
				any(Point.class));
		doReturn(stationsRepository).when(dbModelsService).Stations();
		controller.setModelsService(dbModelsService);

		// Input data
		String jsonRequestModel = (new ObjectMapper()).writeValueAsString(requestModel);
		// Testing
		log.info(jsonRequestModel);
		MockHttpSession session = this.getSession("admin", "pass");

		MockHttpServletResponse response = this.mockMvc
				.perform(
						post("/stations/getStationsFromBox.json").contentType(MediaType.APPLICATION_JSON)
								.accept(MediaType.APPLICATION_JSON).body(jsonRequestModel.getBytes()).session(session))
				.andDo(print()).andReturn().getResponse();

		log.info("CODE : " + response.getStatus());
		log.info("RESULT : " + response.getContentAsString());
		// Check
		StationsBoxModel responseModel = (new ObjectMapper()).readValue(response.getContentAsString(),
				StationsBoxModel.class);

		assertEquals(requestModel.getCityID(), responseModel.getCityID());
	}
}
