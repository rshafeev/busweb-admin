package com.pgis.bus.admin.controllers;

import java.util.Locale;

import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.pgis.bus.admin.models.CustomUserAuthentication;
import com.pgis.bus.admin.models.LoginPageModel;
import com.pgis.bus.admin.models.PageModel;

@Controller
@RequestMapping(value = "/")
public class HomeController {
	@RequestMapping(value = "")
	public ModelAndView index(Integer login_error) {
		PageModel model = new PageModel();
		Locale locale = LocaleContextHolder.getLocale();
		model.setLanguage(locale);
		return new ModelAndView("home", "model", model);
	}
}
