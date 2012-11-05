

qx.Class.define("bus.admin.net.impl.Stations", {
	extend : qx.core.Object,

	construct : function(sync) {
		if (sync != null) {
			this.__sync = sync;
		}

	},
	members : {
		__sync : false,
		getStationsByCityInBox : function(data, completed_func, failed_func,
				self) {
			var data_json = qx.lang.Json.stringify(data);
			this.debug(data);
			var request = new qx.io.remote.Request(
					"stations/get_all_by_city_inbox.json", "POST",
					"application/json");
			request.setAsynchronous(!this.__sync);
			request.setParseJson(true);
			request.setParameter("data", data_json, true);
			request.addListener("completed", completed_func, self);
			request.addListener("failed", failed_func, self);
			request.send();
			return request;
		},
		getStationsByCityAndTransportType : function(data, completed_func,
				failed_func, self) {
			var data_json = qx.lang.Json.stringify(data);
			this.debug(data);
			var request = new qx.io.remote.Request(
					"stations/get_all_by_city_and_transport.json", "POST",
					"application/json");
			request.setAsynchronous(!this.__sync);
			request.setParseJson(true);
			request.setParameter("data", data_json, true);
			request.addListener("completed", completed_func, self);
			request.addListener("failed", failed_func, self);
			request.send();
			return request;
		},
		updateStation : function(stationModel, completed_func, failed_func,
				self) {
			var update_station_json = qx.lang.Json.stringify(stationModel);
			var request = new qx.io.remote.Request("stations/update.json",
					"POST", "application/json");
			request.setAsynchronous(!this.__sync);
			request.setParseJson(true);

			request.setParameter("row_station", update_station_json, true);
			request.addListener("completed", completed_func, self);
			request.addListener("failed", failed_func, self);
			request.send();
			return request;
		},
		insertStation : function(stationModel, completed_func, failed_func,
				self) {
			var new_station_json = qx.lang.Json.stringify(stationModel);
			var request = new qx.io.remote.Request("stations/insert.json",
					"POST", "application/json");
			request.setAsynchronous(!this.__sync);
			request.setParseJson(true);
			request.setParameter("row_station", new_station_json, true);
			request.addListener("completed", completed_func, self);
			request.addListener("failed", failed_func, self);
			request.send();
			return request;
		},
		deleteStation : function(station_id, completed_func, failed_func, self) {
			var request = new qx.io.remote.Request("stations/delete.json",
					"POST", "application/json");
			request.setAsynchronous(!this.__sync);
			request.setParseJson(true);
			request.setParameter("station_id", station_id, true);
			request.addListener("completed", completed_func, self);
			request.addListener("failed", failed_func, self);
			request.send();
			return request;
		}

	}
});
