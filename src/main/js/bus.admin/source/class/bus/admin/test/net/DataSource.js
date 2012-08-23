qx.Class.define("bus.admin.test.net.DataSource", {
	type : "static",

	statics : {
		cities : null,
		langs : null,
		initialize : function() {
			var citiesStr = '[{"id":1,"location":{"lat":50.0,"lon":36.0},"scale":10,"name_key":1,"names":[{"id":5,"key_id":1,"lang_id":"c_uk","value":"Харкив"},{"id":7,"key_id":1,"lang_id":"c_en","value":"Kharkov"},{"id":6,"key_id":1,"lang_id":"c_ru","value":"Харьков"}]},{"id":2,"location":{"lat":50.0,"lon":30.0},"scale":8,"name_key":2,"names":[{"id":8,"key_id":2,"lang_id":"c_uk","value":"Кыив"},{"id":10,"key_id":2,"lang_id":"c_en","value":"Kiev"},{"id":9,"key_id":2,"lang_id":"c_ru","value":"Киев"}]}]';
			var langsStr = '[{"id":"c_en","name":"English"},{"id":"c_ru","name":"Русский"},{"id":"c_uk","name":"Українська"}]';
			
			this.cities = qx.lang.Json.parse(citiesStr);
			this.langs = qx.lang.Json.parse(langsStr);
			
		}

	}
});