

qx.Class.define("bus.admin.mvp.model.helpers.CitiesModelHelper", {
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
				},
				getCityStringValueByLang : function(cityModel, lang) {
					for (var i = 0; i < cityModel.names.length; i++) {

						if (cityModel.names[i].lang_id.toString() == lang
								.toString()) {
							return cityModel.names[i];
						}
					}
					return null;
				},
				/**
				 * Update(or insert) the StringValue of the city name  
				 * @param {} cityModel
				 * @param {} lang_id
				 * @param {} name
				 */
				updateCityName : function(cityModel,lang_id, name) {
					for (var i = 0; i < cityModel.names.length; i++) {
						if (cityModel.names[i].lang_id.toString() == lang_id
								.toString()) {
							cityModel.names[i].value = name;
							return;
						}
					}
					var stringValue = {
					   lang_id : lang_id,
					   value : name
					};
					var a = [];
					cityModel.names.push(stringValue);
				}

			}
		});
