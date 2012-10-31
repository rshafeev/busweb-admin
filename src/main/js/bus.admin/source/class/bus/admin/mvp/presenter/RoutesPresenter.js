qx.Class.define("bus.admin.mvp.presenter.RoutesPresenter", {
			include : [bus.admin.mvp.presenter.mng.RoutesManager],
			extend : qx.core.Object,
			events : {
				"loadRoutesList" : "qx.event.type.Data",

				"loadRoute" : "qx.event.type.Data"
			},
			construct : function() {
				this.base(arguments);
			}

		});
