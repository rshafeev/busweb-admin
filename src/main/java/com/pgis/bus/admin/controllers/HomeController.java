package com.pgis.bus.admin.controllers;

import java.util.Locale;

import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;
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

	@RequestMapping(value = "apidocs")
	public ModelAndView apidocs(Integer login_error) {
		return new ModelAndView("redirect:/apidocs/index.html");
	}

	@RequestMapping(value = "tests")
	public ModelAndView tests(Integer login_error) {
		return new ModelAndView("redirect:/tests/index.html");
	}
}
