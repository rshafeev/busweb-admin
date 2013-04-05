package com.pgis.bus.admin.controllers;

import java.util.Collection;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;
import com.pgis.bus.data.helpers.LoadDirectRouteOptions;
import com.pgis.bus.data.helpers.LoadRouteOptions;
import com.pgis.bus.data.helpers.LoadRouteRelationOptions;
import com.pgis.bus.data.orm.Route;
import com.pgis.bus.admin.models.ErrorModel;
import com.pgis.bus.admin.models.UpdateRouteModel;
import com.pgis.bus.admin.models.routes.RoutesListModel;

@Controller
@RequestMapping(value = "routes/")
public class RoutesController extends BaseController {
	private static final Logger log = LoggerFactory
			.getLogger(RoutesController.class);

	@ResponseBody
	@RequestMapping(value = "getRoutesList", method = RequestMethod.POST)
	public String getRoutesList(Integer cityID, String routeTypeID, String langID) {
		//
		try {
			log.debug("getRoutesList()");
			log.debug("cityID:" + cityID);
			log.debug("routeTypeID:" + routeTypeID);
			log.debug("langID:" + langID);
			
			
			// Загрузим список маршрутов из БД
			LoadRouteOptions opts = new LoadRouteOptions();
			opts.setLoadRouteNamesData(true);
			opts.setDirectRouteOptions(null);
			LoadDirectRouteOptions directRouteOptions = new LoadDirectRouteOptions();
			directRouteOptions.setLoadRouteRelationOptions(null);
			directRouteOptions.setLoadScheduleData(true);
			opts.setDirectRouteOptions(directRouteOptions);
			// get routes
			Collection<Route> routes = this.getDB().Routes().getRoutes(routeTypeID, cityID, langID);
			// create model
			RoutesListModel model = new RoutesListModel(routes, langID);
			// send model
			String routesModelJson = (new Gson()).toJson(model);
			return routesModelJson;

		} catch (Exception e) {
			log.error("get_all_list exception", e);
			return (new Gson()).toJson(new ErrorModel(e));
		}

	}

	@ResponseBody
	@RequestMapping(value = "get_route", method = RequestMethod.POST)
	public String get(String data) {
		log.debug(data); // <value>
		try {
			Integer routeID = (new Gson()).fromJson(data, int.class);
			if (routeID == null)
				throw new Exception(
						"can not convert routeID from json to string");

			// set options
			LoadRouteRelationOptions loadRouteRelationOptions = new LoadRouteRelationOptions();
			loadRouteRelationOptions.setLoadStationsData(true);
			LoadDirectRouteOptions loadDirectRouteOptions = new LoadDirectRouteOptions();
			loadDirectRouteOptions.setLoadScheduleData(true);
			loadDirectRouteOptions
					.setLoadRouteRelationOptions(loadRouteRelationOptions);
			LoadRouteOptions opts = new LoadRouteOptions();
			opts.setLoadRouteNamesData(true);
			opts.setDirectRouteOptions(loadDirectRouteOptions);

			// get route
			Route route = this.getDB().Routes().getRoute(routeID, opts);

			// send model
			String routeModelJson = (new Gson()).toJson(route);
			log.debug(routeModelJson);
			return routeModelJson;

		} catch (Exception e) {
			log.error("get exception", e);
			return (new Gson()).toJson(new ErrorModel(e));
		}
	}

	@ResponseBody
	@RequestMapping(value = "insert_route", method = RequestMethod.POST)
	public String insert(String data) {
		log.debug("insert_route");
		log.debug(data);

		try {

			Route newRoute = (new Gson()).fromJson(data, Route.class);
			this.getDB().Routes().insertRoute(newRoute);

			String routeModelJson = (new Gson()).toJson(newRoute);
			log.debug(routeModelJson);
			return routeModelJson;

		} catch (Exception e) {
			log.error("insert exception", e);
			return (new Gson()).toJson(new ErrorModel(e));
		}

	}

	@ResponseBody
	@RequestMapping(value = "delete", method = RequestMethod.POST)
	public String delete(Integer route_id) {
		log.debug(route_id.toString());
		try {
			if (route_id == null || route_id.intValue() <= 0)
				throw new Exception("bad route_id");
			// удалим город из БД
			this.getDB().Routes().removeRoute(route_id.intValue());
			return "\"ok\"";
		} catch (Exception e) {
			log.error("delete exception", e);
			return (new Gson()).toJson(new ErrorModel(e));
		}
	}

	@ResponseBody
	@RequestMapping(value = "update", method = RequestMethod.POST)
	public String update(String data) {
		log.debug("update()");
		log.debug(data);
		try {
			UpdateRouteModel updateData = (new Gson()).fromJson(data,
					UpdateRouteModel.class);
			this.getDB().Routes().updateRoute(updateData.getRoute(), updateData.getOpts());

			String routeModelJson = (new Gson()).toJson(updateData);
			log.debug(routeModelJson);
			return routeModelJson;

		} catch (Exception e) {
			log.error("update exception", e);
			return (new Gson()).toJson(new ErrorModel(e));
		}
	}

}
