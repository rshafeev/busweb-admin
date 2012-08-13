package com.pgis.bus.admin.controllers;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.Locale;

import javax.servlet.http.HttpServletResponse;

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

import com.pgis.bus.admin.models.CityModel;

@Controller
@RequestMapping(value = "cities/")
public class CitiesController {
	private static final Logger log = LoggerFactory
			.getLogger(CitiesController.class);

	@ResponseBody
	@RequestMapping(value = "get_all.json", method = RequestMethod.POST)
	public String get_all() {

		try {
			/*
			 * String contentType = "text/html;charset=UTF-8";
			 * response.setContentType(contentType);
			 * response.setCharacterEncoding("utf-8");
			 */
			// Загрузим список всех городов из БД
			IDataBaseService db = new DataBaseService();
			Collection<City> cities = db.getAllCities();
			// Отправим модель в формате GSON клиенту
			ArrayList<CityModel> citiesModel = new ArrayList<CityModel>();
			Iterator<City> i = cities.iterator();
			while(i.hasNext()) {
				City city = i.next();
				citiesModel.add(new CityModel(city));
			}
			return (new Gson()).toJson(citiesModel);
		} catch (RepositoryException e) {
			return null;
		}

	}

	@ResponseBody
	@RequestMapping(value = "update.json", method = RequestMethod.POST)
	public String update(String row_city) {
		log.debug(row_city);
		try {
			CityModel cityModel = (new Gson()).fromJson(row_city,
					CityModel.class);
			if (cityModel == null)
				throw new Exception(
						"can not convert CityModel from json string");
			
			City updateCity = cityModel.toCity();
			if (updateCity == null)
				throw new Exception("can not convert CityModel to City");
			// Загрузим список всех городов из БД
			IDataBaseService db = new DataBaseService();
			boolean result = db.updateCity(updateCity);
			if (result == false)
				throw new Exception("can not update city");
			
			return "\"ok\"";
		} catch (Exception e) {
			log.error("update exception:", e);
			return "\"error\"";
		}

	}

}
