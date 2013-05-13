package test.com.pgis.bus.admin.controllers;

import static org.springframework.test.web.server.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.server.result.MockMvcResultHandlers.*;
import static org.springframework.test.web.server.setup.MockMvcBuilders.*;

import java.sql.SQLException;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.pgis.bus.admin.controllers.AuthController;

@RunWith(SpringJUnit4ClassRunner.class)
public class AuthControllerTest extends ControllerTestConf {

	private static final Logger log = LoggerFactory.getLogger(AuthControllerTest.class);
	private AuthController controller = null;

	@Before
	public void before() throws SQLException {
		controller = new AuthController();
		this.mockMvc = standaloneSetup(controller).addFilters(super.springSecurityFilterChain).build();
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
