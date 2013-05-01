package com.pgis.bus.admin.providers;

import java.sql.SQLException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.pgis.bus.admin.models.CustomUserAuthentication;
import com.pgis.bus.data.DBConnectionFactory;
import com.pgis.bus.data.orm.type.AuthenticateResult;
import com.pgis.bus.data.service.IDataBaseService;
import com.pgis.bus.data.service.impl.DataBaseService;

public class CustomAuthenticationProvider implements AuthenticationProvider {
	private static final Logger log = LoggerFactory.getLogger(CustomAuthenticationProvider.class);

	@Override
	public Authentication authenticate(Authentication authentication) throws AuthenticationException {

		String userName = (String) authentication.getPrincipal();
		String userPassword = (String) authentication.getCredentials();
		AuthenticateResult result = null;
		IDataBaseService db = null;
		try {
			db = new DataBaseService(DBConnectionFactory.getConnectionManager());

			result = db.Users().authenticate("admin", userName, userPassword);
			if (result == AuthenticateResult.c_auth_ok) {
				Authentication customAuthentication = new CustomUserAuthentication("ROLE_USER", authentication);
				customAuthentication.setAuthenticated(true);
				return customAuthentication;
			} else {
				log.warn("User could not authenticate");

			}

		} catch (SQLException e) {
			log.error("Provider could not authenticate of user(Problems with data source)", e);
		} finally {
			if (db != null)
				db.dispose();
		}

		if (result == AuthenticateResult.c_login_invalid)
			throw new UsernameNotFoundException("User not found");
		else if (result == AuthenticateResult.c_password_invalid)
			throw new BadCredentialsException("Invalid password");
		else
			throw new AuthenticationServiceException("AuthenticationService has problems.");

	}

	@Override
	public boolean supports(Class<? extends Object> authentication) {
		return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
	}

}
