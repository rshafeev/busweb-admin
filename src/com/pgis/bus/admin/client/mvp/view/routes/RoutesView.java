
package com.pgis.bus.admin.client.mvp.view.routes;

import com.google.gwt.core.client.GWT;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.ListBox;
import com.google.gwt.user.client.ui.Widget;



import com.google.gwt.user.client.ui.AbsolutePanel;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.user.cellview.client.CellList;
import com.google.gwt.cell.client.AbstractCell;
import com.google.gwt.cell.client.Cell.Context;
import com.google.gwt.safehtml.shared.SafeHtmlBuilder;
import com.google.gwt.user.cellview.client.CellTable;
import com.pgis.bus.admin.client.mvp.view.IRoutesView;
import com.pgis.bus.admin.client.mvp.view.IRoutesView.IRoutesPresenter;
public class RoutesView extends Composite implements IRoutesView{

	private static RoutesViewUiBinder uiBinder = GWT.create(RoutesViewUiBinder.class);
	private IRoutesPresenter presenter;
	private RouteMap map;
	@UiField ListBox m_combo_cities;
	@UiField ListBox m_list_points;
	@UiField AbsolutePanel mapPanel;
	@UiField AbsolutePanel mainPanel;
	@UiField Button m_btn_add;
	@UiField Button m_btn_del;
	@UiField Button m_btn_save;
	@UiField(provided=true) CellTable<Object> cellTable = new CellTable<Object>();
	@UiField(provided=true) CellTable<Object> cellTable_1 = new CellTable<Object>();
	
	interface RoutesViewUiBinder extends UiBinder<Widget, RoutesView> {
	}
	public RoutesView() {
		initWidget(uiBinder.createAndBindUi(this));
		map = new RouteMap(this,"100%","100%");
		map.setCenter(36.22882, 50.00519, 11);
		mapPanel.add(map,220,23);
		mapPanel.setSize("100%","100%");
		mainPanel.setSize("100%","100%");
		
	//	m_list_points.i
	}


	@Override
	public void setPresenter(IRoutesPresenter presenter) {
		this.presenter = presenter;
	}

	public void setText(String text) {
	//	button.setText(text);
	}

	public String getText() {
		//return button.getText();
		return "";
	}
	@UiHandler("m_btn_add")
	void onM_btn_addClick(ClickEvent event) {
		m_btn_save.setEnabled(true);
		m_btn_del.setEnabled(false);
		map.setAddPointsMode(true);
	}
	@UiHandler("m_btn_del")
	void onM_btn_delClick(ClickEvent event) {
		
		
	}
}
