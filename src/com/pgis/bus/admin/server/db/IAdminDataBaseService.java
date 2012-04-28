package com.pgis.bus.admin.server.db;

import java.sql.SQLException;

import javax.naming.NamingException;

import  com.pgis.bus.admin.server.db.orm.User;
import  com.pgis.bus.server.db.IDataBaseService;

public interface IAdminDataBaseService extends  IDataBaseService{

	User getUser(int id) throws NamingException, SQLException;
	User getUserByName(String name);
	
}
