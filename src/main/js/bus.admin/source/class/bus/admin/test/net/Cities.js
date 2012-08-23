

qx.Class.define("bus.admin.test.net.Cities", {
			extend : qx.core.Object,

			construct : function(sync) {
				if (sync != null) {
					this.__sync = sync;
				}

			},
			members : {
				__sync : false,
				getAllCities : function(completed_func, failed_func, self) {
					var request = new qx.io.remote.Request(
							"cities/get_all.json", "POST", "application/json");
					var cities = bus.admin.helpers.ObjectHelper
							.clone(bus.admin.test.net.DataSource.cities);

					var responce = {
						getContent : function() {
							return cities;
						}
					};
					var event_completed_func = qx.lang.Function.bind(
							completed_func, self);
					event_completed_func(responce);
					return request;
				},
				updateCity : function(cityModel, completed_func, failed_func,
						self) {
					var request = new qx.io.remote.Request(
							"cities/update.json", "POST", "application/json");
					request.setAsynchronous(!this.__sync);
					request.setParseJson(true);

					request.setParameter("row_city", cityModel, true);
					request.addListener("completed", completed_func, self);
					request.addListener("failed", failed_func, self);
					request.send();
					return request;
				},
				insertCity : function(cityModel, completed_func, failed_func,
						self) {
					var request = new qx.io.remote.Request(
							"cities/insert.json", "POST", "application/json");
					request.setAsynchronous(!this.__sync);
					request.setParseJson(true);
					request.setParameter("row_city", cityModel, true);
					request.addListener("completed", completed_func, self);
					request.addListener("failed", failed_func, self);
					request.send();
					return request;
				},
				deleteCity : function(city_id, completed_func, failed_func,
						self) {
					var request = new qx.io.remote.Request(
							"cities/delete.json", "POST", "application/json");
					request.setAsynchronous(!this.__sync);
					request.setParseJson(true);
					request.setParameter("city_id", city_id, true);
					request.addListener("completed", completed_func, self);
					request.addListener("failed", failed_func, self);
					request.send();
					return request;
				}

			}
		});
