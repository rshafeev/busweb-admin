qx.Class.define("bus.admin.mvp.model.ModelsContainer", {
			extend : qx.core.Object,
			construct : function() {
				this.base(arguments);
				var langsModel = new bus.admin.mvp.model.LanguagesModel();
				var citiesModel = new bus.admin.mvp.model.CitiesModel();
				this.setLangsModel(langsModel);
				this.setCitiesModel(citiesModel);
			},
			properties : {
				citiesModel : {
					nullable : true
				},
				langsModel : {
					nullable : true
				}
			}
		});