

qx.Class.define("bus.admin.mvp.model.helpers.TransportTypeHelper", {
			type : "static",

			statics : {
				getTransportTypeIDByRouteType : function(routeTypeID) {
					switch (routeTypeID) {
						case "c_route_metro" :
							return "c_metro";
						case "c_route_metro_transition" :
							return "c_foot";
						case "c_route_bus" :
							return "c_bus";
						case "c_route_trolley" :
							return "c_trolley";
						case "c_route_tram" :
							return "c_tram";
						default :
							return "c_bus";
					};

					return null;
				}
			}
		});
