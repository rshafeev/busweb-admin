

qx.Class.define("bus.admin.net.impl.ImportObjects", {
			extend : qx.core.Object,

			construct : function(sync) {
				if (sync != null) {
					this.__sync = sync;
				}
			},
			members : {
				__sync : false,
				get : function(objID, completed_func, failed_func,
						self) {
					var request = new qx.io.remote.Request("/import/get",
							"POST", "application/json");
					request.setAsynchronous(!this.__sync);
					request.setParseJson(true);
					request.setParameter("objID", objID, true);
					request.addListener("completed", completed_func, self);
					request.addListener("failed", failed_func, self);
					request.send();
					return request;
				},

				getList : function(data, completed_func, failed_func,
						self) {
					var data_json = qx.lang.Json.stringify(data);
					this.debug(data);
					var request = new qx.io.remote.Request(
							"/import/get_all", "POST", "application/json");
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
