package com.pgis.bus.admin.server.providers;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.pgis.bus.admin.server.listeners.CustomAuthListener;
import com.pgis.bus.admin.server.models.CustomUserAuthentication;

public class CustomAuthenticationProvider implements AuthenticationProvider {
	private  static final Logger log = LoggerFactory.getLogger( CustomAuthenticationProvider.class ); // 1. Объявляем переменную логгера
	private static Map<String, String> users = new HashMap<String, String>();
	static {
		users.put("roman", "rar");
		users.put("justin", "javacodegeeks1");
	}
    
	
	@Override
	public Authentication authenticate(Authentication authentication) throws AuthenticationException {

		String username = (String) authentication.getPrincipal();
		String password = (String)authentication.getCredentials();
		
		
		
		if (users.get(username)==null)
			throw new UsernameNotFoundException("User not found");
		
		String storedPass = users.get(username);
		
		log.info("INFO:     LOGIN USER!!!!!");
		
		
		if (!storedPass.equals(password))
			throw new BadCredentialsException("Invalid password");
		
		Authentication customAuthentication = new CustomUserAuthentication("ROLE_USER", authentication);
		customAuthentication.setAuthenticated(true);
		
		return customAuthentication;
		
	}

	@Override
	public boolean supports(Class<? extends Object> authentication) {
		return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
	}

}
