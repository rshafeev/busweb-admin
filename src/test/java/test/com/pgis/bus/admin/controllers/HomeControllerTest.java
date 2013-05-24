package test.com.pgis.bus.admin.controllers;

import static org.springframework.test.web.server.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.server.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.server.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.server.setup.MockMvcBuilders.standaloneSetup;

import java.sql.SQLException;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.web.FilterChainProxy;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.pgis.bus.admin.controllers.HomeController;

@RunWith(SpringJUnit4ClassRunner.class)
public class HomeControllerTest extends ControllerTestConf {
	private static final Logger log = LoggerFactory.getLogger(HomeControllerTest.class);
	private HomeController controller = null;

	@Before
	public void before() throws SQLException {

		controller = new HomeController();
		this.mockMvc = standaloneSetup(controller).addFilters(this.springSecurityFilterChain).build();

	}

	@Test
	public void testHomePage() throws Exception {
		MockHttpSession session = this.getSession("admin", "pass");
		log.info("testLoginPage() ");

		MockHttpServletResponse response = this.mockMvc.perform(get("/").session(session)).andDo(print())
				.andExpect(status().isOk()).andReturn().getResponse();
	}
}
