qx.Class.define("bus.admin.mvp.model.GlobalDataStorage", {
			extend : qx.core.Object,
			
			construct : function() {
				this.base(arguments);
				var langsModel = new bus.admin.mvp.model.LanguagesModel();
				var citiesModel = new bus.admin.mvp.model.CitiesModel();
				this.setLangslangsModel);
				this.setCities(citiesModel);
			},
			properties : {
				cities : {
					nullable : true
				},
				langs : {
					nullable : true
				}
			},


			members : {
				
			}
		});