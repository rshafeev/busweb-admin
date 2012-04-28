package com.pgis.bus.admin.shared.models;

import java.io.Serializable;

public class LoginInfo implements Serializable {

	private static final long serialVersionUID = 1L;

	public String nickName;
	public String email;
	public String loginUrl;
	public String logoutUrl;
	public Boolean isLogged;

	public LoginInfo() {
		isLogged = false;
	}

}