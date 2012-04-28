package com.pgis.bus.admin.server.db;

import java.sql.Connection;
import java.sql.SQLException;

import javax.naming.NamingException;

import com.pgis.bus.admin.server.db.orm.User;
import com.pgis.bus.server.db.*;


public class AdminDataBaseService extends WebDataBaseService
                                      implements IAdminDataBaseService {
	public AdminDataBaseService() throws WebDataBaseServiceException
	{
		super();	
	}
	
	public AdminDataBaseService(Connection conn)
	{
		super(conn);
	}
	@Override
	public User getUser(int id) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public User getUserByName(String name) {
		// TODO Auto-generated method stub
		return null;
	}
   

  	
	
}
