

qx.Mixin.define("bus.admin.mvp.presenter.mng.StationsManager", {
			construct : function() {

			},
			members : {
				loadStations : function(city_id, transport_type_id,
						event_finish_func) {
					this.debug("load_stations event execute");
					var globalPresenter = qx.core.Init.getApplication()
							.getPresenter();
					var stationsRequest = new bus.admin.net.DataRequest();
					var request_data = {
						city_id : city_id,
						transport_type_id : transport_type_id
					};
					// this.debug(qx.lang.Json.stringify(request_data));
					var request = stationsRequest
							.getStationsByCityAndTransportType(request_data,
									function(response) {
										var result = response.getContent();
										if (result == null
												|| result.error != null) {
											var data = {
												stations : null,
												city_id : null,
												transport_type_id : null,
												error : true,
												server_error : result.error
											};
											globalPresenter.fireDataEvent(
													"load_stations", data);
											event_finish_func(data);
										} else {
											var data = {
												stations : result.stations,
												city_id : result.city_id,
												transport_type_id : result.transport_type_id,
												error : null,
												server_error : null
											};
											globalPresenter.fireDataEvent(
													"load_stations", data);
											event_finish_func(data);
										}
									}, function() {
										var data = {
											stations : null,
											city_id : null,
											transport_type_id : null,
											error : true,
											server_error : null
										};
										globalPresenter.fireDataEvent(
												"load_stations", data);
										event_finish_func(data);
									}, this);

				},
				insertStation : function(station, event_finish_func) {
					this.debug("insertCity event execute");
					var globalPresenter = qx.core.Init.getApplication()
							.getPresenter();
					var stationsRequest = new bus.admin.net.DataRequest();

					var request = stationsRequest.insertStation(station,
							function(response) {
								var result = response.getContent();
								if (result == null || result.error != null) {
									var data = {
										station : result,
										error : true,
										server_error : result.error
									};
									globalPresenter.fireDataEvent(
											"insert_station", data);
									event_finish_func(data);
								} else {
									var data = {
										station : result,
										error : null,
										server_error : null
									};
									globalPresenter.fireDataEvent(
											"insert_station", data);
									event_finish_func(data);
								}
							}, function() {
								var data = {
									city : null,
									error : true,
									server_error : null
								};
								globalPresenter.fireDataEvent("insert_station",
										data);
								event_finish_func(data);
							}, this);
					return request;
				},
				updateStation : function(old_station, new_station,
						event_finish_func) {
					this.debug("insertCity event execute");
					var globalPresenter = qx.core.Init.getApplication()
							.getPresenter();
					var stationsRequest = new bus.admin.net.DataRequest();

					var request = stationsRequest.updateStation(new_station,
							function(response) {
								var result = response.getContent();
								if (result == null || result.error != null) {
									var data = {
										new_station : null,
										old_station : old_station,
										error : true,
										server_error : result.error
									};
									globalPresenter.fireDataEvent(
											"update_station", data);
									event_finish_func(data);
								} else {
									var data = {
										new_station : result,
										old_station : old_station,
										error : false,
										server_error : null
									};
									globalPresenter.fireDataEvent(
											"update_station", data);
									event_finish_func(data);
								}
							}, function() {
								var data = {
									new_station : null,
									old_station : old_station,
									error : true,
									server_error : null
								};
								globalPresenter.fireDataEvent("update_station",
										data);
								event_finish_func(data);
							}, this);
					return request;
				}

			}
		});