

qx.Mixin.define("bus.admin.mvp.presenter.mng.RoutesManager", {
	construct : function() {

	},
	members : {
		loadImportRoute : function(objID, event_finish_func) {
			var request = new bus.admin.net.DataRequest();

			var reqObj = request.getImportRoute(objID, function(response) {
						var result = response.getContent();
						if (result == null || result.error != null) {
							var data = {
								route : null,
								error : true,
								server_error : result == null
										? null
										: result.error
							};
							this.fireDataEvent("loadImportRoute", data);
							if (event_finish_func != null)
								event_finish_func(data);
						} else {
							var data = {
								route : result,
								error : null,
								server_error : null
							};
							// currRoutesList
							this.fireDataEvent("loadImportRoute", data);
							if (event_finish_func != null)
								event_finish_func(data);
						}
					}, function() {
						var data = {
							route : null,
							error : true,
							server_error : null
						};
						this.fireDataEvent("loadImportRoute", data);
						if (event_finish_func != null)
							event_finish_func(data);
					}, this);
			return request;
		},

		loadImportObjects : function(cityID, routeTypeID, event_finish_func) {
			var request = new bus.admin.net.DataRequest();
			var data_json = {
				cityID : cityID,
				routeTypeID : routeTypeID
			};
			var reqObj = request.getImportObjects(data_json,
					function(response) {
						var result = response.getContent();
						if (result == null || result.error != null) {
							var data = {
								obj : null,
								error : true,
								server_error : result == null
										? null
										: result.error
							};
							this.fireDataEvent("loadImportObjects", data);
							if (event_finish_func != null)
								event_finish_func(data);
						} else {
							var data = {
								obj : result,
								error : null,
								server_error : null
							};
							// currRoutesList
							this.fireDataEvent("loadImportObjects", data);
							if (event_finish_func != null)
								event_finish_func(data);
						}
					}, function() {
						var data = {
							obj : null,
							error : true,
							server_error : null
						};
						this.fireDataEvent("loadImportObjects", data);
						if (event_finish_func != null)
							event_finish_func(data);
					}, this);
			return request;

		},

		insertStationToCurrentRoute : function(stationModel, event_finish_func) {
			this.fireDataEvent("insertStationToCurrentRoute", stationModel);
			if (event_finish_func != null)
				event_finish_func(stationModel);
		},

		addNewStation : function(station, event_finish_func) {
			this.fireDataEvent("addNewStation", station);
			if (event_finish_func != null)
				event_finish_func(station);
		},

		startCreateNewRoute : function(data, status, event_finish_func) {

			this._routePage.setStatus(status);
			this._routePage.setCurrRouteModel(data);
			this.fireDataEvent("startCreateNewRoute", data);
			event_finish_func(data);
		},

		finishCreateNewRoute : function(isOK, event_finish_func) {

			var data = {
				error : true,
				isOK : isOK
			};

			if (isOK == false) {
				this._routePage.setStatus("show");
				var cloneRoute = bus.admin.helpers.ObjectHelper
						.clone(this._routePage.getRouteModel());
				this._routePage.setCurrRouteModel(cloneRoute);
				var loadRouteData = {
					route : cloneRoute,
					error : null,
					server_error : null
				};
				this.fireDataEvent("finishCreateNewRoute", data);
				this.fireDataEvent("loadRoute", loadRouteData);
			} else {

				var route = bus.admin.helpers.ObjectHelper
						.clone(this._routePage.getCurrRouteModel());
				var event_finish_func1 = qx.lang.Function.bind(function(e) {
							e.isOK = isOK;
							this.fireDataEvent("finishCreateNewRoute", e);

							var cloneRoute = bus.admin.helpers.ObjectHelper
									.clone(this._routePage.getRouteModel());
							var loadRouteData = {
								route : cloneRoute,
								error : null,
								server_error : null
							};
							this.fireDataEvent("loadRoute", loadRouteData);
							event_finish_func(e);
						}, this);
				if (this._routePage.getStatus() == "edit") {
					var updateData = {
						route : route,
						opts : {
							isUpdateSchedule : true,
							isUpdateMainInfo : false,
							isUpdateRouteRelations : true
						}
					};

					this.updateRoute(updateData, event_finish_func1);
				} else if (this._routePage.getStatus() == "new") {
					// send new route to the server
					this.insertRoute(route, event_finish_func1);
				}

				this._routePage.setStatus("show");
			}
		},

		loadRoutesList : function(city_id, route_type_id, event_finish_func) {
			this.debug("loadRoutesList event execute");

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
								server_error : result == null
										? null
										: result.error
							};
							this.fireDataEvent("loadRoutesList", data);
							event_finish_func(data);
						} else {
							var data = {
								routes : result,
								error : null,
								server_error : null
							};
							// currRoutesList
							this._routePage.setCurrRoutesList(result.routes);
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
			var reqObj = request.getRoute(data_json, function(response) {
						var result = response.getContent();
						if (result == null || result.error != null) {
							var data = {
								route : null,
								error : true,
								server_error : result == null
										? null
										: result.error
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
							this._routePage.setCurrRouteModel(cloneRoute);

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
		},

		insertRoute : function(routeModel, event_finish_func) {
			this.debug("insertRoute event execute");

			var request = new bus.admin.net.DataRequest();
			var reqObj = request.insertRoute(routeModel, function(response) {
						var result = response.getContent();
						if (result == null || result.error != null) {
							var data = {
								route : null,
								error : true,
								server_error : result == null
										? null
										: result.error
							};
							this.fireDataEvent("insertRoute", data);
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
							this._routePage.setCurrRouteModel(cloneRoute);
							// this._routePage.setCurrRoutesList(result.routes);
							var routes = this._routePage.getCurrRoutesList();
							if (routes == null) {
								this._routePage.setCurrRoutesList([]);
								routes = this._routePage.getCurrRoutesList();
							}
							routes.push(result);
							this.fireDataEvent("insertRoute", data);
							event_finish_func(data);
						}
					}, function() {
						var data = {
							route : null,
							error : true,
							server_error : null
						};
						this.fireDataEvent("insertRoute", data);
						event_finish_func(data);
					}, this);
			return request;
		},

		updateRoute : function(updateData, event_finish_func) {
			this.debug("updateRoute event execute");

			var request = new bus.admin.net.DataRequest();
			var reqObj = request.updateRoute(updateData, function(response) {
				var result = response.getContent();
				if (result == null || (result != null && result.error != null)) {
					var data = {
						updateData : null,
						error : true,
						server_error : result == null ? null : result.error
					};
					this.fireDataEvent("updateRoute", data);
					event_finish_func(data);
				} else {
					var data = {
						updateData : result,
						error : null,
						server_error : null
					};
					var route = result.route;
					var cloneRoute = bus.admin.helpers.ObjectHelper
							.clone(route);
					if (this._routePage.getRouteModel() != null
							&& this._routePage.getRouteModel().id == route.id) {
						this._routePage.setRouteModel(result.route);
					}
					if (this._routePage.getCurrRouteModel() != null
							&& this._routePage.getCurrRouteModel().id == route.id) {
						this._routePage.setCurrRouteModel(cloneRoute);
					}

					var routes = this._routePage.getCurrRoutesList();
					if (routes == null) {
						this._routePage.setCurrRoutesList([]);
					} else {
						for (var i = 0; i < routes.length; i++) {
							if (routes[i].id = route.id) {
								routes[i] = route;
								break;
							}
						}
						this._routePage.setCurrRoutesList(routes);
					}
					this.fireDataEvent("updateRoute", data);
					event_finish_func(data);
				}
			}, function() {
				var data = {
					updateData : null,
					error : true,
					server_error : null
				};
				this.fireDataEvent("updateRoute", data);
				event_finish_func(data);
			}, this);
			return request;
		},

		removeRoute : function(routeID, event_finish_func) {
			this.debug("removeRoute event execute");

			var request = new bus.admin.net.DataRequest();
			var reqObj = request.removeRoute(routeID, function(response) {
						var result = response.getContent();
						if (result == null || result.error != null) {
							var data = {
								routeID : routeID,
								error : true,
								server_error : result == null
										? null
										: result.error
							};
							this.fireDataEvent("removeRoute", data);
							event_finish_func(data);
						} else {
							var data = {
								routeID : routeID,
								error : null,
								server_error : null
							};
							var routes = this._routePage.getCurrRoutesList();
							if (routes == null) {
								this._routePage.setCurrRoutesList([]);
								routes = this._routePage.getCurrRoutesList();
							} else {
								for (var i = 0; i < routes.length; i++) {
									if (routes[i].id = routeID) {
										routes.splice(i, 1);
										break;
									}
								}
								this._routePage.setCurrRoutesList(routes);
							}
							this._routePage.setCurrRouteModel(null);
							this._routePage.setRouteModel(null);
							this.fireDataEvent("removeRoute", data);
							event_finish_func(data);
						}
					}, function() {
						var data = {
							routeID : routeID,
							error : true,
							server_error : null
						};
						this.fireDataEvent("removeRoute", data);
						event_finish_func(data);
					}, this);
			return request;
		}

	}
});