qx.Class.define("bus.admin.net.DataRequestFactory", {
	type : "static",

	statics : {
		requestObjManager : null,
		initialize : function(requestObjManager) {
			bus.admin.net.DataRequestFactory.requestObjManager = requestObjManager;
		},

		getRequestObjManager : function() {
			var manager = bus.admin.net.DataRequestFactory.requestObjManager;
			return manager;
		},

		getCitiesRequestObj : function(sync) {
			var manager = bus.admin.net.DataRequestFactory.requestObjManager;
			if (manager == null)
				return null;
			return manager.getCitiesRequestObj(sync);
		},
		getLangsRequestObj : function(sync) {
			var manager = bus.admin.net.DataRequestFactory.requestObjManager;
			if (manager == null)
				return null;
			return manager.getLangsRequestObj(sync);
		}

	}
});
