qx.Class.define("bus.admin.mvp.presenter.StationsPresenter", {
			include : [bus.admin.mvp.presenter.mng.StationsManager],
			extend : qx.core.Object,
			events : {

				/** ********************************************* */

				"load_stations" : "qx.event.type.Data",

				"load_stations_inbox" : "qx.event.type.Data",

				"insert_station" : "qx.event.type.Data",

				"update_station" : "qx.event.type.Data",

				"delete_station" : "qx.event.type.Data"

			},
			construct : function() {
				this.base(arguments);
			}

		});
