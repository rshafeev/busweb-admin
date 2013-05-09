package test.com.pgis.bus.admin.controllers;

import static org.mockito.Mockito.doReturn;
import static org.springframework.test.web.server.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.server.setup.MockMvcBuilders.*;
import static org.springframework.test.web.server.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.server.result.MockMvcResultMatchers.*;
import static org.junit.Assert.*;

import java.awt.Event;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpSession;

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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.authority.GrantedAuthorityImpl;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.FilterChainProxy;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.web.server.MockMvc;
import org.springframework.test.web.server.MvcResult;
import org.springframework.test.web.server.ResultMatcher;
import org.springframework.test.web.server.request.MockHttpServletRequestBuilder;

import test.com.pgis.bus.admin.SecurityRequestPostProcessors;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.pgis.bus.admin.controllers.RoutesController;
import com.pgis.bus.admin.models.CustomUserAuthentication;
import com.pgis.bus.admin.models.route.RouteModelEx;
import com.pgis.bus.data.orm.Route;
import com.pgis.bus.data.repositories.orm.IRoutesRepository;
import com.pgis.bus.data.service.IDataBaseService;
import com.pgis.bus.data.service.IDataModelsService;
import com.pgis.bus.net.models.geom.PointModel;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(value = { "file:WebContent/WEB-INF/security-test-manager.xml",
		"file:WebContent/WEB-INF/security.xml", "file:WebContent/WEB-INF/main-servlet.xml" })
public class RoutesControllerTest {

	private static final Logger log = LoggerFactory.getLogger(RoutesControllerTest.class);

	private MockMvc mockMvc;
	private RoutesController controller;
	private SecurityContext securityContext = null;
	private static String SEC_CONTEXT_ATTR = HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY;

	@Autowired
	private FilterChainProxy springSecurityFilterChain;

	@Before
	public void before() throws SQLException {

		controller = new RoutesController();
		this.mockMvc = standaloneSetup(controller).addFilters(this.springSecurityFilterChain).build();

	}

	@After
	public void teardown() {
		SecurityContextHolder.clearContext();
	}

	@Test
	public void testGetRequestWithoutAuth() throws Exception {
		MockHttpServletResponse response = this.mockMvc.perform(post("/routes//get").param("routeID", "100"))
				.andDo(print()).andExpect(redirectedUrl("http://localhost/login")).andReturn().getResponse();

		// .alwaysExpect(status().isOk())
		log.info("CODE : " + response.getStatus());
		log.info("RESULT : " + response.getContentAsString());
	}

	@Test
	public void testGetRequest() throws Exception {

		MockHttpServletResponse response = this.mockMvc.perform(post("/routes//get").param("routeID", "100"))
				.andExpect(redirectedUrl("http://localhost/login")).andReturn().getResponse();
		log.info("CODE : " + response.getStatus());
		log.info("RESULT : " + response.getContentAsString());
	}

	private MockHttpSession getSession(String username, String password) throws Exception {
		mockMvc.perform(post("/j_spring_security_check").param("j_username", username).param("j_password", password))
				.andExpect(redirectedUrl("/")).andExpect(new ResultMatcher() {
					public void match(MvcResult mvcResult) throws Exception {
						HttpSession session = mvcResult.getRequest().getSession();
						securityContext = (SecurityContext) session.getAttribute(SEC_CONTEXT_ATTR);
					}
				});
		MockHttpSession session = new MockHttpSession();
		session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, securityContext);
		return session;
	}

	@Test
	public void testGet() throws Exception {
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
				.perform(post("/routes//get").param("routeID", "100").session(session)).andReturn().getResponse();

		// Check
		RouteModelEx model = (new Gson()).fromJson(response.getContentAsString(), RouteModelEx.class);
		assertEquals(route.getId(), model.getId());
		log.info("CODE : " + response.getStatus());
		log.info("RESULT : " + response.getContentAsString());
	}

	@Test
	public void testUpdate() throws Exception {
		// Mocking
		Route route = new Route();
		route.setId(11);
		route.setCityID(111);
		route.setRouteTypeID("c_route_metro");
		IDataModelsService dbModelsService = Mockito.mock(IDataModelsService.class);
		IDataBaseService dbService = Mockito.mock(IDataBaseService.class);
		IRoutesRepository routesRepository = Mockito.mock(IRoutesRepository.class);
		doReturn(route).when(routesRepository).get(100);
		doReturn(routesRepository).when(dbService).Routes();
		controller.setDbService(dbService);
		controller.setModelsService(dbModelsService);

		// Input data
		RouteModelEx requestModel = new RouteModelEx(route);
		String jsonInputModel = (new Gson()).toJson(requestModel);
		// jsonInputModel = "{\"route\":" + jsonInputModel + "}";
		// Testing
		log.info(jsonInputModel);
		MockHttpSession session = this.getSession("admin", "pass");

		MockHttpServletResponse response = this.mockMvc
				.perform(
						post("/routes/update").contentType(MediaType.APPLICATION_JSON).body(jsonInputModel.getBytes())
								.session(session)).andDo(print()).andReturn().getResponse();

		log.info("CODE : " + response.getStatus());
		log.info("RESULT : " + response.getContentAsString());
		// Check
		RouteModelEx responseModel = (new Gson()).fromJson(response.getContentAsString(), RouteModelEx.class);
		assertEquals(requestModel.getId(), responseModel.getId());

	}

}