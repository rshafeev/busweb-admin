

qx.Class.define("bus.admin.AppProperties", {
	type : "static",

	statics : {
		DEFAULT_LANGUAGE : "en",

		LANGUAGES : 
		[{
			"id":"c_en",
			"name":"English"
		},
		{
			"id":"c_ru",
			"name":"Русский"
		},
		{
			"id":"c_uk",
			"name":"Українська"
		}],


		getLocale : function(){
			return "c_" + qx.locale.Manager.getInstance().getLocale();
		}
	}
});
