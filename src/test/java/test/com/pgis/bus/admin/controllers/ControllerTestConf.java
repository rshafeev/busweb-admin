package test.com.pgis.bus.admin.controllers;

import static org.springframework.test.web.server.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.server.result.MockMvcResultMatchers.redirectedUrl;

import javax.servlet.http.HttpSession;

import org.junit.Before;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.web.FilterChainProxy;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.web.server.MockMvc;
import org.springframework.test.web.server.MvcResult;
import org.springframework.test.web.server.ResultMatcher;

@ContextConfiguration(value = { "classpath:/security-test-manager.xml", "file:WebContent/WEB-INF/security.xml",
		"file:WebContent/WEB-INF/main-servlet.xml" })
public class ControllerTestConf {

	protected MockMvc mockMvc = null;
	protected SecurityContext securityContext = null;

	@Autowired
	protected FilterChainProxy springSecurityFilterChain;

	protected MockHttpSession getSession(String username, String password) throws Exception {
		mockMvc.perform(post("/j_spring_security_check").param("j_username", username).param("j_password", password))
				.andExpect(redirectedUrl("/")).andExpect(new ResultMatcher() {
					public void match(MvcResult mvcResult) throws Exception {
						HttpSession session = mvcResult.getRequest().getSession();
						securityContext = (SecurityContext) session
								.getAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY);
					}
				});
		MockHttpSession session = new MockHttpSession();
		session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, securityContext);
		return session;
	}

}
