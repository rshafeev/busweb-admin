package com.pgis.bus.admin.server.servlets;

import com.google.gwt.user.server.rpc.RemoteServiceServlet;
import com.pgis.bus.admin.client.network.GreetingService;
import com.pgis.bus.admin.shared.FieldVerifier;
import com.pgis.bus.admin.shared.models.Node;


import javax.servlet.*;
import javax.servlet.http.*;
import java.io.*;
import java.sql.*;
import java.util.Locale;

import org.postgresql.Driver;
/**
 * The server side implementation of the RPC service.
 */
@SuppressWarnings("serial")
public class GreetingServiceImpl extends RemoteServiceServlet implements
		GreetingService {

	public boolean POOL=true;  // true : with connectionpool false:without 
	   // String driver="com.informix.jdbc.IfxDriver";
	String driver="org.postgresql.Driver";
	   // String url="jdbc:informix-sqli://jaguar2:1525/db:informixserver=server1";
	String url="jdbc:postgresql://localhost:5432/transportDB";
    String user="postgres";
	String password="14R199009postgres";
    public void init (ServletConfig config) throws ServletException
	{
		super.init (config);
		ServletContext context=config.getServletContext();
		//ConnectionPoolObject cpo=new ConnectionPoolObject();
		//cpo.startTimer();
		
		
	}
	      
	public String addStation(Node node, String city_name,
			int  use_trolley,
			int  use_metro,
			int use_tram,
			int use_bus )
	{
		//select  bus.add_station('м. Героев труда','Харьков','ул. Героев труда ', 50,36,B'0',B'1',B'0',B'0');
	Locale.setDefault(new Locale(Locale.ENGLISH.getLanguage()));
		 
	String lat_s,lon_s;
	
	
	lat_s = Double.toString(node.lat);
	lon_s = Double.toString(node.lon);
	
	String query = String.format("select  bus.add_station('%s','%s','%s','%s', %s,%s,B'%d',B'%d',B'%d',B'%d');",
			  node.ru_name,
			  node.en_name,
			  city_name,
			  node.street_name,
			  lat_s,
			  lon_s,
			  use_trolley,
			  use_metro,
			  use_tram,
			  use_bus);
	
                                                           
	                                                                                
	      return "";                                                   
	}                    	   
	 

	public String greetServer(String input) throws IllegalArgumentException {
		// Verify that the input is valid. 
		if (!FieldVerifier.isValidName(input)) {
			// If the input is not valid, throw an IllegalArgumentException back to
			// the client.
			throw new IllegalArgumentException(
					"Name must be at least 4 characters long");
		}

		String serverInfo = getServletContext().getServerInfo();
		String userAgent = getThreadLocalRequest().getHeader("User-Agent");

		// Escape data from the client to avoid cross-site script vulnerabilities.
		input = escapeHtml(input);
		userAgent = escapeHtml(userAgent);

		return "Hello admin, " + input + "!<br><br>I am running " + serverInfo
				+ ".<br><br>It looks like you are using:<br>" + userAgent;
	}

	/**
	 * Escape an html string. Escaping data received from the client helps to
	 * prevent cross-site script vulnerabilities.
	 * 
	 * @param html the html string to escape
	 * @return the escaped string
	 */
	private String escapeHtml(String html) {
		if (html == null) {
			return null;
		}
		return html.replaceAll("&", "&amp;").replaceAll("<", "&lt;")
				.replaceAll(">", "&gt;");
	}

	/**
	 * Check whether the user is logged in. Return the current User information or
	 * throw an exception.
	 * 
	 * @return String
	 * @throws GreetingService.NotLoggedInException
	 */

	
}
