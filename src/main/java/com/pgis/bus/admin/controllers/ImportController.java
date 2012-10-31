package com.pgis.bus.admin.controllers;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import com.pgis.bus.admin.models.CityModel;
import com.pgis.bus.admin.models.ErrorModel;
import com.pgis.bus.data.IDataBaseService;
import com.pgis.bus.data.impl.DataBaseService;
import com.pgis.bus.data.orm.City;
import com.pgis.bus.data.repositories.RepositoryException;


@Controller
@RequestMapping(value = "import/")
public class ImportController {
	private static final Logger log = LoggerFactory
			.getLogger(ImportController.class);
	
	@ResponseBody
	@RequestMapping(value = "insert.json", method = RequestMethod.POST)
	public String get_obj(String city, String importRouteModelJson) {
		
		try {
			log.debug("import.insert()");
			log.debug(importRouteModelJson);
			// Загрузим список всех городов из БД
			IDataBaseService db = new DataBaseService();
			Collection<City> cities = db.getAllCities();
			for(City c : cities){
				
			}
			//String citiesModelJson = (new Gson()).toJson(citiesModel);
			//log.debug(citiesModelJson);
			return "ok";
		} catch (RepositoryException e) {
			return (new Gson()).toJson(new ErrorModel(
					ErrorModel.err_enum.c_exception));
		} catch (JsonSyntaxException e) {
			log.error("JsonSyntaxException exception", e);
			return (new Gson()).toJson(new ErrorModel(
					ErrorModel.err_enum.c_exception));
		}

	}
}
