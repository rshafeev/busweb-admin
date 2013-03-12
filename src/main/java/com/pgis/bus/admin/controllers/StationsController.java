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
import com.pgis.bus.admin.models.StationsModel;

@Controller
@RequestMapping(value = "stations/")
public class StationsController extends BaseController  {
	private static final Logger log = LoggerFactory
			.getLogger(StationsController.class);

	@ResponseBody
	@RequestMapping(value = "get_all_by_city", method = RequestMethod.POST)
	public String getStationsByCity(String data) {
		try {
			log.debug(data);
			// Парсим полученные данные
			StationsModel stationsModel = (new Gson()).fromJson(data,
					StationsModel.class);

			// Загрузим список станций
			Collection<Station> stations = this.getDB().Stations().getStationsByCity(
					stationsModel.getCity_id());
			// Сформируем модель
			stationsModel.setStations(stations);

			log.debug(Integer.toString(stationsModel.getStations().length));
			// Отправим модель в формате GSON клиенту
			return (new Gson()).toJson(stationsModel);
		}catch (Exception e) {
			log.error("getStationsByCity exception", e);
			return (new Gson()).toJson(new ErrorModel(e));
		}

	}

	@ResponseBody
	@RequestMapping(value = "get_all_by_city_inbox", method = RequestMethod.POST)
	public String getAllByCityInBox(String data) {
		try {
			log.debug(data);
			// Парсим полученные данные
			StationsModel stationsModel = (new Gson()).fromJson(data,
					StationsModel.class);

			// Загрузим список станций
			Collection<Station> stations = this.getDB().Stations().getStationsByBox(
					stationsModel.getCity_id(), stationsModel.getLtPoint(),
					stationsModel.getRbPoint());
			// Сформируем модель
			stationsModel.setStations(stations);

			log.debug(Integer.toString(stationsModel.getStations().length));
			// Отправим модель в формате GSON клиенту
			return (new Gson()).toJson(stationsModel);
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
			Station stationModel = (new Gson()).fromJson(row_station,
					Station.class);

			// Добавим station в БД
			Station newStation = this.getDB().Stations().insertStation(stationModel);

			// Отправим модель в формате GSON клиенту
			return (new Gson()).toJson(newStation);
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
			Station stationModel = (new Gson()).fromJson(row_station,
					Station.class);

			// Добавим station в БД
			Station updateStation = this.getDB().Stations().updateStation(stationModel);

			// Отправим модель в формате GSON клиенту

			return (new Gson()).toJson(updateStation);
		} catch (Exception e) {
			log.error("update exception", e);
			return (new Gson()).toJson(new ErrorModel(e));
		}

	}

	@ResponseBody
	@RequestMapping(value = "delete", method = RequestMethod.POST)
	public String delete(Integer station_id) {
		try {
			if (station_id == null || station_id.intValue() <= 0)
				throw new Exception("bad city_id");
			log.debug(station_id.toString());
			// удалим из БД
			this.getDB().Stations().deleteStation(station_id);
			return "\"ok\"";
		}catch (Exception e) {
			log.error("delete exception", e);
			return (new Gson()).toJson(new ErrorModel(e));
		}

	}

}
