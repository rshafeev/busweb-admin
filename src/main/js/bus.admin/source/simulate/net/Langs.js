

qx.Class.define("bus.admin.test.net.Langs", {
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
					var langs = bus.admin.helpers.ObjectHelper
							.clone(bus.admin.test.net.DataSource.langs);

					var responce = {
						getContent : function() {
							return langs;
						}
					};
					var event_completed_func = qx.lang.Function.bind(
							completed_func, self);
					event_completed_func(responce);

					return request;
				}
			}
		});
