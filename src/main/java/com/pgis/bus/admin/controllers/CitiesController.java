package com.pgis.bus.admin.controllers;

import java.util.ArrayList;
import java.util.Collection;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.pgis.bus.admin.helpers.ControllerException;
import com.pgis.bus.admin.models.ErrorModel;
import com.pgis.bus.admin.models.StringValueModel;
import com.pgis.bus.admin.models.city.CityModelEx;
import com.pgis.bus.data.orm.City;
import com.pgis.bus.data.orm.StringValue;
import com.pgis.bus.data.orm.type.LangEnum;
import com.pgis.bus.data.service.IDataBaseService;

@Controller
@RequestMapping(value = "cities/")
public class CitiesController extends BaseController {
	private static final Logger log = LoggerFactory.getLogger(CitiesController.class);

	@RequestMapping(value = "getAll", method = { RequestMethod.GET, RequestMethod.POST })
	@ResponseBody
	public Object getAll() {

		try {
			log.debug("getAll()");
			// Загрузим список всех городов из БД
			IDataBaseService db = super.getDbService();
			Collection<City> cities = db.Cities().getAll();
			// Отправим модель в формате GSON клиенту
			ArrayList<CityModelEx> citiesModel = new ArrayList<CityModelEx>();
			for (City city : cities) {
				citiesModel.add(new CityModelEx(city));
			}
			return citiesModel;
		} catch (Exception e) {
			log.error("exception", e);
			return new ErrorModel(e);
		} finally {
			super.disposeDataServices();
		}

	}

	@RequestMapping(value = "update", method = RequestMethod.POST)
	@ResponseBody
	public Object update(@RequestBody CityModelEx cityModel) {
		log.debug("update()");
		IDataBaseService db = null;
		try {
			if (cityModel == null)
				throw new Exception("can not convert CityModel from json string");

			City updateCity = cityModel.toCity();
			if (updateCity == null)
				throw new Exception("can not convert CityModel to City");
			db = super.getDbService();
			if (cityModel.getNames() != null) {
				for (StringValueModel s : cityModel.getNames()) {
					City city = this.getDbService().Cities().getByName(LangEnum.valueOf(s.getLang()), s.getValue());
					if (city != null && city.getId() != updateCity.getId()) {
						// город с таким названием уже существует
						throw new ControllerException(ControllerException.err_enum.c_city_already_exist);
					}
				}
			}

			db.Cities().update(updateCity);
			db.commit();
			return new CityModelEx(updateCity);
		} catch (Exception e) {
			if (db != null)
				db.rollback();
			log.error("exception", e);
			return new ErrorModel(e);
		} finally {
			super.disposeDataServices();
		}

	}

	@RequestMapping(value = "insert", method = RequestMethod.POST)
	@ResponseBody
	public Object insert(@RequestBody CityModelEx cityModel) {
		IDataBaseService db = null;
		try {
			if (cityModel == null)
				throw new Exception("can not convert CityModel from json string");

			City newCity = cityModel.toCity();
			if (newCity == null)
				throw new Exception("can not convert CityModel to City");

			// Валидация
			db = super.getDbService();
			for (StringValue s : newCity.getName().values()) {
				City city = db.Cities().getByName(s.getLangID(), s.getValue());
				if (city != null) {
					// город с таким названием уже существует
					throw new ControllerException(ControllerException.err_enum.c_city_already_exist);
				}
			}
			// добавим город в БД
			db.Cities().insert(newCity);
			db.commit();
			return new CityModelEx(newCity);
		} catch (Exception e) {
			if (db != null)
				db.rollback();
			log.error("exception", e);
			return new ErrorModel(e);
		} finally {
			super.disposeDataServices();
		}

	}

	@ResponseBody
	@RequestMapping(value = "remove", method = { RequestMethod.GET, RequestMethod.POST })
	public Object remove(Integer city_id) {
		log.debug(city_id.toString());
		IDataBaseService db = null;
		try {
			if (city_id == null || city_id.intValue() <= 0)
				throw new ControllerException(ControllerException.err_enum.c_city_already_exist);
			// удалим город из БД
			db = super.getDbService();
			db.Cities().remove(city_id);
			db.commit();
			return "\"ok\"";
		} catch (Exception e) {
			if (db != null)
				db.rollback();
			log.error("exception", e);
			return new ErrorModel(e);
		} finally {
			super.disposeDataServices();
		}
	}

}
