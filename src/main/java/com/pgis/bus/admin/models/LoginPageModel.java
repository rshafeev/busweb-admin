package com.pgis.bus.admin.models;

public class LoginPageModel {

	private boolean isLoginFailed;
	private boolean isPassFailed;
	private String loginName;
	
	public boolean isLoginFailed() {
		return isLoginFailed;
	}

	public void setLoginFailed(boolean isLoginFailed) {
		this.isLoginFailed = isLoginFailed;
	}

	public boolean isPassFailed() {
		return isPassFailed;
	}

	public void setPassFailed(boolean isPassFailed) {
		this.isPassFailed = isPassFailed;
	}

	public String getLoginName() {
		if(loginName==null)
			return "";
		return loginName;
	}

	public void setLoginName(String loginName) {
		this.loginName = loginName;
	}

	public boolean isAuthFailed(){
		if (isLoginFailed || isPassFailed)
			return true;
		return false;
	}
}
