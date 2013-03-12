qx.Class.define("bus.admin.test.net.DataSource", {
	type : "static",

	statics : {
		cities : null,
		langs : null,
		stations : null,
		initialize : function() {
			var citiesStr = '[{"id":1,"location":{"lat":50.0,"lon":36.0},"scale":10,"name_key":1,"names":[{"id":5,"key_id":1,"lang_id":"c_uk","value":"Харкив"},{"id":7,"key_id":1,"lang_id":"c_en","value":"Kharkov"},{"id":6,"key_id":1,"lang_id":"c_ru","value":"Харьков"}]},{"id":2,"location":{"lat":50.0,"lon":30.0},"scale":8,"name_key":2,"names":[{"id":8,"key_id":2,"lang_id":"c_uk","value":"Кыив"},{"id":10,"key_id":2,"lang_id":"c_en","value":"Kiev"},{"id":9,"key_id":2,"lang_id":"c_ru","value":"Киев"}]}]';
			var langsStr = '[{"id":"c_en","name":"English"},{"id":"c_ru","name":"Русский"},{"id":"c_uk","name":"Українська"}]';
			var stationsStr = '{"city_id":36,"transport_type_id":"c_bus","stations":[{"id":26,"city_id":36,"location":{"lat":50.22544917062897,"lon":33.49365234375},"name_key":62,"names":[{"id":179,"key_id":62,"lang_id":"c_uk","value":"c"},{"id":181,"key_id":62,"lang_id":"c_ru","value":"b"},{"id":180,"key_id":62,"lang_id":"c_en","value":"a"}],"transports":[{"transport_type_id":"c_bus"}]},{"id":27,"city_id":36,"location":{"lat":49.95761007342958,"lon":35.438232421875},"name_key":63,"names":[{"id":182,"key_id":63,"lang_id":"c_uk","value":"r3"},{"id":184,"key_id":63,"lang_id":"c_ru","value":"r2"},{"id":183,"key_id":63,"lang_id":"c_en","value":"r1"}],"transports":[{"transport_type_id":"c_bus"}]},{"id":28,"city_id":36,"location":{"lat":50.19732606183873,"lon":35.51513671875},"name_key":64,"names":[{"id":185,"key_id":64,"lang_id":"c_uk","value":"t3"},{"id":187,"key_id":64,"lang_id":"c_ru","value":"t2"},{"id":186,"key_id":64,"lang_id":"c_en","value":"t1"}],"transports":[{"transport_type_id":"c_bus"}]},{"id":29,"city_id":36,"location":{"lat":49.9151827943988,"lon":36.13037109375},"name_key":65,"names":[{"id":188,"key_id":65,"lang_id":"c_uk","value":"e3"},{"id":190,"key_id":65,"lang_id":"c_ru","value":"e2"},{"id":189,"key_id":65,"lang_id":"c_en","value":"e1"}],"transports":[{"transport_type_id":"c_bus"}]},{"id":30,"city_id":36,"location":{"lat":50.16918637681652,"lon":33.44970703125},"name_key":66,"names":[{"id":191,"key_id":66,"lang_id":"c_uk","value":"y"},{"id":193,"key_id":66,"lang_id":"c_ru","value":"y"},{"id":192,"key_id":66,"lang_id":"c_en","value":"y"}],"transports":[{"transport_type_id":"c_bus"},{"transport_type_id":"c_tram"},{"transport_type_id":"c_trolley"}]},{"id":31,"city_id":36,"location":{"lat":50.02823920446827,"lon":36.21826171875},"name_key":67,"names":[{"id":194,"key_id":67,"lang_id":"c_uk","value":"u"},{"id":196,"key_id":67,"lang_id":"c_ru","value":"u"},{"id":195,"key_id":67,"lang_id":"c_en","value":"u"}],"transports":[{"transport_type_id":"c_bus"},{"transport_type_id":"c_tram"},{"transport_type_id":"c_trolley"},{"transport_type_id":"c_metro"}]}]}';
			this.cities = qx.lang.Json.parse(citiesStr);
			this.langs = qx.lang.Json.parse(langsStr);
			this.stations = qx.lang.Json.parse(stationsStr);
			
		},
		
		insertStation : function(stationModel){
			stationModel.id = 10;
			
		}

	}
});