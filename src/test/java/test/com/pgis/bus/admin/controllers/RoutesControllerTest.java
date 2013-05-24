package test.com.pgis.bus.admin.controllers;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.server.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.server.setup.MockMvcBuilders.*;
import static org.springframework.test.web.server.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.server.result.MockMvcResultMatchers.*;
import static org.junit.Assert.*;

import java.sql.SQLException;

import org.junit.After;
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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.FilterChainProxy;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.web.server.ResultActions;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pgis.bus.admin.controllers.RoutesController;
import com.pgis.bus.admin.helpers.XStreamMarshallerHelper;
import com.pgis.bus.admin.models.route.RouteModelEx;
import com.pgis.bus.data.orm.Route;
import com.pgis.bus.data.repositories.orm.IRoutesRepository;
import com.pgis.bus.data.service.IDataBaseService;
import com.pgis.bus.data.service.IDataModelsService;

@RunWith(SpringJUnit4ClassRunner.class)
public class RoutesControllerTest extends ControllerTestConf {

	private static final Logger log = LoggerFactory.getLogger(RoutesControllerTest.class);

	private RoutesController controller = null;

	@Before
	public void before() throws SQLException {

		controller = new RoutesController();
		this.mockMvc = standaloneSetup(controller).addFilters(this.springSecurityFilterChain).build();

	}

	@Test
	public void testGetRequestWithoutAuth() throws Exception {
		log.info("testGetRequestWithoutAuth() ");
		MockHttpServletResponse response = this.mockMvc.perform(post("/routes//get").param("routeID", "100"))
				.andDo(print()).andExpect(redirectedUrl("http://localhost/login")).andReturn().getResponse();

	}

	@Test
	public void testGet() throws Exception {
		log.info("testGet() ");
		// Mocking
		Route route = new Route();
		route.setId(11);
		route.setRouteTypeID("c_route_metro");
		IDataModelsService dbModelsService = Mockito.mock(IDataModelsService.class);
		IDataBaseService dbService = Mockito.mock(IDataBaseService.class);
		IRoutesRepository routesRepository = Mockito.mock(IRoutesRepository.class);
		doReturn(route).when(routesRepository).get(100);
		doReturn(routesRepository).when(dbService).Routes();
		controller.setDbService(dbService);
		controller.setModelsService(dbModelsService);

		// Testing
		MockHttpSession session = this.getSession("admin", "pass");
		MockHttpServletResponse response = this.mockMvc
				.perform(get("/routes/get.json").param("routeID", "100").session(session)).andDo(print()).andReturn()
				.getResponse();

		// Check
		RouteModelEx model = (new ObjectMapper()).readValue(response.getContentAsString(), RouteModelEx.class);
		assertEquals(route.getId(), model.getId());

	}

	@Test
	public void testUpdate() throws Exception {
		log.info("testUpdate() ");
		// Mocking
		Route route = new Route();
		route.setId(11);
		route.setCityID(111);
		route.setRouteTypeID("c_route_metro");

		IDataModelsService dbModelsService = Mockito.mock(IDataModelsService.class);
		IDataBaseService dbService = Mockito.mock(IDataBaseService.class);
		IRoutesRepository routesRepository = Mockito.mock(IRoutesRepository.class);
		doNothing().when(routesRepository).update(any(Route.class));
		doReturn(route).when(routesRepository).get(anyInt());

		doReturn(routesRepository).when(dbService).Routes();

		controller.setDbService(dbService);
		controller.setModelsService(dbModelsService);

		// Input data
		RouteModelEx requestModel = new RouteModelEx(route);
		String jsonInputModel = (new ObjectMapper()).writeValueAsString(requestModel);
		// Testing
		MockHttpSession session = this.getSession("admin", "pass");

		MockHttpServletResponse response = this.mockMvc
				.perform(
						post("/routes/update").contentType(MediaType.APPLICATION_JSON)
								.accept(MediaType.APPLICATION_XML).accept(MediaType.APPLICATION_JSON)
								.body(jsonInputModel.getBytes()).session(session)).andDo(print()).andReturn()
				.getResponse();
		// Check
		RouteModelEx responseModel = (new ObjectMapper()).readValue(response.getContentAsString(), RouteModelEx.class);
		assertEquals(requestModel.getId(), responseModel.getId());

	}

