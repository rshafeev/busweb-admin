package com.pgis.bus.admin.client.mvp.place;

import com.google.gwt.place.shared.Place;
import com.google.gwt.place.shared.PlaceTokenizer;
import com.google.gwt.place.shared.Prefix;

public class StationsPlace extends Place {
	private static final String VIEW_HISTORY_TOKEN = "stations";
	
	public StationsPlace()	{
		
	}
	
	@Prefix(value = VIEW_HISTORY_TOKEN)
	public static class Tokenizer implements PlaceTokenizer<StationsPlace> {
		@Override
		public StationsPlace getPlace(String token) {
			return new StationsPlace();
		}
		@Override
		public String getToken(StationsPlace place) {
			return "";
		}
	}	
}
