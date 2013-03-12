package com.pgis.bus.admin.controllers;

import java.util.Collection;

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
import com.pgis.bus.data.helpers.LoadImportObjectOptions;
import com.pgis.bus.data.models.ImportRouteModel;
import com.pgis.bus.data.orm.City;
import com.pgis.bus.data.orm.ImportObject;
import com.pgis.bus.data.orm.Route;
import com.pgis.bus.data.repositories.RepositoryException;

@Controller
@RequestMapping(value = "import/")
public class ImportController extends BaseController {
	private static final Logger log = LoggerFactory
			.getLogger(ImportController.class);

	@ResponseBody
	@RequestMapping(value = "insert", method = RequestMethod.POST)
	public String insert(String cityKey, String importRouteModelJson) {
		try {
			log.debug("import.insert()");
			log.debug(cityKey);
			log.debug(importRouteModelJson);
			ImportRouteModel importModel = (new Gson()).fromJson(
					importRouteModelJson, ImportRouteModel.class);
			if (importModel.isValid() == false) {
				throw new Exception("ImportRouteModel is not valid");
			}
			
			// Загрузим список всех городов из БД
			City city = this.getDB().Cities().getCityByKey(cityKey);
			if (city == null)
				throw new Exception("Can not find city");
			importModel.setCityID(city.id);
			ImportObject obj = new ImportObject(cityKey, importModel);
			this.getDB().Import().insertObject(obj);
			return "ok";
		} catch (RepositoryException e) {
			log.error("RepositoryException", e);
			return (new Gson()).toJson(new ErrorModel(e));
		} catch (Exception e) {
			log.error("JsonSyntaxException exception", e);
			return (new Gson()).toJson(new ErrorModel(e));
		}
	}

	@ResponseBody
	@RequestMapping(value = "get_all", method = RequestMethod.POST)
	public String getAll(String data) {
		try {
			LoadImportObjectsParams params = (new Gson()).fromJson(data,
					LoadImportObjectsParams.class);
			log.debug(data);
			log.debug("get_all()");
			// Загрузим все Import objects из БД
			City city = this.getDB().Cities().getCityByID(params.getCityID());
			if (city == null) {
				throw new ControllerException(
						ControllerException.err_enum.c_error_imputParams);
			}
			LoadImportObjectOptions opts = new LoadImportObjectOptions();
			opts.setLoadData(false);

			Collection<ImportObject> objs = this.getDB().Import().getObjects(city.key,
					params.getRouteTypeID(), opts);
			// вернем клиенту
			return (new Gson()).toJson(objs);

		} catch (Exception e) {
			log.error("exception", e);
			return (new Gson()).toJson(new ErrorModel(e));
		}
	}

	@ResponseBody
	@RequestMapping(value = "get", method = RequestMethod.POST)
	public String get(int objID) {
		try {
			log.debug("get()");
			if (objID <= 0)
				throw new ControllerException(
						ControllerException.err_enum.c_error_imputParams);
			// Загрузим все Import objects из БД
			LoadImportObjectOptions opts = new LoadImportObjectOptions();
			opts.setLoadData(false);
			ImportRouteModel importModel = this.getDB().Import().getRouteModelForObj(objID);
			Route newRoute = importModel.toRoute();
			// вернем клиенту
			return (new Gson()).toJson(newRoute);
		} catch (Exception e) {
			log.error("exception", e);
			return (new Gson()).toJson(new ErrorModel(e));
		}
	}
}
