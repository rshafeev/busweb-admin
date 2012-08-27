

qx.Class.define("bus.admin.mvp.model.helpers.StationsModelHelper", {
			type : "static",

			statics : {
				getStationNameByLang : function(stationModel, lang) {
					for (var i = 0; i < stationModel.names.length; i++) {

						if (stationModel.names[i].lang_id.toString() == lang
								.toString()) {
							return stationModel.names[i].value;
						}
					}
					return null;
				},
				getStationStringValueByLang : function(stationModel, lang) {
					for (var i = 0; i < stationModel.names.length; i++) {

						if (stationModel.names[i].lang_id.toString() == lang
								.toString()) {
							return stationModel.names[i];
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
				updateStationName : function(stationModel,lang_id, name) {
					for (var i = 0; i < stationModel.names.length; i++) {
						if (stationModel.names[i].lang_id.toString() == lang_id
								.toString()) {
							stationModel.names[i].value = name;
							return;
						}
					}
					var stringValue = {
					   lang_id : lang_id,
					   value : name
					};
					var a = [];
					stationModel.names.push(stringValue);
				}

			}
		});
