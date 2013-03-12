

qx.Class.define("bus.admin.net.impl.Cities", {
	extend : Object,

	construct : function() {
	},

	members : {

		getAll : function(callback, self) {
			var request = new qx.io.remote.Request(
				"/cities/get_all", "POST", "application/json");
			request.setParseJson(true);
			request.addListener("completed", callback, self);
			request.addListener("failed", callback, self);
			request.send();
			return request;
		},

		update : function(cityModel, completed_func, failed_func,
			self) {
			var request = new qx.io.remote.Request(
				"/cities/update", "POST", "application/json");
			request.setAsynchronous(!this.__sync);
			request.setParseJson(true);

			request.setParameter("row_city", cityModel, true);
			request.addListener("completed", completed_func, self);
			request.addListener("failed", failed_func, self);
			request.send();
			return request;
		},

		insert : function(cityModel, completed_func, failed_func,
			self) {
			var request = new qx.io.remote.Request(
				"/cities/insert", "POST", "application/json");
			request.setAsynchronous(!this.__sync);
			request.setParseJson(true);
			request.setParameter("row_city", cityModel, true);
			request.addListener("completed", completed_func, self);
			request.addListener("failed", failed_func, self);
			request.send();
			return request;
		},

		remove : function(city_id, completed_func, failed_func,
			self) {
			var request = new qx.io.remote.Request(
				"/cities/delete", "POST", "application/json");
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
