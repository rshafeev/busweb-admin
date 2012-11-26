package com.pgis.bus.admin.controllers;

import java.util.Collection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import com.google.gson.Gson;
import com.pgis.bus.data.IAdminDataBaseService;
import com.pgis.bus.data.impl.AdminDataBaseService;

import com.pgis.bus.data.orm.Station;
import com.pgis.bus.admin.models.ErrorModel;
import com.pgis.bus.admin.models.StationsModel;

@Controller
@RequestMapping(value = "stations/")
public class StationsController {
	private static final Logger log = LoggerFactory
			.getLogger(StationsController.class);

	@ResponseBody
	@RequestMapping(value = "get_all_by_city.json", method = RequestMethod.POST)
	public String getStationsByCityAndTransport(String data) {
		try {
			log.debug(data);
			// Парсим полученные данные
			StationsModel stationsModel = (new Gson()).fromJson(data,
					StationsModel.class);

			// Загрузим список станций
			IAdminDataBaseService db = new AdminDataBaseService();
			Collection<Station> stations = db.getStationsByCity(
					stationsModel.getCity_id());
			// Сформируем модель
			stationsModel.setStations(stations);

			log.debug(Integer.toString(stationsModel.getStations().length));
			// Отправим модель в формате GSON клиенту
			return (new Gson()).toJson(stationsModel);
		} catch (Exception e) {
			log.error("exception", e);
			return (new Gson()).toJson(new ErrorModel(
					ErrorModel.err_enum.c_exception));
		}

	}

	@ResponseBody
	@RequestMapping(value = "get_all_by_city_inbox.json", method = RequestMethod.POST)
	public String getAllByCityInBox(String data) {
		try {
			log.debug(data);
			// Парсим полученные данные
			StationsModel stationsModel = (new Gson()).fromJson(data,
					StationsModel.class);

			// Загрузим список станций
			IAdminDataBaseService db = new AdminDataBaseService();
			Collection<Station> stations = db.getStationsByBox(
					stationsModel.getCity_id(), stationsModel.getLtPoint(),
					stationsModel.getRbPoint());
			// Сформируем модель
			stationsModel.setStations(stations);

			log.debug(Integer.toString(stationsModel.getStations().length));
			// Отправим модель в формате GSON клиенту
			return (new Gson()).toJson(stationsModel);
		} catch (Exception e) {
			log.error("exception", e);
			return (new Gson()).toJson(new ErrorModel(
					ErrorModel.err_enum.c_exception));
		}

	}

	@ResponseBody
	@RequestMapping(value = "insert.json", method = RequestMethod.POST)
	public String insert(String row_station) {
		try {
			log.debug(row_station);
			// Парсим полученные данные
			Station stationModel = (new Gson()).fromJson(row_station,
					Station.class);

			// Добавим station в БД
			IAdminDataBaseService db = new AdminDataBaseService();
			Station newStation = db.insertStation(stationModel);

			// Отправим модель в формате GSON клиенту
			return (new Gson()).toJson(newStation);
		} catch (Exception e) {
			log.error("exception", e);
			return (new Gson()).toJson(new ErrorModel(
					ErrorModel.err_enum.c_exception));
		}

	}

	
	@ResponseBody
	@RequestMapping(value = "update.json", method = RequestMethod.POST)
	public String update(String row_station) {
		try {
			log.debug(row_station);
			// Парсим полученные данные
			Station stationModel = (new Gson()).fromJson(row_station,
					Station.class);

			// Добавим station в БД
			IAdminDataBaseService db = new AdminDataBaseService();
			Station updateStation = db.updateStation(stationModel);

			// Отправим модель в формате GSON клиенту

			return (new Gson()).toJson(updateStation);
		} catch (Exception e) {
			log.error("exception", e);
			return (new Gson()).toJson(new ErrorModel(
					ErrorModel.err_enum.c_exception));
		}

	}

	@ResponseBody
	@RequestMapping(value = "delete.json", method = RequestMethod.POST)
	public String delete(Integer station_id) {
		try {
			if (station_id == null || station_id.intValue() <= 0)
				throw new Exception("bad city_id");
			log.debug(station_id.toString());
			// удалим из БД
			IAdminDataBaseService db = new AdminDataBaseService();
			db.deleteStation(station_id);
			return "\"ok\"";
		} catch (Exception e) {
			log.error("exception", e);
			return (new Gson()).toJson(new ErrorModel(
					ErrorModel.err_enum.c_exception));
		}

	}

}
