package com.pgis.bus.admin.controllers.exp;

import com.pgis.bus.admin.controllers.exp.ControllerException.errorsList;
import com.pgis.bus.admin.models.ErrorModel;
import com.pgis.bus.data.exp.RepositoryException;

public class RoutesExceptionHandler extends ExceptionHandler {

	public RoutesExceptionHandler(Exception e) {
		super(e);

	}

	public void handleGet() {

	}

	public void handleInsert() {
		if (error != null)
			return;
		if (inputThrowble instanceof RepositoryException) {
			switch (((RepositoryException) inputThrowble).getCode()) {
			case already_exist:
				super.error = new ControllerException("Route with same number has already exist",
						errorsList.already_exist);
			default:
				super.error = new ControllerException("Can not insert route to database", errorsList.another);
				break;
			}
			return;
		}
		super.error = new ControllerException("Can not insert route", errorsList.another);
	}

}
