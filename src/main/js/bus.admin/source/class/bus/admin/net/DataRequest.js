/*
 * 
 * this._cities = bus.admin.net.RequestFactory.createCitiesObj(sync);
 */

qx.Class.define("bus.admin.net.DataRequest", {
	extend : qx.core.Object,

	construct : function(sync) {
		if (sync != null) {
			this.__sync = sync;
		}
	},
	members : {
		__sync : false,
		//**********************
		getImportObjects : function(data, completed_func, failed_func, self) {
			var routes = bus.admin.net.DataRequestFactory
					.getImportObjectsRequestObj(this.__sync);
			return routes
					.getImportObjects(data, completed_func, failed_func, self);
		},
		getImportRoute : function(data, completed_func, failed_func, self) {
			var routes = bus.admin.net.DataRequestFactory
					.getImportObjectsRequestObj(this.__sync);
			return routes
					.getImportRoute(data, completed_func, failed_func, self);
		},		
		// *********************
		getRoutesList : function(data, completed_func, failed_func, self) {
			var routes = bus.admin.net.DataRequestFactory
					.getRoutesRequestObj(this.__sync);
			return routes
					.getRoutesList(data, completed_func, failed_func, self);
		},
		getRoute : function(data, completed_func, failed_func, self) {
			var routes = bus.admin.net.DataRequestFactory
					.getRoutesRequestObj(this.__sync);
			return routes.getRoute(data, completed_func, failed_func, self);
		},
		insertRoute : function(routeModel, completed_func, failed_func, self) {
			var routes = bus.admin.net.DataRequestFactory
					.getRoutesRequestObj(this.__sync);
			return routes.insertRoute(routeModel, completed_func, failed_func,
					self);
		},

		updateRoute : function(updateData, completed_func, failed_func, self) {
			var routes = bus.admin.net.DataRequestFactory
					.getRoutesRequestObj(this.__sync);
			return routes.updateRoute(updateData, completed_func, failed_func,
					self);
		},

		removeRoute : function(route_id, completed_func, failed_func, self) {
			var routes = bus.admin.net.DataRequestFactory
					.getRoutesRequestObj(this.__sync);
			return routes.removeRoute(route_id, completed_func, failed_func,
					self);
		},

		// ***************

		getStationsByCityInBox : function(data, completed_func, failed_func,
				self) {
			var stations = bus.admin.net.DataRequestFactory
					.getStationsRequestObj(this.__sync);
			return stations.getStationsByCityInBox(data, completed_func,
					failed_func, self);
		},
		getStationsByCity : function(data, completed_func,
				failed_func, self) {
			var stations = bus.admin.net.DataRequestFactory
					.getStationsRequestObj(this.__sync);
			return stations.getStationsByCity(data,
					completed_func, failed_func, self);
		},
		insertStation : function(stationModel, completed_func, failed_func,
				self) {
			var stations = bus.admin.net.DataRequestFactory
					.getStationsRequestObj(this.__sync);
			return stations.insertStation(stationModel, completed_func,
					failed_func, self);
		},
		updateStation : function(stationModel, completed_func, failed_func,
				self) {
			var stations = bus.admin.net.DataRequestFactory
					.getStationsRequestObj(this.__sync);
			return stations.updateStation(stationModel, completed_func,
					failed_func, self);
		},
		deleteStation : function(station_id, completed_func, failed_func, self) {
			var stations = bus.admin.net.DataRequestFactory
					.getStationsRequestObj(this.__sync);
			return stations.deleteStation(station_id, completed_func,
					failed_func, self);
		},
		// *********************

		getAllCities : function(completed_func, failed_func, self) {
			var cities = bus.admin.net.DataRequestFactory
					.getCitiesRequestObj(this.__sync);
			return cities.getAllCities(completed_func, failed_func, self);
		},
		updateCity : function(cityModel, completed_func, failed_func, self) {
			var cities = bus.admin.net.DataRequestFactory
					.getCitiesRequestObj(this.__sync);
			return cities.updateCity(cityModel, completed_func, failed_func,
					self);
		},
		insertCity : function(cityModel, completed_func, failed_func, self) {
			var cities = bus.admin.net.DataRequestFactory
					.getCitiesRequestObj(this.__sync);
			return cities.insertCity(cityModel, completed_func, failed_func,
					self);
		},
		deleteCity : function(city_id, completed_func, failed_func, self) {
			var cities = bus.admin.net.DataRequestFactory
					.getCitiesRequestObj(this.__sync);
			return cities
					.deleteCity(city_id, completed_func, failed_func, self);
		},
		getAllLanguages : function(completed_func, failed_func, self) {
			var langs = bus.admin.net.DataRequestFactory
					.getLangsRequestObj(this.__sync);
			return langs.getAllLanguages(completed_func, failed_func, self);
		}
	}

});
