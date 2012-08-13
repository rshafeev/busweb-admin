

qx.Class.define("bus.admin.net.CitiesRequest", {
	extend : qx.core.Object,
   
	construct : function() {

	},
	members : {
		getAllCities : function(completed_func,failed_func,self) {
			var request = new qx.io.remote.Request("cities/get_all.json",
					"POST", "application/json");
			request.setParseJson(true);
			request.addListener("completed", completed_func, self);
			request.addListener("failed", failed_func, self);
			request.send();
		},
		updateCity : function(cityModel,completed_func,failed_func,self) {
			var request = new qx.io.remote.Request("cities/update.json",
					"POST", "application/json");
			request.setParseJson(true);
			request.setParameter("row_city",cityModel,true);
			request.addListener("completed", completed_func, self);
			request.addListener("failed", failed_func, self);
			request.send();
		},
		insertCity : function(cityModel,completed_func,failed_func,self) {
			var request = new qx.io.remote.Request("cities/insert.json",
					"POST", "application/json");
			request.setParseJson(true);
			request.setParameter("row_city",cityModel,true);
			request.addListener("completed", completed_func, self);
			request.addListener("failed", failed_func, self);
			request.send();
		}
		
	}
});
