package com.pgis.bus.admin.client.mvp.view.stations;

import org.gwtopenmaps.openlayers.client.LonLat;

import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.Element;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.RootPanel;
import com.google.gwt.user.client.ui.Widget;

import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.ui.DockPanel;
import com.google.gwt.user.client.ui.FlowPanel;
import com.google.gwt.user.client.ui.HTMLPanel;
import com.google.gwt.user.client.ui.ListBox;
import com.google.gwt.user.client.ui.AbsolutePanel;
import com.pgis.bus.admin.client.mvp.view.IStationsView;

public class StationsView  extends Composite implements IStationsView{

	 
	interface StationsViewUiBinder extends UiBinder<Widget, StationsView> 
	{
		
	}
	
	public StationsView() {
		super();
		
		initWidget(uiBinder.createAndBindUi(this));
		    
	
		//flow.add(map);
		StationsMap mapPanel = new StationsMap(this,"600px","600px");
		mapPanel.setCenter(36.22882, 50.00519, 11);
        rootPanel.add(mapPanel,220,23);
		
		
	}
	
	@Override
	public void onAttach()
	{
		super.onAttach();
	}
	
	@Override
	public void onLoad()
	{
		 super.onLoad();
    }
	
    @Override
	public void setPresenter(IStationsPresenter presenter) {
		this.presenter = presenter;
	}
	
	
	private static StationsViewUiBinder uiBinder = GWT.create(StationsViewUiBinder.class);
	@UiField ListBox combo_city;
	@UiField ListBox list_stations;
	@UiField AbsolutePanel rootPanel;
	private IStationsPresenter presenter;
	
}
