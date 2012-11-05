

qx.Mixin.define("bus.admin.mvp.presenter.mng.RoutesManager", {
			construct : function() {

			},
			members : {
				startCreateNewRoute : function(data, event_finish_func) {

					var routeModel = {
						id : null,
						city_id : data.city_id,
						number : data.number,
						cost : data.cost,
						route_type_id : data.route_type_id,
						name : data.name,
						directRouteWay : null,
						reverseRouteWay : null
					};

					this._routePage.setCurrRouteModel(routeModel);
					this.fireDataEvent("startCreateNewRoute", routeModel);
					event_finish_func(data);
				},

				finishCreateNewRoute : function(isOK, event_finish_func) {
					var data = {
						ok : isOK
					};
					this.fireDataEvent("finishCreateNewRoute", data);

					if (isOK == false) {
						var cloneRoute = bus.admin.helpers.ObjectHelper
								.clone(this._routePage.getRouteModel());
						this._routePage.setCurrRouteModel(cloneRoute);
						var loadRouteData = {
							route : cloneRoute,
							error : null,
							server_error : null
						};
						this.fireDataEvent("loadRoute", loadRouteData);
					} else {
						// send new route to the server
					}
					event_finish_func(data);
				},

				loadRoutesList : function(city_id, route_type_id,
						event_finish_func) {
					this.debug("loadRoutesList event execute");

					var request = new bus.admin.net.DataRequest();
					var data_json = {
						city_id : city_id,
						route_type_id : route_type_id
					};

					var reqObj = request.getRoutesList(data_json, function(
									response) {
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
					this.debug("loadRoute event execute");

					var request = new bus.admin.net.DataRequest();
					var data_json = route_id.toString();
					var reqObj = request.getRoute(data_json,
							function(response) {
								var result = response.getContent();
								if (result == null || result.error != null) {
									var data = {
										route : null,
										error : true,
										server_error : result.error
									};
									this.fireDataEvent("loadRoute", data);
									event_finish_func(data);
								} else {
									var data = {
										route : result,
										error : null,
										server_error : null
									};
									var cloneRoute = bus.admin.helpers.ObjectHelper
											.clone(result);
									this._routePage.setRouteModel(result);
									this._routePage
											.setCurrRouteModel(cloneRoute);

									this.fireDataEvent("loadRoute", data);
									event_finish_func(data);
								}
							}, function() {
								var data = {
									route : null,
									error : true,
									server_error : null
								};
								this.fireDataEvent("loadRoute", data);
								event_finish_func(data);
							}, this);
					return request;
				}

			}
		});