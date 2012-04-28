package com.pgis.bus.admin.client.mvp.view.stations;

import com.google.gwt.core.client.GWT;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiTemplate;
import com.google.gwt.user.client.rpc.AsyncCallback;
import com.google.gwt.user.client.ui.AbsolutePanel;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.ClickListener;
import com.google.gwt.user.client.ui.DialogBox;
import com.google.gwt.user.client.ui.HasWidgets;
import com.google.gwt.user.client.ui.HorizontalPanel;
import com.google.gwt.user.client.ui.VerticalPanel;
import com.google.gwt.user.client.ui.Widget;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.logical.shared.AttachEvent.Handler;
import com.google.gwt.event.logical.shared.AttachEvent;
import com.google.gwt.user.client.ui.TextBox;
import com.google.gwt.user.client.ui.Label;
import com.google.gwt.user.client.ui.SimpleCheckBox;
import com.google.gwt.user.client.ui.CheckBox;
import com.pgis.bus.admin.client.network.GreetingService;
import com.pgis.bus.admin.client.network.GreetingServiceAsync;
import com.pgis.bus.admin.shared.models.Node;

public class DialogAddStation extends DialogBox  {
	
	private final GreetingServiceAsync greetingService = GWT
			.create(GreetingService.class);
	
	private StationsMap stationsMap;
	private String city_name;
	
	private Button btn_ok,btn_cansel;
	private TextBox text_lat;
	private TextBox text_lon;
	private TextBox textCity;
	private TextBox textName;
	private TextBox textEnName;
	private TextBox textStreetName;
	private CheckBox chckbx_Trolley;
	private CheckBox chckbx_Bus;
	private CheckBox chckbxTram;
	private CheckBox chckbxMetro;  	  
	
    public DialogAddStation(StationsMap stationsMap) {
		super(false);
		
        this.stationsMap  = stationsMap;
        city_name = "Харьков";
        
        setText("Add new station");
		setModal(true);
        setAnimationEnabled(true);
        center();  
	    getElement().getStyle().setZIndex(2000);	
	    setSize("285px", "482px");
	    
	    AbsolutePanel rootPanel = new AbsolutePanel();
	    VerticalPanel vertPanel = new VerticalPanel();
	    HorizontalPanel btn_panel = new HorizontalPanel();
	    
	    btn_ok = new Button("OK");
	    btn_ok.addClickHandler(new ClickHandler() {
	    	public void onClick(ClickEvent event) {
	    		DialogAddStation.this.on_OKClick(event);
	    	}
	    });
	    btn_cansel = new Button("Cansel");
	    btn_cansel.addClickHandler(new ClickHandler() {
	    	public void onClick(ClickEvent event) {
	    		DialogAddStation.this.hide();
	    	}
	    });    
	    
  
	    btn_panel.add(btn_ok);
	    btn_panel.add(btn_cansel);
	    rootPanel.setSize("362px", "427px");
	    rootPanel.add(vertPanel,0,0);
	    
	    Label lblLat = new Label("Lat:");
	    vertPanel.add(lblLat);
	    rootPanel.add(btn_panel,65,367);
	    btn_panel.setSize("170px", "46px");
	    add(rootPanel);
	    
	    text_lat = new TextBox();
	    rootPanel.add(text_lat, 0, 23);
	    text_lat.setSize("86px", "18px");
	    
	    text_lat.setText(Double.toString(stationsMap.mouseLonLat.lat()));
	      
	    Label lblLon = new Label("Lon:");
	    rootPanel.add(lblLon, 138, 0);
	      
	    text_lon = new TextBox();
	    text_lon.setText(Double.toString(stationsMap.mouseLonLat.lon()));
	    rootPanel.add(text_lon, 138, 23);
	    text_lon.setSize("100px", "17px");
	      
	    Label lblCity = new Label("City:");
	    rootPanel.add(lblCity, 0, 70);
	      
	    textCity = new TextBox();
	    textCity.setReadOnly(true);
	    textCity.setText(city_name);
	    
	    rootPanel.add(textCity, 0, 95);
	      
	      Label lblNewLabel = new Label("Station name(ru):");
	      rootPanel.add(lblNewLabel, 0, 144);
	      
	      textName = new TextBox();
	      rootPanel.add(textName, 0, 168);
	      textName.setSize("129px", "17px");
	      
	      Label lblStreet = new Label("Street name:");
	      rootPanel.add(lblStreet, 0, 207);
	      
	      textStreetName = new TextBox();
	      rootPanel.add(textStreetName, 0, 230);
	      
	      chckbx_Trolley = new CheckBox("Trolleybus");
	      rootPanel.add(chckbx_Trolley, 0, 285);
	      
	      chckbx_Bus = new CheckBox("Bus");
	      rootPanel.add(chckbx_Bus, 127, 285);
	      
	      chckbxTram = new CheckBox("Tram");
	      rootPanel.add(chckbxTram, 0, 322);
	      
	      chckbxMetro = new CheckBox("Metro");
	      chckbxMetro.setChecked(true);
	      rootPanel.add(chckbxMetro, 127, 322);
	      
	      Label lblNameen = new Label("(en):");
	      rootPanel.add(lblNameen, 156, 144);
	      
	      textEnName = new TextBox();
	      rootPanel.add(textEnName, 156, 168);
	      textEnName.setSize("125px", "17px");
	    

	}
    public void on_OKClick(ClickEvent event) {
		Node node = new Node();
		
		int  use_trolley;
		int  use_metro;
		int use_tram;
		int use_bus;
		
		node.lat = Double.parseDouble(text_lat.getText());
		node.lon = Double.parseDouble(text_lon.getText());
		node.ru_name = textName.getText();
		node.en_name = textEnName.getText();
		node.street_name = this.textStreetName.getText();
		
		use_trolley = chckbx_Trolley.getValue() ? 1 : 0;
		use_metro = chckbxMetro.getValue() ? 1 : 0;
		use_tram = chckbxTram.getValue() ? 1 : 0;
		use_bus = chckbx_Bus.getValue() ? 1 : 0;
		
		DialogAddStation.this.sendStationDataToServer(node,city_name,use_trolley,use_metro,use_tram,use_bus);
	}
    
    
	private void sendStationDataToServer(Node node, String city_name,
			int  use_trolley,
			int  use_metro,
			int use_tram,
			int use_bus) {
		// First, we validate the input.
		
		// Then, we send the input to the server.
		
		greetingService.addStation(node,city_name,use_trolley,use_metro,use_tram,use_bus,
				new AsyncCallback<String>(){
					public void onFailure(Throwable caught) {
				       
					}

					public void onSuccess(String result) {
						DialogAddStation.this.hide();
					}
				});
	}
}
