qx.Class.define("bus.admin.mvp.presenter.RoutesPresenter", {
			include : [bus.admin.mvp.presenter.mng.RoutesManager,
			bus.admin.mvp.presenter.mng.StationsManager],
			extend : qx.core.Object,
			events : {
				"loadRoutesList" : "qx.event.type.Data",

				"loadRoute" : "qx.event.type.Data",

				"startCreateNewRoute" : "qx.event.type.Data",

				"finishCreateNewRoute" : "qx.event.type.Data",
				
				"insert_station" : "qx.event.type.Data"

			},
			construct : function(_routePage) {
				this.base(arguments);
				this._routePage = _routePage;
			},
			members : {
				_routePage : null
			}

		});
