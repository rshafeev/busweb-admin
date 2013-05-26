package com.pgis.bus.admin.controllers.exp;

import com.pgis.bus.data.exp.RepositoryException;

public class ControllerException extends Exception {

	/**
	 * 
	 */
	private static final long serialVersionUID = 2463787153385100096L;

	private errorsList error;

	public enum errorsList
	{
		unknown(99),
		another(100),
		imputParams(121),
		db(122),
		not_exist(123),
		already_exist(124);
		public String getMessage() {
			return this.name();
		}

		private int code;

		private errorsList(int code) {
			this.code = code;
		}

		public int getCode() {
			return code;
		}
	}

	public ControllerException() {
		super(errorsList.another.name());
		this.error = errorsList.another;
	}

	public ControllerException(String errorMessage, errorsList error) {
		super(errorMessage);
		this.error = error;
	}

	public ControllerException(errorsList err) {
		super();
		this.error = err;
	}

	public String getErrorName() {
		return error.name();
	}

	public int getErrorCode() {
		return error.getCode();
	}

}
