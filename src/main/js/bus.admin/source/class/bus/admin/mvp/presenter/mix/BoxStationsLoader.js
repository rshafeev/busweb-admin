

qx.Mixin.define("bus.admin.mvp.presenter.mix.BoxStationsLoader", {
	members : {
		/**
 	     * Возвращает набор остановок, местоположения которых попадает в заданный прямоугольник. 
 		 * @param  p1 {bus.admin.mvp.model.geom.PointModel}    Координаты левого верхнего угла прямоугольника. 
 		 * @param  p2 {bus.admin.mvp.model.geom.PointModel}    Координаты правого нижнего угла прямоугольника.
 		 * @param  cityID {Integer} ID города.
 		 * @param  langID {String}  ID языка названий станций.
 		 * @param  callback {Function}  Callback функиция, аргументом которой выступает массив остановок
         * типа {@link bus.admin.mvp.model.StationsBoxModel}.
         */
         loadBoxStations : function(p1, p2, cityID, langID, callback){
         	this.debug("execute loadBoxStations()");
         	var args = {
         		stationsBox : null 			 	

         	};

         	if (cityID <= 0){
         		if(callback!= undefined)
         			callback(args);	
         		return;
         	}
         	var requestModel = new bus.admin.mvp.model.StationsBoxModel();
         	requestModel.setCityID(cityID);
         	requestModel.setLangID(langID);
         	requestModel.setLtPoint(p1);
         	requestModel.setRbPoint(p2);


         	var dataRequest =  new bus.admin.net.DataRequest();
         	var req = dataRequest.Stations().getStationsFromBox(requestModel, function(responce){
         		var data = responce.getContent();
         		this.debug("loadBoxStations(): received cities data");
         		console.debug(data);
         		var args ={};
         		if(data == null || data.error != null){
         			args = {
         				stationsBox : null,
         				error : true,
         				errorCode : data.error != undefined ? data.error.code : "req_err",
         				errorRemoteInfo :  data.error != undefined ? data.error.info : null
         			}
         		}
         		else{
         			var responseModel = new bus.admin.mvp.model.StationsBoxModel(data);
         			args = {
         				stationsBox :  responseModel,
         				error  :  false
         			};
         		}
         		callback(args);
         	},this);

         }
     }
 });