package com.pgis.bus.admin.controllers;

import com.pgis.bus.data.DBConnectionFactory;
import com.pgis.bus.data.IDataBaseService;
import com.pgis.bus.data.impl.DataBaseService;

public abstract class BaseController {

	private IDataBaseService db;
	public BaseController() {
		super();
	}

	public BaseController(IDataBaseService db) {
		super();
		this.db = db;
	}
	
	public IDataBaseService getDB(){
		if(db == null)
			db = new DataBaseService(DBConnectionFactory.getConnectionManager());
		return db;
	}

}