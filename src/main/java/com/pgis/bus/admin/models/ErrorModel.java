package com.pgis.bus.admin.models;

import javax.xml.bind.annotation.XmlRootElement;

import com.pgis.bus.admin.controllers.exp.ExceptionHandler;

@XmlRootElement
public class ErrorModel {

	private String error = "unknown";
	private String errorMsg;
	private int errorCode;

	public ErrorModel() {

	}

	public ErrorModel(String error, String errorMsg, int errorCode) {
		super();
		this.error = error;
		this.errorMsg = errorMsg;
		this.errorCode = errorCode;
	}

	public String getError() {
		return error;
	}

	public void setError(String error) {
		this.error = error;
	}

	public String getErrorMsg() {
		return errorMsg;
	}

	public void setErrorMsg(String errorMsg) {
		this.errorMsg = errorMsg;
	}

	public int getErrorCode() {
		return errorCode;
	}

	public void setErrorCode(int errorCode) {
		this.errorCode = errorCode;
	}

}
