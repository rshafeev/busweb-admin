package com.pgis.bus.admin.models;

public class ErrorModel {
	public enum err_enum {
		c_city_already_exist, c_sql_err, c_exception;
		public String getMessage() {
			switch (this) {
			case c_city_already_exist:
				return "c_city_already_exist";
			case c_sql_err:
				return "c_sql_err";
			default:
				break;
			}
			return "Unknown error";
		}
	}

	err_enum error;

	public ErrorModel(ErrorModel.err_enum err) {
		this.error = err;
	}

	public err_enum getError() {
		return error;
	}

	public void setError(err_enum error) {
		this.error = error;
	}
}
