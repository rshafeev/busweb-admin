package com.pgis.bus.admin.client.mvp.activity;



import com.google.gwt.event.shared.EventBus;
import com.google.gwt.user.client.ui.AcceptsOneWidget;
import com.pgis.bus.admin.client.AppConstants;
import com.pgis.bus.admin.client.mvp.ClientFactory;
import com.pgis.bus.admin.client.mvp.view.IRoutesView;

public class RoutesActivity  extends AbstractMainActivity  implements IRoutesView.IRoutesPresenter 
{
	private ClientFactory clientFactory;
	
	public RoutesActivity(ClientFactory clientFactory) {
		this.clientFactory = clientFactory;
	}
	
	@Override
	public void start(AcceptsOneWidget container, EventBus eventBus) {
		applyCurrentLinkStyle(AppConstants.ROUTES_LINK_ID);
		final IRoutesView view = clientFactory.getRoutesView();
		view.setPresenter(this);
		container.setWidget(view.asWidget());
	}
}
