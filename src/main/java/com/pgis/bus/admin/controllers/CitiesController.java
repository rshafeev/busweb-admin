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
import com.pgis.bus.data.IAdminDataBaseService;
import com.pgis.bus.data.IDataBaseService;
import com.pgis.bus.data.impl.AdminDataBaseService;
import com.pgis.bus.data.impl.DataBaseService;
import com.pgis.bus.data.orm.City;
import com.pgis.bus.data.orm.StringValue;
import com.pgis.bus.data.repositories.RepositoryException;

import com.pgis.bus.admin.models.CityModel;
import com.pgis.bus.admin.models.ErrorModel;

@Controller
@RequestMapping(value = "cities/")
public class CitiesController {
	private static final Logger log = LoggerFactory
			.getLogger(CitiesController.class);

	@ResponseBody
	@RequestMapping(value = "get_all.json", method = RequestMethod.POST)
	public String get_all() {

		try {
			log.debug("get_all()");
			// Загрузим список всех городов из БД
			IDataBaseService db = new DataBaseService();
			Collection<City> cities = db.getAllCities();
			// Отправим модель в формате GSON клиенту
			ArrayList<CityModel> citiesModel = new ArrayList<CityModel>();
			Iterator<City> i = cities.iterator();
			while (i.hasNext()) {
				City city = i.next();
				citiesModel.add(new CityModel(city));

			}
			/*
			 * try { Thread.sleep(4000); } catch (InterruptedException e) {
			 * e.printStackTrace(); }
			 */
			String citiesModelJson = (new Gson()).toJson(citiesModel);
			log.debug(citiesModelJson);
			return citiesModelJson;
		} catch (RepositoryException e) {
			return (new Gson()).toJson(new ErrorModel(
					ErrorModel.err_enum.c_exception));
		} catch (JsonSyntaxException e) {
			log.error("JsonSyntaxException exception", e);
			return (new Gson()).toJson(new ErrorModel(
					ErrorModel.err_enum.c_exception));
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

			IAdminDataBaseService db = new AdminDataBaseService();
			Iterator<StringValue> i = updateCity.name.values().iterator();
			while (i.hasNext()) {
				StringValue s = i.next();
				City city = db.getCityByName(s.lang_id, s.value);
				if (city != null && city.id != updateCity.id) {
					// город с таким названием уже существует
					return (new Gson()).toJson(new ErrorModel(
							ErrorModel.err_enum.c_city_already_exist));
				}
			}
			updateCity = db.updateCity(updateCity);
			return (new Gson()).toJson(new CityModel(updateCity));
		} catch (Exception e) {
			log.error("update exception:", e);
			return (new Gson()).toJson(new ErrorModel(
					ErrorModel.err_enum.c_exception));
		}

	}

	@ResponseBody
	@RequestMapping(value = "insert.json", method = RequestMethod.POST)
	public String insert(String row_city) {
		log.debug(row_city);

		try {
			CityModel cityModel = (new Gson()).fromJson(row_city,
					CityModel.class);
			if (cityModel == null)
				throw new Exception(
						"can not convert CityModel from json string");

			City newCity = cityModel.toCity();
			if (newCity == null)
				throw new Exception("can not convert CityModel to City");
			// добавим город в БД
			IAdminDataBaseService db = new AdminDataBaseService();
			Iterator<StringValue> i = newCity.name.values().iterator();
			while (i.hasNext()) {
				StringValue s = i.next();
				City city = db.getCityByName(s.lang_id, s.value);
				if (city != null) {
					// город с таким названием уже существует
					return (new Gson()).toJson(new ErrorModel(
							ErrorModel.err_enum.c_city_already_exist));
				}
			}
			newCity = db.insertCity(newCity);

			if (newCity == null)
				throw new Exception("can not update city");
			return (new Gson()).toJson(new CityModel(newCity));

		} catch (Exception e) {
			log.error("insert exception:", e);
			return (new Gson()).toJson(new ErrorModel(
					ErrorModel.err_enum.c_exception));
		}

	}

	@ResponseBody
	@RequestMapping(value = "delete.json", method = RequestMethod.POST)
	public String delete(Integer city_id) {
		log.debug(city_id.toString());
		try {
			if (city_id == null || city_id.intValue() <= 0)
				throw new Exception("bad city_id");
			// удалим город из БД
			IAdminDataBaseService db = new AdminDataBaseService();
			db.deleteCity(city_id.intValue());
			return "\"ok\"";
		} catch (Exception e) {
			log.error("delete exception:", e);
			return (new Gson()).toJson(new ErrorModel(
					ErrorModel.err_enum.c_exception));
		}
	}

}
