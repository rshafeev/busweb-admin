package test.com.pgis.bus.admin.controllers;

import static org.springframework.test.web.server.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.server.result.MockMvcResultHandlers.*;
import static org.springframework.test.web.server.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.server.setup.MockMvcBuilders.*;

import java.sql.SQLException;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.FilterChainProxy;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.web.server.MockMvc;

import com.pgis.bus.admin.controllers.AuthController;
import com.pgis.bus.admin.controllers.RoutesController;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(value = { "classpath:/security-test-manager.xml", "file:WebContent/WEB-INF/security.xml",
		"file:WebContent/WEB-INF/main-servlet.xml" })
public class AuthControllerTest extends ControllerTestConf {

	private static final Logger log = LoggerFactory.getLogger(AuthControllerTest.class);

	private MockMvc mockMvc = null;
	private AuthController controller = null;
	private SecurityContext securityContext = null;

	@Autowired
	private FilterChainProxy springSecurityFilterChain;

	@Before
	public void before() throws SQLException {

		controller = new AuthController();
		this.mockMvc = standaloneSetup(controller).addFilters(this.springSecurityFilterChain).build();

	}

	@After
	public void after() {
		SecurityContextHolder.clearContext();
	}

	@Test
	public void testLoginPage() throws Exception {
		log.info("testLoginPage() ");
		MockHttpServletResponse response = this.mockMvc.perform(get("/login")).andDo(print()).andReturn().getResponse();

		// .alwaysExpect(status().isOk())
		log.info("CODE : " + response.getStatus());
		log.info("RESULT : " + response.getContentAsString());
	}

}
