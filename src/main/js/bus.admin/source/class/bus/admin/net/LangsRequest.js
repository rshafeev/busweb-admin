

qx.Class.define("bus.admin.net.LangsRequest", {
	extend : qx.core.Object,
   
	construct : function() {

	},
	members : {
		getAllLanguages : function(completed_func,failed_func,self) {
			var request = new qx.io.remote.Request("langs/get_all.json",
					"POST", "application/json");
			request.setParseJson(true);
			request.addListener("completed", completed_func, self);
			request.addListener("failed", failed_func, self);
			request.send();
		}
	}
});
