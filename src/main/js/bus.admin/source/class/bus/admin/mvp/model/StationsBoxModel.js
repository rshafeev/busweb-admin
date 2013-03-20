/*************************************************************************
 *
 * Copyright:
 * Bus.Admin-lib is copyright (c) 2012, {@link http://ways.in.ua} Inc. All Rights Reserved. 
 *
 * License:
 * Bus.Admin-lib is free software, licensed under the MIT license. 
 * See the file {@link http://api.ways.in.ua/license.txt license.txt} in this distribution for more details.
 *
 * Authors:
 * Roman Shafeyev (rs@premiumgis.com)
 *
 *************************************************************************/

/**
 * Модель хранит набор моделей остановок, которые находятся в заданном кадрате. Каждая модель хранит id, название и местоположение остановки.
 * <code>
 * var dataModel = [
 * {
 * 	  id : 1,
 * 	  name : "ст. Пушкинская",
 * 	  location : {
 * 	  		lat : 50.3242,
 * 	  		lon : 36.4444
 * 	  }
 * },
 * {
 * 	  id : 3,
 * 	  name : "ст. Университет",
 * 	  location : {
 * 	  		lat : 51.00,
 * 	  		lon : 37.333
 * 	  }
 * }
 *
 * ];
 * var model = new bus.admin.mvp.model.StationsBoxModel(dataModel); 
 * var st = model.getStationByID(3);
 * this.debug(st.getId());                 // print 3
 * this.debug(st.getName());			   // print ст. Университет
 * this.debug(st.getLocation().getLat());  // print 51.00
 * this.debug(st.getLocation().getLon());  // print 37.333
 * </code>
 */
 qx.Class.define("bus.admin.mvp.model.StationsBoxModel", {
 	extend : Object,

 	/**
 	 * @param  dataModel {Object[]|null}  JS объект.
 	 */
 	 construct : function(dataModel) {
 	 	this.__stations = [];
 	 	if(dataModel != undefined){
 	 		this.fromDataModel(dataModel);
 	 	}
 	 },

 	 members : 
 	 {
 	 	ltPoint : null,

 	 	__stations : null,


 	 	getAll : function(){
 	 		return this.__stations;
 	 	},

 	 	fromDataModel : function(dataModel){
 	 		this.__stations = [];
 	 		for(var i = 0; i < dataModel.length; i++){
 	 			this.__stations.push(qx.data.marshal.Json.createModel(dataModel[i]));
 	 		}
 	 	},

 	 	getStationByID : function(stationID){
 	 		if(this.__stations == null)
 	 			return null;
 	 		for(var i = 0; i < this.__stations.length; i++){
 	 			if(stationID == this.__stations[i].getId()){
 	 				return this.__stations[i];
 	 			}
 	 		}
 	 		return null;
 	 	}

 	 }

 	});