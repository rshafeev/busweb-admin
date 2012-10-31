

qx.Mixin.define("bus.admin.mvp.presenter.mng.RoutesManager", {
	construct : function() {

	},
	members : {

		loadRoutesList : function(city_id, route_type_id, event_finish_func) {
			this.debug("loadRoutesList event execute");

			var modelsContainer = qx.core.Init.getApplication()
					.getModelsContainer();
			var request = new bus.admin.net.DataRequest();
			var data_json = {
				city_id : city_id,
				route_type_id : route_type_id
			};

			var reqObj = request.getRoutesList(data_json, function(response) {
						var result = response.getContent();
						if (result == null || result.error != null) {
							var data = {
								routes : null,
								error : true,
								server_error : result.error
							};
							this.fireDataEvent("loadRoutesList", data);
							event_finish_func(data);
						} else {
							var data = {
								routes : result,
								error : null,
								server_error : null
							};
							this.fireDataEvent("loadRoutesList", data);
							event_finish_func(data);
						}
					}, function() {
						var data = {
							routes : null,
							error : true,
							server_error : null
						};
						this.fireDataEvent("loadRoutesList", data);
						event_finish_func(data);
					}, this);
			return request;
		},
		loadRoute : function(route_id, event_finish_func) {
			/*
			 * this.debug("deleteCity event execute");
			 * 
			 * var modelsContainer = qx.core.Init.getApplication()
			 * .getModelsContainer(); var citiesRequest = new
			 * bus.admin.net.DataRequest(); var city_id_json =
			 * city_id.toString(); var request =
			 * citiesRequest.deleteCity(city_id_json, function(
			 * response) { var result = response.getContent(); if
			 * (result == null || result.error != null) { var data = {
			 * city_id : null, error : true, server_error : result.error };
			 * this.fireDataEvent("delete_city", data);
			 * event_finish_func(data); } else { var data = { city_id :
			 * city_id, error : null, server_error : null };
			 * modelsContainer.getCitiesModel().deleteCity(city_id);
			 * this.fireDataEvent("delete_city", data);
			 * event_finish_func(data); } }, function() { var data = {
			 * city_id : null, error : true, server_error : null };
			 * this.fireDataEvent("delete_city", data);
			 * event_finish_func(data); }, this); return request;
			 */
		}

	}
});