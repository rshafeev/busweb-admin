package com.pgis.bus.admin.helpers;

import com.pgis.bus.data.repositories.RepositoryException;

public class ControllerException extends Exception {

	/**
	 * 
	 */
	private static final long serialVersionUID = 2463787153385100096L;
	
	private err_enum error;
	public enum err_enum {
		c_error_unknown, c_error_imputParams,c_error_db,c_city_already_exist;
		public String getMessage() {
			return this.name();
		}
	}
	
	public ControllerException() {
		super(err_enum.c_error_unknown.name());
		this.error = err_enum.c_error_unknown;
	}

	public ControllerException(String errorMessage) {
		super(errorMessage);
		this.error = err_enum.c_error_unknown;
	}

	public ControllerException(err_enum err) {
		super(err.getMessage());
		this.error = err;
	}

	public ControllerException(RepositoryException e) {
		super(e.getMessage());
		this.error = err_enum.c_error_db;
	}

	public err_enum getErrorCode() {
		return error;
	}
}
