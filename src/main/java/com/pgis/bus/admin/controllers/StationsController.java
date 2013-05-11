package com.pgis.bus.admin.controllers;

import java.sql.SQLException;
import java.util.Collection;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.pgis.bus.admin.models.ErrorModel;
import com.pgis.bus.admin.models.station.StationModelEx;
import com.pgis.bus.admin.models.station.StationsBoxModel;
import com.pgis.bus.admin.models.station.StationsListModel;
import com.pgis.bus.data.orm.Station;
import com.pgis.bus.data.orm.type.LangEnum;
import com.pgis.bus.data.service.IDataBaseService;
import com.pgis.bus.data.service.IDataModelsService;
import com.pgis.bus.net.models.LangEnumModel;
import com.pgis.bus.net.models.station.StationModel;

@Controller
@RequestMapping(value = "stations/")
public class StationsController extends BaseController {
	private static final Logger log = LoggerFactory.getLogger(StationsController.class);

	@RequestMapping(value = "getStationsList", method = { RequestMethod.POST, RequestMethod.GET })
	@ResponseBody
	public Object getStationsList(Integer cityID, LangEnumModel langID) {
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
			return model;
		} catch (Exception e) {
			log.error("getStationsByCity exception", e);
			return new ErrorModel(e);
		} finally {
			super.disposeDataServices();
		}

	}

	@RequestMapping(value = "getStationsFromBox", method = RequestMethod.POST)
	@ResponseBody
	public Object getStationsFromBox(@RequestBody StationsBoxModel model) {
		try {
			// Парсим полученные данные

			// Загрузим список станций
			IDataModelsService modelsDb = super.getModelsService();
			modelsDb.setLocale(model.getLangID());
			Collection<StationModel> stations = modelsDb.Stations().getStationsFromBox(model.getCityID(),
					model.getLtPoint(), model.getRbPoint());
			// Сформируем модель
			model.setStations(stations);

			log.debug(Integer.toString(model.getStations().size()));
			// Отправим модель в формате GSON клиенту
			return model;
		} catch (SQLException e) {
			log.error("getAllByCityInBox exception", e);
			return new ErrorModel(e);
		} finally {
			super.disposeDataServices();
		}

	}

	@RequestMapping(value = "get", method = RequestMethod.POST)
	@ResponseBody
	public Object get(Integer stationID) {
		try {
			log.debug("get()");
			if (stationID == null) {
				throw new Exception("stationID was failed");
			}
			IDataBaseService db = super.getDbService();
			Station st = db.Stations().get(stationID);
			StationModelEx model = new StationModelEx(st);
			// Отправим модель в формате GSON клиенту
			return model;
		} catch (Exception e) {
			log.error("getAllByCityInBox exception", e);
			return new ErrorModel(e);
		} finally {
			super.disposeDataServices();
		}
	}

	@RequestMapping(value = "insert", method = RequestMethod.POST)
	@ResponseBody
	public Object insert(StationModelEx st) {
		IDataBaseService db = null;
		try {
			db = super.getDbService();
			// Добавим station в БД
			Station newStation = st.toORMObject();
			db.Stations().insert(newStation);
			db.commit();
			StationModelEx model = new StationModelEx(newStation);
			// Отправим модель в формате GSON клиенту
			return model;
		} catch (Exception e) {
			if (db != null)
				db.rollback();
			log.error("insert exception", e);
			return new ErrorModel(e);
		} finally {
			super.disposeDataServices();
		}

	}

	@RequestMapping(value = "update", method = RequestMethod.POST)
	@ResponseBody
	public Object update(StationModelEx st) {
		IDataBaseService db = null;
		try {
			// Парсим полученные данные
			// Добавим station в БД
			Station updateStation = st.toORMObject();
			db = super.getDbService();
			db.Stations().update(updateStation);
			// Отправим модель в формате GSON клиенту
			StationModelEx model = new StationModelEx(updateStation);
			return model;
		} catch (Exception e) {
			if (db != null)
				db.rollback();
			log.error("update exception", e);
			return new ErrorModel(e);
		} finally {
			super.disposeDataServices();
		}

	}

	@RequestMapping(value = "remove", method = RequestMethod.POST)
	@ResponseBody
	public Object remove(Integer stationID) {
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
			return new ErrorModel(e);
		} finally {
			super.disposeDataServices();
		}

	}

}
