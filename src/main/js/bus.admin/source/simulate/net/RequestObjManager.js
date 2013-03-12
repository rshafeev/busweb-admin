qx.Class.define("bus.admin.test.net.RequestObjManager", {
			implement : [bus.admin.net.IRequestObjManager],
			extend : qx.core.Object,

			construct : function() {
				bus.admin.test.net.DataSource.initialize();
			},
			members : {

				getCitiesRequestObj : function(sync) {
					var cities = new bus.admin.test.net.Cities(sync);
					return cities;
				},
				getLangsRequestObj : function(sync) {
					var langs = new bus.admin.test.net.Langs(sync);
					return langs;
				},
				getStationsRequestObj : function(sync) {
					var stations = new bus.admin.test.net.Stations(sync);
					return stations;
				}
			}
		});