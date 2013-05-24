package com.pgis.bus.admin.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.databind.ObjectMapper;
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

	@RequestMapping(value = "getRoutesList", method = { RequestMethod.GET, RequestMethod.POST })
	@ResponseBody
	public Object getRoutesList(Integer cityID, String routeTypeID, String langID) {
		try {
			log.debug("execute action getRoutesList({},{},{})", new Object[] { cityID, routeTypeID, langID });

			IDataModelsService modelsService = super.getModelsService();
			modelsService.setLocale(LangEnum.valueOf(LangEnumModel.valueOf(langID)));
			RoutesListModel model = modelsService.Routes().getRoutesList(cityID,
					RouteTypeModel.getDBRouteType(routeTypeID));
			return model;

		} catch (Exception e) {
			log.error("getRoutesList() error.", e);
			return new ErrorModel(e);
		} finally {
			super.release();
		}

	}

	@RequestMapping(value = "get", method = { RequestMethod.GET, RequestMethod.POST })
	@ResponseBody
	public Object get(Integer routeID) {
		try {
			log.debug("execute action get({})", new Object[] { routeID });
			if (routeID == null)
				throw new Exception("can not convert routeID from json to string");
			Route route = this.getDbService().Routes().get(routeID);
			RouteModelEx model = new RouteModelEx(route);
			return model;

		} catch (Exception e) {
			log.error("get exception", e);
			return new ErrorModel(e);
		} finally {
			super.release();
		}
	}

	@RequestMapping(value = "insert", method = RequestMethod.POST)
	@ResponseBody
	public Object insert(@RequestBody RouteModelEx routeModel) {
		log.debug("insert()");
		IDataBaseService db = super.getDbService();
		try {
			Route ormRoute = routeModel.toORMObject();
			db.Routes().insert(ormRoute);
			db.commit();
			return new RouteModelEx(ormRoute);

		} catch (Exception e) {
			db.rollback();
			log.error("insert exception", e);
			return new ErrorModel(e);
		} finally {
			super.release();
		}

	}

	@RequestMapping(value = "remove", method = { RequestMethod.POST })
	@ResponseBody
	public Object remove(Integer routeID) {
		log.debug(routeID.toString());
		IDataBaseService db = super.getDbService();
		try {

			if (routeID == null || routeID.intValue() <= 0)
				throw new Exception("request error: bad routeID");
			// удалим маршрут из БД
			db.Routes().remove(routeID);
			db.commit();
			return "\"ok\"";
		} catch (Exception e) {
			db.rollback();
			log.error("delete exception", e);
			return new ErrorModel(e);
		} finally {
			super.release();
		}
	}

	/**
	 * Обновляет маршрут. Причем можно передавать не все данные маршрута, а только те его дочерние объекты, которые
	 * нужно обновить. Например, для обновления расписания все данные могут быть null, кроме объъекта Schedule у пути.
	 * ID маршрута должен быть задан обязательно, иначе метод не сможет вернуть обновленный маршрут.
	 * 
	 * @param routeModel Данные маршрута, которые требуется обновить
	 * @return {RouteModelEx} Обновленный маршрут
	 */
	@RequestMapping(value = "update", method = RequestMethod.POST)
	@ResponseBody
	public Object update(@RequestBody RouteModelEx routeModel) {
		// RouteModelEx
		log.debug("execute action update(@RequestBody RouteModelEx routeModel)");
		IDataBaseService db = super.getDbService();
		try {
			// Запомним ID маршрута
			int routeID = routeModel.getId().intValue();

			/*
			 * Если не нужно обновлять данные самого объекта Route, то необходимо обнулить ID маршрута. В этом случае
			 * одно из полей routeModel будет пустым (будем проверять поле routeType). Если этого не делать, то
			 * dbService попытается обновить такие данные маршрута, как routeType,cost, cityID.
			 */
			if (routeModel.getRouteTypeID() == null) {
				routeModel.setId(null);
			}

			// преобразуем модель в orm объект
			Route route = routeModel.toORMObject();
			log.debug(route.toString());
			// Обновим те объекты route, которые не null
			db.Routes().update(route);

			// Вытащим из БД обновленный марщрут
			Route responseRoute = db.Routes().get(routeID);

			// Сохраним изменения
			db.commit();
			return new RouteModelEx(responseRoute);
		} catch (Exception e) {
			db.rollback();
			log.error("update exception", e);
			return new ErrorModel(e);
		} finally {
			super.release();
		}
	}

}
