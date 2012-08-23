

qx.Class.define("bus.admin.net.impl.Langs", {
			extend : qx.core.Object,

			construct : function(sync) {
				if (sync != null) {
					this.__sync = sync;
				}

			},
			members : {
				__sync : false,
				getAllLanguages : function(completed_func, failed_func, self) {
					var request = new qx.io.remote.Request(
							"langs/get_all.json", "POST", "application/json");
					request.setAsynchronous(!this.__sync);
					request.setParseJson(true);
					request.addListener("completed", completed_func, self);
					request.addListener("failed", failed_func, self);
					request.send();
					return request;
				}
			}
		});
