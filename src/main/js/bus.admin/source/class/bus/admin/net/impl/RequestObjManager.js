qx.Class.define("bus.admin.net.impl.RequestObjManager", {
			implement : [bus.admin.net.IRequestObjManager],
			extend : qx.core.Object,

			construct : function() {

			},
			members : {
				getCitiesRequestObj : function(sync) {
					var cities = new bus.admin.net.impl.Cities(sync);
					return cities;
				},
				getLangsRequestObj : function(sync) {
					var langs = new bus.admin.net.impl.Langs(sync);
					return langs;
				},
				getStationsRequestObj : function(sync) {
					var stations = new bus.admin.net.impl.Stations(sync);
					return stations;
				},
				getRoutesRequestObj : function(sync) {
					var routes = new bus.admin.net.impl.Routes(sync);
					return routes;
					
				}
				
			}
		});