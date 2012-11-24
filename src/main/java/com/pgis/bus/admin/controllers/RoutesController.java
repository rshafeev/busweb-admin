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
import com.pgis.bus.data.helpers.LoadDirectRouteOptions;
import com.pgis.bus.data.helpers.LoadRouteOptions;
import com.pgis.bus.data.helpers.LoadRouteRelationOptions;
import com.pgis.bus.data.impl.AdminDataBaseService;
import com.pgis.bus.data.models.route.RouteModel;
import com.pgis.bus.data.orm.Route;
import com.pgis.bus.data.repositories.RepositoryException;
import com.pgis.bus.admin.models.ErrorModel;
import com.pgis.bus.admin.models.LoadRoutesListParams;
import com.pgis.bus.admin.models.RoutesModel;
import com.pgis.bus.admin.models.UpdateRouteModel;

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
			// Загрузим список маршрутов из БД
			LoadRouteOptions opts = new LoadRouteOptions();
			opts.setLoadRouteNamesData(true);
			opts.setDirectRouteOptions(null);

			// get routes
			IAdminDataBaseService db = new AdminDataBaseService();
			Collection<Route> routes = db.getRoutes(params.getRoute_type_id(),
					params.getCity_id(), opts);

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
	@RequestMapping(value = "get_route.json", method = RequestMethod.POST)
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
			IAdminDataBaseService db = new AdminDataBaseService();
			Route route = db.getRoute(routeID, opts);

			// send model
			String routeModelJson = (new Gson()).toJson(route);
			log.debug(routeModelJson);
			return routeModelJson;

		} catch (Exception e) {
			log.error("update exception:", e);
			return (new Gson()).toJson(new ErrorModel(
					ErrorModel.err_enum.c_exception));
		}

	}

	@ResponseBody
	@RequestMapping(value = "insert_route.json", method = RequestMethod.POST)
	public String insert(String data) {
		log.debug("insert_route");
		log.debug(data);

		try {

			Route newRoute = (new Gson()).fromJson(data, Route.class);
			IAdminDataBaseService db = new AdminDataBaseService();
			db.insertRoute(newRoute);

			String routeModelJson = (new Gson()).toJson(newRoute);
			log.debug(routeModelJson);
			return routeModelJson;

		} catch (Exception e) {
			log.error("insert exception:", e);
			return (new Gson()).toJson(new ErrorModel(
					ErrorModel.err_enum.c_exception));
		}

	}

	@ResponseBody
	@RequestMapping(value = "delete.json", method = RequestMethod.POST)
	public String delete(Integer route_id) {
		log.debug(route_id.toString());
		try {
			if (route_id == null || route_id.intValue() <= 0)
				throw new Exception("bad route_id");
			// удалим город из БД
			IAdminDataBaseService db = new AdminDataBaseService();
			db.removeRoute(route_id.intValue());
			return "\"ok\"";
		} catch (Exception e) {
			log.error("delete exception:", e);
			return (new Gson()).toJson(new ErrorModel(
					ErrorModel.err_enum.c_exception));
		}
	}

	@ResponseBody
	@RequestMapping(value = "update.json", method = RequestMethod.POST)
	public String update(String data) {
		log.debug(data);
		try {
			UpdateRouteModel updateData = (new Gson()).fromJson(data,
					UpdateRouteModel.class);
			IAdminDataBaseService db = new AdminDataBaseService();
			db.updateRoute(updateData.getRoute(), updateData.getOpts());

			String routeModelJson = (new Gson()).toJson(updateData);
			log.debug(routeModelJson);
			return routeModelJson;

		} catch (Exception e) {
			log.error("update exception:", e);
			return (new Gson()).toJson(new ErrorModel(
					ErrorModel.err_enum.c_exception));
		}
	}

}
