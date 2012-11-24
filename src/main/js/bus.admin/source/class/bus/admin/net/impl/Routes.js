

qx.Class.define("bus.admin.net.impl.Routes", {
			extend : qx.core.Object,

			construct : function(sync) {
				if (sync != null) {
					this.__sync = sync;
				}

			},
			members : {
				__sync : false,
				getRoutesList : function(data, completed_func, failed_func,
						self) {

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
				},
				getRoute : function(data, completed_func, failed_func, self) {

					var data_json = qx.lang.Json.stringify(data);
					this.debug(data);
					var request = new qx.io.remote.Request(
							"routes/get_route.json", "POST", "application/json");
					request.setAsynchronous(!this.__sync);
					request.setParseJson(true);
					request.setParameter("data", data_json, true);
					request.addListener("completed", completed_func, self);
					request.addListener("failed", failed_func, self);
					request.send();
					return request;
				},
				insertRoute : function(data, completed_func, failed_func, self) {

					var data_json = qx.lang.Json.stringify(data);
					this.debug(data);
					var request = new qx.io.remote.Request(
							"routes/insert_route.json", "POST", "application/json");
					request.setAsynchronous(!this.__sync);
					request.setParseJson(true);
					request.setParameter("data", data_json, true);
					request.addListener("completed", completed_func, self);
					request.addListener("failed", failed_func, self);
					request.send();
					return request;
					
				},
				
				updateRoute : function(data, completed_func, failed_func, self) {

					var data_json = qx.lang.Json.stringify(data);
					this.debug(data);
					var request = new qx.io.remote.Request(
							"routes/update.json", "POST", "application/json");
					request.setAsynchronous(!this.__sync);
					request.setParseJson(true);
					request.setParameter("data", data_json, true);
					request.addListener("completed", completed_func, self);
					request.addListener("failed", failed_func, self);
					request.send();
					return request;
					
				},
				
				removeRoute : function(route_id, completed_func, failed_func, self) {
					var request = new qx.io.remote.Request(
							"routes/delete.json", "POST", "application/json");
					request.setAsynchronous(!this.__sync);
					request.setParseJson(true);
					request.setParameter("route_id", route_id.toString(), true);
					request.addListener("completed", completed_func, self);
					request.addListener("failed", failed_func, self);
					request.send();
					return request;
					
				}
				

			}
		});
