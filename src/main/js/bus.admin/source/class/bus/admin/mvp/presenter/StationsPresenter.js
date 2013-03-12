qx.Class.define("bus.admin.mvp.presenter.StationsPresenter", {
			include : [bus.admin.mvp.presenter.mix.StationsManager],
			extend : qx.core.Object,
			events : {

				/** ********************************************* */

				"load_stations" : "qx.event.type.Data",

				"load_stations_inbox" : "qx.event.type.Data",

				"insert_station" : "qx.event.type.Data",

				"update_station" : "qx.event.type.Data",

				"delete_station" : "qx.event.type.Data"

			},

			construct : function(globalPresenter) {
				this.base(arguments);
				this._globalPresenter = globalPresenter;
				this.setGlobalDataStorage = globalPresenter.getDataStorage();
			},
            members : {
            	_dataStorage : null,

               _globalPresenter : null,

               getDataModel : function(key){
                  
               } 
            }
		});
