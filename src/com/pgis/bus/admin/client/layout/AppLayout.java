package com.pgis.bus.admin.client.layout;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.util.StringUtils;


import com.google.gwt.core.client.GWT;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.rpc.AsyncCallback;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.Hyperlink;
import com.google.gwt.user.client.ui.SimplePanel;
import com.google.gwt.user.client.ui.Widget;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.user.client.ui.AbsolutePanel;
import com.google.gwt.user.client.ui.Label;
import com.pgis.bus.admin.client.network.AuthService;
import com.pgis.bus.admin.client.network.AuthServiceAsync;

public class AppLayout extends Composite {
	interface AppLayoutUiBinder extends UiBinder<Widget, AppLayout> { }
	private static AppLayoutUiBinder uiBinder = GWT.create(AppLayoutUiBinder.class);
	private final AuthServiceAsync authService = GWT.create(AuthService.class);
	@UiField SimplePanel appContent;
	@UiField Button button;
	@UiField Label label_user;

	public AppLayout() {
		initWidget(uiBinder.createAndBindUi(this));
		
	}
	
	public SimplePanel getAppContentHolder() {
		return this.appContent;
	}
	@UiHandler("button")
	void onButtonClick(ClickEvent event) {
		
		final Hyperlink link = new Hyperlink("../j_spring_security_logout","../j_spring_security_logout");
		
		authService.cancelCookie(new AsyncCallback<String>(){
			public void onFailure(Throwable caught) {
		       
			}

			public void onSuccess(String result) {
				Window.Location.replace(link.getText());
			}
		});
		//Window.alert("WORK!!");
	}
	
	public void setUserLogin(String userName)
	{
		label_user.setText(userName);
	}
	
}
