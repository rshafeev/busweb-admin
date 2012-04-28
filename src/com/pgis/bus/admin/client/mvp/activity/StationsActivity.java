package com.pgis.bus.admin.client.mvp.activity;


import com.google.gwt.event.shared.EventBus;
import com.google.gwt.user.client.ui.AcceptsOneWidget;
import com.pgis.bus.admin.client.AppConstants;
import com.pgis.bus.admin.client.mvp.ClientFactory;
import com.pgis.bus.admin.client.mvp.view.IStationsView;

public class StationsActivity extends AbstractMainActivity  implements IStationsView.IStationsPresenter 
{
	private ClientFactory clientFactory;
	
	public StationsActivity(ClientFactory clientFactory) {
		this.clientFactory = clientFactory;
	}
	
	@Override
	public void start(AcceptsOneWidget container, EventBus eventBus) {
		applyCurrentLinkStyle(AppConstants.STATIONS_LINK_ID);
		final IStationsView view = clientFactory.getStationsView();
		view.setPresenter(this);
		container.setWidget(view.asWidget());
	}
}
