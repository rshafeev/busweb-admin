

qx.Mixin.define("bus.admin.mvp.presenter.mix.Cities", {
	construct : function() {

	},
	members : {

		_getAllCities : function(callback) {
			var dataRequest =  new bus.admin.net.DataRequest();
			var req = dataRequest.Cities().getAll(function(responce){
				var data = responce.getContent();
				if(data == null || data.error != null){
					var args = {
						cities : null,
						langs : null,
						error : true,
						server_error : server_error
					}
				}
				else{
					var args = {
						cities : cities,
						langs : bus.admin.AppProperties.LANGUAGES,
						error : false,
						server_error : null
					};
					this.getDataStorage().getCities().setData(data);
				}
				callback(data);
			},this);
			return req;
		}

		/*,

		__refresh_cities_ok : function(citiesData, langsData, event_finish_func) {
			
			var modelsContainer = qx.core.Init.getApplication()
			.getModelsContainer();
			this.debug("CitiesManager:__refresh_cities_ok()");
			modelsContainer.getCitiesModel().setData(citiesData);
			modelsContainer.getLangsModel().setData(langsData);
			var data = {
				models : {
					cities : citiesData,
					langs : langsData
				},
				error : false,
				server_error : null,
				test : "test!!!"
			};
			this.fireDataEvent("refresh_cities", data);
			event_finish_func(data);
		},

		__refresh_cities_failed : function(responce_cities, responce_langs,
			event_finish_func) {
			
			var server_error = null;
			if (responce_cities != null && responce_cities.server_error != null) {
				server_error = responce_cities.server_error;
			} else if (responce_langs != null
				&& responce_langs.server_error != null) {
				server_error = responce_langs.server_error;
			}
			var data = {
				models : {
					cities : null,
					langs : null
				},

				error : true,
				server_error : server_error
			};
			this.fireDataEvent("refresh_cities", data);
			event_finish_func(data);
		}*/
	}
});