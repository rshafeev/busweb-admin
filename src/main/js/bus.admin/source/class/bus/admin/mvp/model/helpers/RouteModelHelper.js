

qx.Class.define("bus.admin.mvp.model.helpers.RouteModelHelper", {
			type : "static",

			statics : {
				getNameByLang : function(routeModel, lang) {
					if (routeModel == null || lang == null)
						return null;
					for (var i = 0; i < routeModel.name.length; i++) {

						if (routeModel.name[i].lang_id.toString() == lang
								.toString()) {
							return routeModel.name[i].value;
						}
					}
					return null;
				}

			}
		});
