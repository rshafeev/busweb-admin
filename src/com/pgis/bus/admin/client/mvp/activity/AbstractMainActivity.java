package com.pgis.bus.admin.client.mvp.activity;

import java.util.LinkedHashMap;
import java.util.Map;

import com.google.gwt.activity.shared.AbstractActivity;
import com.google.gwt.dom.client.Element;
import com.google.gwt.user.client.DOM;
import com.pgis.bus.admin.client.AppConstants;

public abstract class AbstractMainActivity extends AbstractActivity {
	private static Map<String, Element> navLinks = new LinkedHashMap<String, Element>();
	static {
		navLinks.put(AppConstants.ROUTES_LINK_ID, DOM.getElementById(AppConstants.ROUTES_LINK_ID));
		navLinks.put(AppConstants.STATIONS_LINK_ID, DOM.getElementById(AppConstants.STATIONS_LINK_ID));
	}
	
	public void applyCurrentLinkStyle(String viewId) {
		for (String linkId : navLinks.keySet()) {
			final Element link = navLinks.get(linkId);
			if (link == null) continue;
			if (linkId.equals(viewId)) {
				link.addClassName("b-current");
			} else {
				link.removeClassName("b-current");
			}
		}
	}
}
