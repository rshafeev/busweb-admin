package com.pgis.bus.admin.controllers;

import java.util.ArrayList;
import java.util.Locale;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;
import com.pgis.bus.data.IDataBaseService;
import com.pgis.bus.data.impl.DataBaseService;
import com.pgis.bus.data.orm.City;
import com.pgis.bus.data.repositories.RepositoryException;
import com.pgis.bus.server.models.CitiesModel;
import com.pgis.bus.server.models.CityModel;

@Controller
@RequestMapping(value = "cities/")
public class CitiesController {
	private static final Logger log = LoggerFactory
			.getLogger(CitiesController.class);

	@ResponseBody
	@RequestMapping(value = "get_all.htm", method = RequestMethod.POST)
	public String get_all() {
		
		try {
			
			// Загрузим список всех городов из БД
			IDataBaseService db = new DataBaseService();
			ArrayList<City> cities = db.getAllCities();
			
			// Отправим модель в формате GSON клиенту
			return  (new Gson()).toJson(cities);
		} catch (RepositoryException e) {
			return null;
		}

	}

}
