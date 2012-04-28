package com.pgis.bus.admin.client.mvp;

import com.google.gwt.place.shared.PlaceHistoryMapper;
import com.google.gwt.place.shared.WithTokenizers;
import com.pgis.bus.admin.client.mvp.place.RoutesPlace;
import com.pgis.bus.admin.client.mvp.place.StationsPlace;

@WithTokenizers({RoutesPlace.Tokenizer.class, StationsPlace.Tokenizer.class})
public interface DemoPlaceHistoryMapper extends PlaceHistoryMapper {
}
