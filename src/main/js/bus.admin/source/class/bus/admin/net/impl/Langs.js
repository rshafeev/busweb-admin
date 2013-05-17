

qx.Class.define("bus.admin.net.impl.Langs", {
	extend : qx.core.Object,

	construct : function(sync) {
		if (sync != undefined) {
			this.__sync = sync;
		}
		this.__contextPath  = qx.core.Init.getApplication().getDataStorage().getContextPath();
	},
	members : {
		/**
		 * Синхронный запрос (блокирующий)  или асинхронный?
		 * @type {Boolean}
		 */
		__sync : false,

		/**
		 * Папка web-приложения на сервере
		 * @type {String}
		 */
		 __contextPath : null, 

		 getAllLanguages : function(completed_func, failed_func, self) {
		 	var request = new qx.io.remote.Request(this.__contextPath + "langs/get_all", "POST", "application/json");
		 	request.setAsynchronous(!this.__sync);
		 	request.setParseJson(true);
		 	request.addListener("completed", completed_func, self);
		 	request.addListener("failed", failed_func, self);
		 	request.send();
		 	return request;
		 }
		}
	});
