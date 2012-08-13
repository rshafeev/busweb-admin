package com.pgis.bus.admin.listeners;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.pgis.bus.data.DBConnectionFactory;
import com.pgis.bus.data.DBConnectionManager;


public class BasicServiceListener implements ServletContextListener {
	private  static final Logger log = LoggerFactory.getLogger( BasicServiceListener.class );
   
    @Override
    public void contextDestroyed(ServletContextEvent sce)
    {
    	
    	log.debug("contextInitialized");
    }

    @Override
    public void contextInitialized(ServletContextEvent sce)
    {
    	
    	DBConnectionFactory.init(new DBConnectionManager("jdbc/busPoolDB"));
    	log.info("contextInitialized");

    }
    
}
