package com.pgis.bus.admin.controllers;

import java.sql.SQLException;
import java.util.Collection;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;
import com.pgis.bus.admin.models.ErrorModel;
import com.pgis.bus.admin.models.station.StationModelEx;
import com.pgis.bus.admin.models.station.StationsBoxModel;
import com.pgis.bus.admin.models.station.StationsListModel;
import com.pgis.bus.data.orm.Station;
import com.pgis.bus.data.orm.type.LangEnum;
import com.pgis.bus.data.service.IDataBaseService;
import com.pgis.bus.data.service.IDataModelsService;
import com.pgis.bus.net.models.station.StationModel;

@Controller
@RequestMapping(value = "stations/")
public class StationsController extends BaseController {
	private static final Logger log = LoggerFactory.getLogger(StationsController.class);

	@ResponseBody
	@RequestMapping(value = "getStationsList", method = RequestMethod.POST)
	public String getStationsList(Integer cityID, String langID) {
		try {
			log.debug("execute getStationsList()");
			log.debug("cityID: " + cityID);
			log.debug("langID: " + langID);
			if (cityID == null)
				throw new Exception("can not read cityID parameter.");
			IDataModelsService modelsService = super.getModelsService();
			modelsService.setLocale(LangEnum.valueOf(langID));
			Collection<StationModel> stationsList = modelsService.Stations().getStationsList(cityID);
			StationsListModel model = new StationsListModel(stationsList);

			// Отправим модель в формате GSON клиенту
			return (new Gson()).toJson(model);
		} catch (Exception e) {
			log.error("getStationsByCity exception", e);
			return (new Gson()).toJson(new ErrorModel(e));
		} finally {
			super.disposeDataServices();
		}

	}

	@ResponseBody
	@RequestMapping(value = "getStationsFromBox", method = RequestMethod.POST)
	public String getStationsFromBox(String data) {
		try {
			log.debug(data);
			// Парсим полученные данные
			StationsBoxModel model = (new Gson()).fromJson(data, StationsBoxModel.class);

			// Загрузим список станций
			IDataModelsService modelsDb = super.getModelsService();
			modelsDb.setLocale(model.getLangID());
			Collection<StationModel> stations = modelsDb.Stations().getStationsFromBox(model.getCityID(),
					model.getLtPoint(), model.getRbPoint());
			// Сформируем модель
			model.setStations(stations);

			log.debug(Integer.toString(model.getStations().size()));
			// Отправим модель в формате GSON клиенту
			return (new Gson()).toJson(model);
		} catch (SQLException e) {
			log.error("getAllByCityInBox exception", e);
			return (new Gson()).toJson(new ErrorModel(e));
		} finally {
			super.disposeDataServices();
		}

	}

	@ResponseBody
	@RequestMapping(value = "get", method = RequestMethod.POST)
	public String get(Integer stationID) {
		try {
			log.debug("get()");
			if (stationID == null) {
				throw new Exception("stationID was failed");
			}
			IDataBaseService db = super.getDbService();
			Station st = db.Stations().get(stationID);
			StationModelEx model = new StationModelEx(st);
			// Отправим модель в формате GSON клиенту
			return (new Gson()).toJson(model);
		} catch (Exception e) {
			log.error("getAllByCityInBox exception", e);
			return (new Gson()).toJson(new ErrorModel(e));
		} finally {
			super.disposeDataServices();
		}
	}

	@ResponseBody
	@RequestMapping(value = "insert", method = RequestMethod.POST)
	public String insert(String row_station) {
		IDataBaseService db = null;

		try {
			log.debug(row_station);
			// Парсим полученные данные
			StationModelEx st = (new Gson()).fromJson(row_station, StationModelEx.class);
			db = super.getDbService();
			// Добавим station в БД
			Station newStation = st.toORMObject();
			db.Stations().insert(newStation);
			db.commit();
			StationModelEx model = new StationModelEx(newStation);
			// Отправим модель в формате GSON клиенту
			return (new Gson()).toJson(model);
		} catch (Exception e) {
			if (db != null)
				db.rollback();
			log.error("insert exception", e);
			return (new Gson()).toJson(new ErrorModel(e));
		} finally {
			super.disposeDataServices();
		}

	}

	@ResponseBody
	@RequestMapping(value = "update", method = RequestMethod.POST)
	public String update(String row_station) {
		IDataBaseService db = null;
		try {
			log.debug(row_station);
			// Парсим полученные данные
			StationModelEx st = (new Gson()).fromJson(row_station, StationModelEx.class);
			// Добавим station в БД
			Station updateStation = st.toORMObject();
			db = super.getDbService();
			db.Stations().update(updateStation);
			// Отправим модель в формате GSON клиенту
			StationModelEx model = new StationModelEx(updateStation);
			return (new Gson()).toJson(model);
		} catch (Exception e) {
			if (db != null)
				db.rollback();
			log.error("update exception", e);
			return (new Gson()).toJson(new ErrorModel(e));
		} finally {
			super.disposeDataServices();
		}

	}

	@ResponseBody
	@RequestMapping(value = "remove", method = RequestMethod.POST)
	public String delete(Integer stationID) {
		IDataBaseService db = null;
		try {
			if (stationID == null || stationID.intValue() <= 0)
				throw new Exception("bad city_id");
			log.debug(stationID.toString());
			// удалим из БД
			db = super.getDbService();
			db.Stations().remove(stationID);
			db.commit();
			return "\"ok\"";
		} catch (Exception e) {
			if (db != null)
				db.rollback();
			log.error("delete exception", e);
			return (new Gson()).toJson(new ErrorModel(e));
		} finally {
			super.disposeDataServices();
		}

	}

}
