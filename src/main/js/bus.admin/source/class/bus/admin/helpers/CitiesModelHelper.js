

qx.Class.define("bus.admin.helpers.CitiesModelHelper", {
			type : "static",

			statics : {
				getCityNameByLang : function(cityModel, lang) {
					for (var i = 0; i < cityModel.names.length; i++) {

						if (cityModel.names[i].lang_id.toString() == lang
								.toString()) {
							return cityModel.names[i].value;
						}
					}
					return null;
				}
				
			}
		});
