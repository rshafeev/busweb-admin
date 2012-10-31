

qx.Class.define("bus.admin.net.impl.Routes", {
	extend : qx.core.Object,

	construct : function(sync) {
		if (sync != null) {
			this.__sync = sync;
		}

	},
	members : {
		__sync : false,
		getRoutesList : function(data, completed_func,
				failed_func, self) {
			
			var data_json = qx.lang.Json.stringify(data);
			this.debug(data);
			var request = new qx.io.remote.Request(
					"routes/get_all_list.json", "POST",
					"application/json");
			request.setAsynchronous(!this.__sync);
			request.setParseJson(true);
			request.setParameter("data", data_json, true);
			request.addListener("completed", completed_func, self);
			request.addListener("failed", failed_func, self);
			request.send();
			return request;
		}

	}
});
