/*
 * 
 * this._cities = bus.admin.net.RequestFactory.createCitiesObj(sync);
 */

qx.Class.define("bus.admin.net.DataRequest", {
	extend : qx.core.Object,

	construct : function(sync) {
		
	},
	members : {
		_cities : null,

		Cities : function(){
			if(this._cities == null){
				this._cities = new bus.admin.net.impl.Cities();
			}
			return this._cities;
		}
	}

});
