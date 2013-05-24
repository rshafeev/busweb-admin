package com.pgis.bus.admin.controllers;

import java.util.Locale;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.i18n.LocaleContextHolder;

import com.pgis.bus.data.DBConnectionFactory;
import com.pgis.bus.data.service.IDataBaseService;
import com.pgis.bus.data.service.IDataModelsService;
import com.pgis.bus.data.service.impl.DataBaseService;
import com.pgis.bus.data.service.impl.DataModelsService;

public abstract class BaseController {
	private static final Logger log = LoggerFactory.getLogger(BaseController.class);

	private IDataBaseService dbService;
	private IDataModelsService modelsService;
	private boolean externDbService;
	private boolean externModelsService;

	public BaseController() {
		super();
		this.externDbService = false;
		this.externModelsService = false;
	}

	public BaseController(IDataBaseService dbService, IDataModelsService modelsService) {
		super();
		this.dbService = dbService;
		this.modelsService = modelsService;
		this.externDbService = true;
		this.externModelsService = true;
	}

	public IDataBaseService getDbService() {
		if (dbService == null) {
			try {
				dbService = new DataBaseService(DBConnectionFactory.getConnectionManager());
			} catch (Exception e) {
				log.error("Can not create dbService", e);
			}
		}
		return dbService;
	}

	public IDataModelsService getModelsService() {
		if (modelsService == null) {
			Locale locale = LocaleContextHolder.getLocale();
			try {
				modelsService = new DataModelsService(locale, DBConnectionFactory.getConnectionManager());
			} catch (Exception e) {
				log.error("Can not create modelsService", e);
			}
		}
		return modelsService;
	}

	public void release() {
		if (dbService != null && externDbService == false) {
			dbService.dispose();
			dbService = null;
		}
		if (modelsService != null && externModelsService == false) {
			modelsService.dispose();
			modelsService = null;
		}
	}

	public void setDbService(IDataBaseService dbService) {
		this.dbService = dbService;
		this.externDbService = true;

	}

	public void setModelsService(IDataModelsService modelsService) {
		this.modelsService = modelsService;
		this.externModelsService = true;
	}

}