qx.Class.define("bus.admin.mvp.presenter.RoutesPresenter", {
			include : [bus.admin.mvp.presenter.mix.RoutesManager],
			extend : qx.core.Object,
			
			events : {
				"loadRoutesList" : "qx.event.type.Data",

				"loadRoute" : "qx.event.type.Data",

				"insertRoute" : "qx.event.type.Data",

				"removeRoute" : "qx.event.type.Data",

				"updateRoute" : "qx.event.type.Data",
				
				"startCreateNewRoute" : "qx.event.type.Data",

				"finishCreateNewRoute" : "qx.event.type.Data",

				"addNewStation" : "qx.event.type.Data",

				"insertStationToCurrentRoute" : "qx.event.type.Data",
				
				"loadImportObjects" : "qx.event.type.Data",
				
				"loadImportRoute" : "qx.event.type.Data"
			
			},
			
			construct : function(routePage, globalPresenter) {
				this.base(arguments);
				this._routePage = routePage;
				this._globalPresenter = globalPresenter;
			},

			members : {
				_routePage : null,
				_globalPresenter : null
			},

			properties : {
				
				dataStorage :{
					nullable : true
				},

				globalDataStorage : {
					nullable : true
				}
			}

		});
