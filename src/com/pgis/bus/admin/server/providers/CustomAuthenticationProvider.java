package com.pgis.bus.admin.server.providers;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.pgis.bus.admin.server.listeners.CustomAuthListener;
import com.pgis.bus.admin.server.models.CustomUserAuthentication;
import com.pgis.bus.data.AdminDataBaseService;
import com.pgis.bus.data.Authenticate_enum;
import com.pgis.bus.data.DBConnectionFactory;
import com.pgis.bus.data.IAdminDataBaseService;
import com.pgis.bus.data.WebDataBaseServiceException;
import com.pgis.bus.data.repositories.RepositoryException;

public class CustomAuthenticationProvider implements AuthenticationProvider {
	private static final Logger log = LoggerFactory
			.getLogger(CustomAuthenticationProvider.class); // 1. Объявляем
															// переменную
															// логгера
	private static Map<String, String> users = new HashMap<String, String>();
	static {
		users.put("roman", "rar");
		users.put("justin", "javacodegeeks1");
		
	}

	@Override
	public Authentication authenticate(Authentication authentication)
			throws AuthenticationException {

		String userName = (String) authentication.getPrincipal();
		String userPassword = (String) authentication.getCredentials();

		IAdminDataBaseService db = new AdminDataBaseService();
		Authenticate_enum result = null;

		try {
			result = db.authenticate("admin", userName, userPassword);
		} catch (RepositoryException e) {
			// TODO Auto-generated catch block
			log.error(
					"Provider could not authenticate of user(Problems with data source)",
					e);
		}

		if (result == Authenticate_enum.c_auth_ok) {
			Authentication customAuthentication = new CustomUserAuthentication(
					"ROLE_USER", authentication);
			customAuthentication.setAuthenticated(true);
			return customAuthentication;
		} else {
			log.warn("User could not authenticate");
			if (result == Authenticate_enum.c_login_invalid)
				throw new UsernameNotFoundException("User not found");
			else if (result == Authenticate_enum.c_password_invalid)
				throw new BadCredentialsException("Invalid password");
			else
				throw new AuthenticationServiceException(
						"AuthenticationService has problems.");
		}
	}

	@Override
	public boolean supports(Class<? extends Object> authentication) {
		return UsernamePasswordAuthenticationToken.class
				.isAssignableFrom(authentication);
	}

}
