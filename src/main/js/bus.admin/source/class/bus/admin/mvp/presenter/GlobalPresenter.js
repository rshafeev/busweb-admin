qx.Class.define("bus.admin.mvp.presenter.GlobalPresenter", {
			include : [bus.admin.mvp.presenter.mng.CitiesManager],
			extend : qx.core.Object,
			events : {
				/**
				 * data: {models:{cities,langs}, error,fire_obj,server_error}
				 * 
				 * @type String
				 */
				"refresh_cities" : "qx.event.type.Data",
				
				/**
				 * data: {oldCity,newCity, error,fire_ob,server_errorj}
				 * 
				 * @type String
				 */
				"moveCity" : "qx.event.type.Data",
				"updateCity" : "qx.event.type.Data",
				"insertCity" : "qx.event.type.Data",
				"deleteCity" : "qx.event.type.Data"
			},
			construct : function() {
				this.base(arguments);
			}

		});