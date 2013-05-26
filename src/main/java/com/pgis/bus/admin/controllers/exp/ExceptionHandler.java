package com.pgis.bus.admin.controllers.exp;

import com.pgis.bus.admin.controllers.exp.ControllerException.errorsList;
import com.pgis.bus.admin.models.ErrorModel;

public abstract class ExceptionHandler {

	protected Exception inputThrowble;
	protected ControllerException error;

	public ExceptionHandler(Exception exp) {
		this.inputThrowble = exp;
		if (this.inputThrowble instanceof ControllerException) {
			error = (ControllerException) inputThrowble;
		}
	}

	public String getError() {
		return error.getErrorName();
	}

	public String getErrorMsg() {
		return error.getMessage();
	}

	public int getErrorCode() {
		return error.getErrorCode();
	}

	public ErrorModel makeModel() {
		if (error != null) {
			return new ErrorModel(this.getError(), this.getErrorMsg(), this.getErrorCode());
		}
		ErrorModel model = new ErrorModel();
		model.setError(ControllerException.errorsList.unknown.name());
		return model;
	}
}
