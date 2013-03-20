package com.pgis.bus.admin.controllers;

import java.util.Collection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import com.google.gson.Gson;

import com.pgis.bus.data.orm.Station;
import com.pgis.bus.admin.models.ErrorModel;
import com.pgis.bus.admin.models.StationModel;
import com.pgis.bus.admin.models.StationsBoxModel;
import com.pgis.bus.admin.models.StationsListModel;

@Controller
@RequestMapping(value = "stations/")
public class StationsController extends BaseController  {
	private static final Logger log = LoggerFactory
			.getLogger(StationsController.class);

	@ResponseBody
	@RequestMapping(value = "getStationsList", method = RequestMethod.POST)
	public String getStationsList(Integer cityID, String langID) {
		try {
			log.debug("execute getStationsList()");
			log.debug("cityID: " + cityID);
			log.debug("langID: " + langID);
			if(cityID == null)
				throw new Exception("can not read cityID parameter.");
			Collection<Station> stationsList = super.getDB().Stations().getStationsList(cityID, langID);
			StationsListModel model = new StationsListModel(stationsList, langID);

			// Отправим модель в формате GSON клиенту
			return (new Gson()).toJson(model);
		}catch (Exception e) {
			log.error("getStationsByCity exception", e);
			return (new Gson()).toJson(new ErrorModel(e));
		}

	}
	
	@ResponseBody
	@RequestMapping(value = "getStationsFromBox", method = RequestMethod.POST)
	public String getStationsFromBox(String data) {
		try {
			log.debug(data);
			// Парсим полученные данные
			StationsBoxModel model = (new Gson()).fromJson(data,
					StationsBoxModel.class);

			// Загрузим список станций
			Collection<Station> stations = this.getDB().Stations().getStationsFromBox(
					model.getCityID(), model.getLtPoint(),
					model.getRbPoint(), model.getLangID());
			// Сформируем модель
			model.setStations(stations);

			log.debug(Integer.toString(model.getStations().size()));
			// Отправим модель в формате GSON клиенту
			return (new Gson()).toJson(model);
		}catch (Exception e) {
			log.error("getAllByCityInBox exception", e);
			return (new Gson()).toJson(new ErrorModel(e));
		}

	}

	@ResponseBody
	@RequestMapping(value = "get", method = RequestMethod.POST)
	public String get(Integer stationID) {
		try {
			log.debug("get()");
			if(stationID == null){
				throw new Exception("stationID was failed");
			}
			Station st = this.getDB().Stations().getStation(stationID);
			StationModel model = new StationModel(st);
			// Отправим модель в формате GSON клиенту
			return (new Gson()).toJson(model);
		}catch (Exception e) {
			log.error("getAllByCityInBox exception", e);
			return (new Gson()).toJson(new ErrorModel(e));
		}

	}

	@ResponseBody
	@RequestMapping(value = "insert", method = RequestMethod.POST)
	public String insert(String row_station) {
		try {
			log.debug(row_station);
			// Парсим полученные данные
			StationModel st = (new Gson()).fromJson(row_station,
					StationModel.class);

			// Добавим station в БД
			Station newStation = this.getDB().Stations().insertStation(st.toStation());
			StationModel model = new StationModel(newStation);
			// Отправим модель в формате GSON клиенту
			return (new Gson()).toJson(model);
		} catch (Exception e) {
			log.error("insert exception", e);
			return (new Gson()).toJson(new ErrorModel(e));
		}

	}

	
	@ResponseBody
	@RequestMapping(value = "update", method = RequestMethod.POST)
	public String update(String row_station) {
		try {
			log.debug(row_station);
			// Парсим полученные данные
			StationModel st = (new Gson()).fromJson(row_station,
					StationModel.class);

			// Добавим station в БД
			Station updateStation = this.getDB().Stations().updateStation(st.toStation());

			// Отправим модель в формате GSON клиенту
			StationModel model = new StationModel(updateStation);
			return (new Gson()).toJson(model);
		} catch (Exception e) {
			log.error("update exception", e);
			return (new Gson()).toJson(new ErrorModel(e));
		}

	}

	@ResponseBody
	@RequestMapping(value = "remove", method = RequestMethod.POST)
	public String delete(Integer stationID) {
		try {
			if (stationID == null || stationID.intValue() <= 0)
				throw new Exception("bad city_id");
			log.debug(stationID.toString());
			// удалим из БД
			this.getDB().Stations().deleteStation(stationID);
			return "\"ok\"";
		}catch (Exception e) {
			log.error("delete exception", e);
			return (new Gson()).toJson(new ErrorModel(e));
		}

	}

}
