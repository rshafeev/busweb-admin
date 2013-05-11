package com.pgis.bus.admin.controllers;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.pgis.bus.admin.models.CustomUserAuthentication;
import com.pgis.bus.admin.models.LoginPageModel;

@Controller
@RequestMapping(value = "/")
public class AuthController extends BaseController {

	@RequestMapping(value = "login")
	public ModelAndView login(Integer login_error) {

		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication instanceof CustomUserAuthentication) {
			if (((CustomUserAuthentication) authentication).isAuthenticated())
				return new ModelAndView("redirect:/");

		}

		LoginPageModel model = new LoginPageModel();
		if (authentication != null)
			model.setLoginName((String) authentication.getPrincipal());
		if (login_error == null) {
			model.setLoginFailed(false);
			model.setPassFailed(false);
		} else {
			model.setLoginFailed(true);
			model.setPassFailed(true);
		}

		return new ModelAndView("login1", "model", model);
	}

}
