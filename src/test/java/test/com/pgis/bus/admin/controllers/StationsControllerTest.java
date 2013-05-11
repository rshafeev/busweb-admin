package test.com.pgis.bus.admin.controllers;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doReturn;
import static org.springframework.test.web.server.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.server.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.server.setup.MockMvcBuilders.standaloneSetup;

import java.sql.SQLException;
import java.util.HashMap;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.web.FilterChainProxy;

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

public class StationsControllerTest extends ControllerTestConf {
	private static final Logger log = LoggerFactory.getLogger(RoutesControllerTest.class);

	private StationsController controller = null;

	@Autowired
	private FilterChainProxy springSecurityFilterChain;

	@Before
	public void before() throws SQLException {

		controller = new StationsController();
		this.mockMvc = standaloneSetup(controller).addFilters(this.springSecurityFilterChain).build();

	}

	@Test
	public void testGetStationsFromBox() throws Exception {
		log.info("testGetStationsFromBox() ");
		// Mocking
		StationsBoxModel model = new StationsBoxModel();
		model.setLtPoint(new PointModel(1,10));
		model.setRbPoint(new PointModel(2,20));
		model.setCityID(10);
		
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

		doNothing().when(stationsRepository).getStationsFromBox(cityID, p1, p2)(any(City.class));
		doReturn(stationsRepository).when(dbModelsService).Stations();

		controller.setDbService(dbService);
		controller.setModelsService(dbModelsService);

		// Input data
		CityModelEx requestModel = new CityModelEx(city);
		String jsonInputModel = (new ObjectMapper()).writeValueAsString(requestModel);
		// Testing
		log.info(jsonInputModel);
		MockHttpSession session = this.getSession("admin", "pass");

		MockHttpServletResponse response = this.mockMvc
				.perform(
						post("/stations/getStationsFromBox.json").contentType(MediaType.APPLICATION_JSON)
								.accept(MediaType.APPLICATION_JSON).body(jsonInputModel.getBytes()).session(session))
				.andDo(print()).andReturn().getResponse();

		log.info("CODE : " + response.getStatus());
		log.info("RESULT : " + response.getContentAsString());
		// Check
		CityModelEx responseModel = (new ObjectMapper()).readValue(response.getContentAsString(), CityModelEx.class);
		assertEquals(requestModel.getId(), responseModel.getId());
	}
}
