package test.com.pgis.bus.admin.controllers;

import static org.junit.Assert.*;
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
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.web.FilterChainProxy;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pgis.bus.admin.controllers.CitiesController;
import com.pgis.bus.admin.controllers.RoutesController;
import com.pgis.bus.admin.models.city.CityModelEx;
import com.pgis.bus.admin.models.route.RouteModelEx;
import com.pgis.bus.data.orm.City;
import com.pgis.bus.data.orm.Route;
import com.pgis.bus.data.orm.StringValue;
import com.pgis.bus.data.orm.type.LangEnum;
import com.pgis.bus.data.repositories.orm.ICitiesRepository;
import com.pgis.bus.data.repositories.orm.IRoutesRepository;
import com.pgis.bus.data.service.IDataBaseService;
import com.pgis.bus.data.service.IDataModelsService;
import com.pgis.bus.net.models.city.CityModel;

public class CitiesControllerTest extends ControllerTestConf {
	private static final Logger log = LoggerFactory.getLogger(RoutesControllerTest.class);

	private CitiesController controller = null;

	@Autowired
	private FilterChainProxy springSecurityFilterChain;

	@Before
	public void before() throws SQLException {

		controller = new CitiesController();
		this.mockMvc = standaloneSetup(controller).addFilters(this.springSecurityFilterChain).build();

	}

	@Test
	public void testUpdate() throws Exception {
		log.info("testUpdate() ");
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
		IDataBaseService dbService = Mockito.mock(IDataBaseService.class);
		ICitiesRepository citiesRepository = Mockito.mock(ICitiesRepository.class);
		doNothing().when(citiesRepository).update(any(City.class));
		doReturn(citiesRepository).when(dbService).Cities();

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
						post("/cities/update").contentType(MediaType.APPLICATION_JSON)
								.accept(MediaType.APPLICATION_JSON).body(jsonInputModel.getBytes()).session(session))
				.andDo(print()).andReturn().getResponse();

		log.info("CODE : " + response.getStatus());
		log.info("RESULT : " + response.getContentAsString());
		// Check
		CityModelEx responseModel = (new ObjectMapper()).readValue(response.getContentAsString(), CityModelEx.class);
		assertEquals(requestModel.getId(), responseModel.getId());
	}
}
