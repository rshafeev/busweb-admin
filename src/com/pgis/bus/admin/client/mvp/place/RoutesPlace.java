package com.pgis.bus.admin.client.mvp.place;

import com.google.gwt.place.shared.Place;
import com.google.gwt.place.shared.PlaceTokenizer;
import com.google.gwt.place.shared.Prefix;

public class RoutesPlace extends Place{
	private static final String VIEW_HISTORY_TOKEN = "routes";
	public RoutesPlace()	{
		
	}
	
	@Prefix(value = VIEW_HISTORY_TOKEN)
	public static class Tokenizer implements PlaceTokenizer<RoutesPlace> {
		@Override
		public RoutesPlace getPlace(String token) {
			return new RoutesPlace();
		}
		@Override
		public String getToken(RoutesPlace place) {
			return "";
		}
	}		
}


