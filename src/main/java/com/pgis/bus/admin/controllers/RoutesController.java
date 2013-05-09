package com.pgis.bus.admin.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.pgis.bus.admin.models.ErrorModel;
import com.pgis.bus.admin.models.route.RouteModelEx;
import com.pgis.bus.data.orm.Route;
import com.pgis.bus.data.orm.type.LangEnum;
import com.pgis.bus.data.service.IDataBaseService;
import com.pgis.bus.data.service.IDataModelsService;
import com.pgis.bus.net.models.LangEnumModel;
import com.pgis.bus.net.models.geom.PointModel;
import com.pgis.bus.net.models.route.RouteTypeModel;
import com.pgis.bus.net.models.route.RoutesListModel;

@Controller
@RequestMapping(value = "routes/")
public class RoutesController extends BaseController {
	private static final Logger log = LoggerFactory.getLogger(RoutesController.class);

	@RequestMapping(value = "getRoutesList", method = RequestMethod.POST)
	@ResponseBody
	public Object getRoutesList(Integer cityID, String routeTypeID, String langID) {
		try {
			log.debug("getRoutesList()");
			log.debug("cityID:" + cityID);
			log.debug("routeTypeID:" + routeTypeID);
			log.debug("langID:" + langID);
			IDataModelsService modelsService = super.getModelsService();
			modelsService.setLocale(LangEnum.valueOf(LangEnumModel.valueOf(langID)));
			// get routes and create model

			RoutesListModel model = modelsService.Routes().getRoutesList(cityID,
					RouteTypeModel.getDBRouteType(routeTypeID));
			// send model
			// String routesModelJson = (new Gson()).toJson(model);
			return model;

		} catch (Exception e) {
			log.error("get_all_list exception", e);
			// return (new Gson()).toJson();
			return new ErrorModel(e);
		} finally {
			super.disposeDataServices();
		}

	}

	@RequestMapping(value = "get", method = RequestMethod.POST)
	@ResponseBody
	public Object get(Integer routeID) {
		try {
			if (routeID == null)
				throw new Exception("can not convert routeID from json to string");
			Route route = this.getDbService().Routes().get(routeID);
			RouteModelEx model = new RouteModelEx(route);
			// send model
			String jsonModel = (new Gson()).toJson(model);
			ObjectMapper mapper = new ObjectMapper();

			log.debug(mapper.writeValueAsString(model));
			return model;

		} catch (Exception e) {
			log.error("get exception", e);
			// return (new Gson()).toJson();
			return new ErrorModel(e);
		} finally {
			super.disposeDataServices();
		}
	}

	@ResponseBody
	@RequestMapping(value = "insert_route", method = RequestMethod.POST)
	public String insert(String data) {
		log.debug("insert_route");
		log.debug(data);

		try {

			Route newRoute = (new Gson()).fromJson(data, Route.class);
			super.getDbService().Routes().insert(newRoute);

			String routeModelJson = (new Gson()).toJson(newRoute);
			log.debug(routeModelJson);
			return routeModelJson;

		} catch (Exception e) {
			log.error("insert exception", e);
			return (new Gson()).toJson(new ErrorModel(e));
		} finally {
			super.disposeDataServices();
		}

	}

	@ResponseBody
	@RequestMapping(value = "delete", method = RequestMethod.POST)
	public String delete(Integer route_id) {
		log.debug(route_id.toString());
		IDataBaseService db = super.getDbService();
		try {
			if (route_id == null || route_id.intValue() <= 0)
				throw new Exception("bad route_id");
			// удалим маршрут из БД
			db.Routes().remove(route_id.intValue());
			db.commit();
			return "\"ok\"";
		} catch (Exception e) {
			log.error("delete exception", e);
			return (new Gson()).toJson(new ErrorModel(e));
		} finally {
			super.disposeDataServices();
		}
	}

	@RequestMapping(value = "update", method = RequestMethod.POST, consumes = "application/json")
	@ResponseBody
	public Object update(@RequestBody RouteModelEx route) {
		// RouteModelEx
		log.debug("update()");
		log.debug(route.toString());
		IDataBaseService db = super.getDbService();
		try {
			// RouteModelEx routeModel = (new Gson()).fromJson(route, RouteModelEx.class);
			Route ormRoute = route.toORMObject();
			// db.Routes().update(ormRoute);
			db.commit();
			String routeModelJson = (new Gson()).toJson(route);
			log.debug(routeModelJson);
			return route;
		} catch (Exception e) {
			// db.rollback();
			log.error("update exception", e);
			// return (new Gson()).toJson();
			return new ErrorModel(e);
		} finally {
			super.disposeDataServices();
		}
	}

	@ResponseBody
	@RequestMapping(value = "updateSchedule", method = RequestMethod.POST)
	public String updateSchedule(String schedule) {
		log.debug("update()");
		log.debug(schedule);
		IDataBaseService db = super.getDbService();
		try {
			RouteModelEx routeModel = (new Gson()).fromJson(schedule, RouteModelEx.class);

			Route route = routeModel.toORMObject();
			db.Routes().update(route);
			db.commit();
			String routeModelJson = (new Gson()).toJson(route);
			log.debug(routeModelJson);
			return routeModelJson;
		} catch (Exception e) {
			db.rollback();
			log.error("update exception", e);
			return (new Gson()).toJson(new ErrorModel(e));
		} finally {
			super.disposeDataServices();
		}
	}

}
