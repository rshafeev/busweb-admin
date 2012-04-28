package com.pgis.bus.admin.client.mvp.view;
import com.google.gwt.user.client.ui.IsWidget;

public interface IRoutesView extends IsWidget {
	public void setPresenter(IRoutesPresenter presenter);
	
	public interface IRoutesPresenter {
	}
}
