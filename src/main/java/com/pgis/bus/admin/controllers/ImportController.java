package com.pgis.bus.admin.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;
import com.pgis.bus.admin.helpers.ControllerException;
import com.pgis.bus.admin.models.ErrorModel;
import com.pgis.bus.admin.models.LoadImportObjectsParams;
import com.pgis.bus.data.models.JsonRouteObjectModel;
import com.pgis.bus.data.models.JsonRouteObjectsListModel;
import com.pgis.bus.data.orm.City;
import com.pgis.bus.data.orm.JsonRouteObject;
import com.pgis.bus.data.orm.Route;
import com.pgis.bus.data.repositories.RepositoryException;
import com.pgis.bus.data.service.IDataBaseService;
import com.pgis.bus.data.service.IDataModelsService;

@Controller
@RequestMapping(value = "import/")
public class ImportController extends BaseController {
	private static final Logger log = LoggerFactory.getLogger(ImportController.class);

	@ResponseBody
	@RequestMapping(value = "insert", method = RequestMethod.POST)
	public String insert(String cityKey, String importRouteModelJson) {
		IDataBaseService db = null;
		try {
			log.debug("import.insert()");
			log.debug(cityKey);
			log.debug(importRouteModelJson);
			JsonRouteObjectModel importModel = (new Gson()).fromJson(importRouteModelJson, JsonRouteObjectModel.class);
			if (importModel.isValid() == false) {
				throw new Exception("ImportRouteModel is not valid");
			}
			db = super.getDbService();
			// Загрузим список всех городов из БД
			City city = db.Cities().getByKey(cityKey);
			if (city == null)
				throw new Exception("Can not find city");
			importModel.setCityID(city.getId());
			JsonRouteObject obj = new JsonRouteObject(cityKey, importModel);
			db.JsonRouteObjects().insert(obj);
			db.commit();
			return "ok";
		} catch (RepositoryException e) {
			if (db != null)
				db.rollback();
			log.error("RepositoryException", e);
			return (new Gson()).toJson(new ErrorModel(e));
		} catch (Exception e) {
			if (db != null)
				db.rollback();
			log.error("JsonSyntaxException exception", e);
			return (new Gson()).toJson(new ErrorModel(e));
		} finally {
			super.disposeDataServices();
		}
	}

	@ResponseBody
	@RequestMapping(value = "get_all", method = RequestMethod.POST)
	public String getAll(String data) {
		try {

			LoadImportObjectsParams params = (new Gson()).fromJson(data, LoadImportObjectsParams.class);
			log.debug(data);
			log.debug("get_all()");
			IDataBaseService db = super.getDbService();

			// Загрузим все Import objects из БД
			City city = db.Cities().get(params.getCityID());
			if (city == null) {
				throw new ControllerException(ControllerException.err_enum.c_error_imputParams);
			}
			IDataModelsService modelsService = this.getModelsService();
			JsonRouteObjectsListModel listModel = modelsService.JsonRouteObjects().getmportObjectsList(city.getKey(),
					params.getRouteTypeID());
			// вернем клиенту
			return (new Gson()).toJson(listModel);

		} catch (Exception e) {
			log.error("exception", e);
			return (new Gson()).toJson(new ErrorModel(e));
		} finally {
			super.disposeDataServices();

		}
	}

	@ResponseBody
	@RequestMapping(value = "get", method = RequestMethod.POST)
	public String get(int objID) {
		try {
			log.debug("get()");
			if (objID <= 0)
				throw new ControllerException(ControllerException.err_enum.c_error_imputParams);
			// Загрузим все Import objects из БД
			IDataModelsService modelsService = super.getModelsService();
			JsonRouteObjectModel jsonRouteObject = modelsService.JsonRouteObjects().get(objID);
			Route newRoute = jsonRouteObject.toRoute();
			// вернем клиенту
			return (new Gson()).toJson(newRoute);
		} catch (Exception e) {
			log.error("exception", e);
			return (new Gson()).toJson(new ErrorModel(e));
		} finally {
			super.disposeDataServices();
		}
	}
}
