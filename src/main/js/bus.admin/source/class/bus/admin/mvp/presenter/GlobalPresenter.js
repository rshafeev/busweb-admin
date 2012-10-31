qx.Class.define("bus.admin.mvp.presenter.GlobalPresenter", {
			include : [bus.admin.mvp.presenter.mng.CitiesManager,
					bus.admin.mvp.presenter.mng.StationsManager],
			extend : qx.core.Object,
			events : {

				/**
				 * data: {models:{cities,langs}, error,server_error}
				 * 
				 * @type String
				 */
				"refresh_cities" : "qx.event.type.Data",

				/**
				 * data: {oldCity,newCity, error,server_errorj}
				 * 
				 * @type String
				 */
				"update_city" : "qx.event.type.Data",

				"insert_city" : "qx.event.type.Data",

				"delete_city" : "qx.event.type.Data"

			},
			construct : function() {
				this.base(arguments);
			}

		});
