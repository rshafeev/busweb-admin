package com.pgis.bus.admin.controllers;

import java.util.Collection;

import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;
import com.pgis.bus.admin.models.ErrorModel;
import com.pgis.bus.data.orm.Language;

@Controller
@RequestMapping(value = "langs/")
public class LangsController extends BaseController {
	private static final Logger log = LoggerFactory.getLogger(CitiesController.class);

	@ResponseBody
	@RequestMapping(value = "get_all", method = RequestMethod.POST)
	public String get_all(HttpServletResponse response) {
		try {
			String contentType = "text/html;charset=UTF-8";
			response.setContentType(contentType);
			response.setCharacterEncoding("utf-8");
			// Загрузим список всех городов из БД
			Collection<Language> langs = this.getDbService().Langs().getAll();
			log.debug("request: langs/get_all.json");
			return (new Gson()).toJson(langs);
		} catch (Exception e) {
			return (new Gson()).toJson(new ErrorModel(e));
		}

	}

}
