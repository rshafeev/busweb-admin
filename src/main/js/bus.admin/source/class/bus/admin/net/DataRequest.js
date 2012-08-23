/*
 * 
 * this._cities = bus.admin.net.RequestFactory.createCitiesObj(sync);
 */

qx.Class.define("bus.admin.net.DataRequest", {
			extend : qx.core.Object,

			construct : function(sync) {
				if (sync != null) {
					this.__sync = sync;
				}
			},
			members : {
				__sync : false,
				getAllCities : function(completed_func, failed_func, self) {
					var cities = bus.admin.net.DataRequestFactory
							.getCitiesRequestObj(this.__sync);
					return cities.getAllCities(completed_func, failed_func,
							self);
				},
				updateCity : function(cityModel, completed_func, failed_func,
						self) {
					var cities = bus.admin.net.DataRequestFactory
							.getCitiesRequestObj(this.__sync);
					return cities.updateCity(completed_func, failed_func, self);
				},
				insertCity : function(cityModel, completed_func, failed_func,
						self) {
					var cities = bus.admin.net.DataRequestFactory
							.getCitiesRequestObj(this.__sync);
					return cities.insertCity(completed_func, failed_func, self);
				},
				deleteCity : function(city_id, completed_func, failed_func,
						self) {
					var cities = bus.admin.net.DataRequestFactory
							.getCitiesRequestObj(this.__sync);
					return cities.deleteCity(completed_func, failed_func, self);
				},
				getAllLanguages : function(completed_func, failed_func, self) {
					var langs = bus.admin.net.DataRequestFactory
							.getLangsRequestObj(this.__sync);
					return langs.getAllLanguages(completed_func, failed_func,
							self);
				}
			}
		});