	@Test
	public void testUpdate2() throws Exception {
		log.info("testUpdate2() ");
		// Input data
		String jsonInputModel = "{\"id\":270,\"cityID\":1,\"routeTypeID\":\"bus\",\"cost\":1,\"numberKey\":4058,"
				+ "\"number\":[{\"id\":13193,\"lang\":\"uk\",\"value\":\"3\"},{\"id\":13192,\"lang\":\"en\",\"value\":\"3\"},"
				+ "{\"id\":13191,\"lang\":\"ru\",\"value\":\"3\"}],\"directWay\":null,\"reverseWay\":null}";

		// Mocking
		IDataModelsService dbModelsService = Mockito.mock(IDataModelsService.class);
		IDataBaseService dbService = Mockito.mock(IDataBaseService.class);
		IRoutesRepository routesRepository = Mockito.mock(IRoutesRepository.class);
		doReturn(routesRepository).when(dbService).Routes();
		doReturn((new ObjectMapper()).readValue(jsonInputModel, RouteModelEx.class).toORMObject()).when(
				routesRepository).get(270);
		controller.setDbService(dbService);
		controller.setModelsService(dbModelsService);

		// Testing
		MockHttpSession session = this.getSession("admin", "pass");

		MockHttpServletResponse response = this.mockMvc
				.perform(
						post("/routes/update.json").contentType(MediaType.APPLICATION_JSON)
								.body(jsonInputModel.getBytes()).session(session)).andDo(print()).andReturn()
				.getResponse();

		// Check
		RouteModelEx responseModel = (new ObjectMapper()).readValue(response.getContentAsString(), RouteModelEx.class);
		assertEquals(270, responseModel.getId().intValue());

	}

	@Test
	public void testGetXML() throws Exception {
		log.info("testGetXML() ");
		// Mocking

		Route route = new Route();
		route.setId(11);
		route.setRouteTypeID("c_route_metro");
		IDataModelsService dbModelsService = Mockito.mock(IDataModelsService.class);
		IDataBaseService dbService = Mockito.mock(IDataBaseService.class);
		IRoutesRepository routesRepository = Mockito.mock(IRoutesRepository.class);
		doReturn(route).when(routesRepository).get(100);
		doReturn(routesRepository).when(dbService).Routes();
		controller.setDbService(dbService);
		controller.setModelsService(dbModelsService);

		// Testing
		MockHttpSession session = this.getSession("admin", "pass");
		MockHttpServletResponse response = this.mockMvc
				.perform(
						post("/routes//get").param("routeID", "100").session(session).accept(MediaType.APPLICATION_XML))
				.andDo(print()).andReturn().getResponse();

	}

	@Test
	public void testUpdateXML() throws Exception {
		log.info("testUpdateXML() ");
		// Mocking
		IDataModelsService dbModelsService = Mockito.mock(IDataModelsService.class);
		IDataBaseService dbService = Mockito.mock(IDataBaseService.class);
		IRoutesRepository routesRepository = Mockito.mock(IRoutesRepository.class);
		doReturn(routesRepository).when(dbService).Routes();
		controller.setDbService(dbService);
		controller.setModelsService(dbModelsService);

		// Input data
		String xmlRequestModel = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><routeModelEx>"
				+ "<cityID>0</cityID><cost>0.0</cost><directWay><direct>false</direct><id>0</id>"
				+ "<routeID>0</routeID></directWay><id>11</id><numberKey>0</numberKey>"
				+ "<reverseWay><direct>false</direct><id>0</id><routeID>0</routeID></reverseWay>"
				+ "<routeTypeID>metro</routeTypeID></routeModelEx>";
		// Testing
		MockHttpSession session = this.getSession("admin", "pass");
		// .contentType(MediaType.APPLICATION_JSON)
		ResultActions actions = this.mockMvc.perform(post("/routes/update.xml").contentType(MediaType.APPLICATION_XML)
				.accept(MediaType.APPLICATION_XML).body(xmlRequestModel.getBytes()).session(session));
		actions.andDo(print());

		actions.andExpect(status().isOk());

		MockHttpServletResponse response = actions.andReturn().getResponse();

	}

	@Test
	public void testUpdateXML2() throws Exception {
		log.info("testGetXML2() ");
		// Input data
		String xmlRequestModel = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><routeModelEx>"
				+ "<cityID>0</cityID><cost>0.0</cost><directWay><direct>false</direct><id>0</id>"
				+ "<routeID>0</routeID></directWay><id>11</id><numberKey>0</numberKey>"
				+ "<reverseWay><direct>false</direct><id>0</id><routeID>0</routeID></reverseWay>"
				+ "<routeTypeID>metro</routeTypeID></routeModelEx>";

		// Mocking
		IDataModelsService dbModelsService = Mockito.mock(IDataModelsService.class);
		IDataBaseService dbService = Mockito.mock(IDataBaseService.class);
		IRoutesRepository routesRepository = Mockito.mock(IRoutesRepository.class);
		doReturn(routesRepository).when(dbService).Routes();
		doReturn(XStreamMarshallerHelper.unmarshal(xmlRequestModel, RouteModelEx.class).toORMObject()).when(
				routesRepository).get(anyInt());
		controller.setDbService(dbService);
		controller.setModelsService(dbModelsService);

		// Testing
		MockHttpSession session = this.getSession("admin", "pass");

		MockHttpServletResponse response = this.mockMvc
				.perform(
						post("/routes/update.xml").contentType(MediaType.APPLICATION_XML)
								.body(xmlRequestModel.getBytes()).session(session)).andDo(print()).andReturn()
				.getResponse();
		RouteModelEx responseModel = XStreamMarshallerHelper.unmarshal(response.getContentAsString(),
				RouteModelEx.class);
		assertEquals(11, (int) responseModel.getId());

	}
}