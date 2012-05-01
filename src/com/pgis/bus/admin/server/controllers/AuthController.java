package com.pgis.bus.admin.server.controllers;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.servlet.mvc.AbstractController;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.Controller;
import org.springframework.web.servlet.view.RedirectView;

import com.pgis.bus.admin.server.models.CustomUserAuthentication;

public class AuthController extends AbstractController {

	@Override
	public ModelAndView handleRequestInternal(HttpServletRequest arg0,
			HttpServletResponse arg1) throws Exception {
		ModelAndView mv  = new ModelAndView("login");
		
		arg0.getSession();
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if(authentication instanceof CustomUserAuthentication)
				{ 
				   if(((CustomUserAuthentication)authentication).isAuthenticated())
					return new ModelAndView(new RedirectView("admin")); 
				   
				}
		
		if(authentication!=null)
			mv.addObject("login",authentication.getPrincipal());
		
        mv.addObject("login_error", arg0.getParameter("login_error"));		
        //mv.addObject("login_error", arg0.getParameterNames().toString());		
        mv.addObject("req", arg0);		
        mv.addObject("res", arg1);	
        
        return mv;
	}

	

}
