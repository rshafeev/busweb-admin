package com.pgis.bus.admin.controllers;

import java.util.Collection;
import java.util.Iterator;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;
import com.pgis.bus.data.IAdminDataBaseService;
import com.pgis.bus.data.helpers.LoadDirectRouteOptions;
import com.pgis.bus.data.helpers.LoadRouteOptions;
import com.pgis.bus.data.helpers.LoadRouteRelationOptions;
import com.pgis.bus.data.impl.AdminDataBaseService;

import com.pgis.bus.data.orm.City;
import com.pgis.bus.data.orm.Route;
import com.pgis.bus.data.orm.StringValue;
import com.pgis.bus.data.repositories.IRoutesRepository;
import com.pgis.bus.data.repositories.RepositoryException;
import com.pgis.bus.data.repositories.impl.RoutesRepository;

import com.pgis.bus.admin.models.CityModel;
import com.pgis.bus.admin.models.ErrorModel;
import com.pgis.bus.admin.models.LoadRoutesListParams;
import com.pgis.bus.admin.models.RoutesModel;

@Controller
@RequestMapping(value = "routes/")
public class RoutesController {
	private static final Logger log = LoggerFactory
			.getLogger(RoutesController.class);

	@ResponseBody
	@RequestMapping(value = "get_all_list.json", method = RequestMethod.POST)
	public String get_all_list(String data) {
		//
		try {
			LoadRoutesListParams params = (new Gson()).fromJson(data,
					LoadRoutesListParams.class);
			
			log.debug("get_all_list()");
			log.debug(data);
			// Загрузим список всех городов из БД
			LoadRouteRelationOptions loadRouteRelationOptions = new LoadRouteRelationOptions();
			loadRouteRelationOptions.setLoadStationsData(true);

			LoadDirectRouteOptions loadDirectRouteOptions = new LoadDirectRouteOptions();
			loadDirectRouteOptions.setLoadScheduleData(true);
			loadDirectRouteOptions
					.setLoadRouteRelationOptions(loadRouteRelationOptions);

			LoadRouteOptions opts = new LoadRouteOptions();
			opts.setLoadRouteNamesData(true);
			opts.setDirectRouteOptions(loadDirectRouteOptions);

			// get routes
			IRoutesRepository repository = new RoutesRepository();
			Collection<Route> routes = repository.getRoutes(
					params.getRoute_type_id(), params.getCity_id(), opts);

			// create model
			RoutesModel routesModel = new RoutesModel();
			routesModel.setCity_id(params.getCity_id());
			routesModel.setRoute_type_id(params.getRoute_type_id());
			routesModel.setRoutes(routes.toArray(new Route[routes.size()]));

			// send model
			String routesModelJson = (new Gson()).toJson(routesModel);
			log.debug(routesModelJson);
			return routesModelJson;

		} catch (RepositoryException e) {
			log.error("exception", e);
			return (new Gson()).toJson(new ErrorModel(
					ErrorModel.err_enum.c_exception));
		} catch (Exception e) {
			log.error("exception", e);
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
