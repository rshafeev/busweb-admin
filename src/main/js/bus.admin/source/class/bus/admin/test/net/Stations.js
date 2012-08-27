

qx.Class.define("bus.admin.test.net.Stations", {
			extend : qx.core.Object,

			construct : function(sync) {
				if (sync != null) {
					this.__sync = sync;
				}

			},
			members : {
				__sync : false,
				getStationsByCityAndTransportType : function(data,
						completed_func, failed_func, self) {
					var request = new qx.io.remote.Request(
							"stations/get_all_by_city_and_transport.json",
							"POST", "application/json");
					var stations = bus.admin.helpers.ObjectHelper
							.clone(bus.admin.test.net.DataSource.stations);

					var responce = {
						getContent : function() {
							return stations;
						}
					};
					var event_completed_func = qx.lang.Function.bind(
							completed_func, self);
					event_completed_func(responce);
					return request;
				},
				insertStation : function(stationModel, completed_func,
						failed_func, self) {
					var request = new qx.io.remote.Request(
							"stations/insert.json", "POST", "application/json");

					var responce = {
						getContent : function() {
							return stationModel;
						}
					};

					// var new_station_json =
					// qx.lang.Json.stringify(stationModel);
					var event_completed_func = qx.lang.Function.bind(
							completed_func, self);
					event_completed_func(responce);

					return request;
				}
			}
		});
