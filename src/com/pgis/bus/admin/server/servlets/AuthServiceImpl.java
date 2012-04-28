package com.pgis.bus.admin.server.servlets;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;

import com.google.gwt.user.server.rpc.RemoteServiceServlet;
import com.pgis.bus.admin.client.network.AuthService;
import com.pgis.bus.admin.server.models.CustomUserAuthentication;


@SuppressWarnings("serial")
public class AuthServiceImpl extends RemoteServiceServlet implements AuthService {

	@Override
	public String retrieveUsername() {
		
		CustomUserAuthentication authentication = (CustomUserAuthentication)SecurityContextHolder.getContext().getAuthentication();
	
		if (authentication==null){
			System.out.println("Not logged in");
			return null;
		}
		else {
			return (String) authentication.getPrincipal();
		}
	//	authentication.setAuthenticated(false);
		
	}
	
	@Override 
	public String cancelCookie(){
		 String cookieName = "SPRING_SECURITY_REMEMBER_ME_COOKIE";
		 HttpServletRequest request = getThreadLocalRequest();
		 HttpServletResponse response = getThreadLocalResponse();
		 Cookie cookie = new Cookie(cookieName, null);
		 cookie.setMaxAge(0);
		 cookie.setPath(StringUtils.hasLength(request.getContextPath()) ? request.getContextPath() : "/");
		 
		 return "true";
	}
	
	
}
